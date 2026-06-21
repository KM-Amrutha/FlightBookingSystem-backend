import { inject, injectable } from "inversify";
import { IFlightRepository } from "@di/file-imports-index";
import { SearchFlightsDTO, SearchFlightResponseDTO, SearchFlightResultDTO } from "@application/dtos/flight-dtos";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { ISearchFlightsUseCase } from "@di/file-imports-index";
import { FlightMapper } from "@application/mappers/flightMapper";
import { validationError } from "@presentation/middlewares/error.middleware";
import { paginateReq, paginateRes } from "@shared/utils/pagination";

@injectable()
export class SearchFlightsUseCase implements ISearchFlightsUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

 private buildDateRange(date: string): { start: Date; end: Date; nextDayEnd: Date } {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  // go back 6hrs 30min to catch IST midnight flights
  start.setTime(start.getTime() - (6 * 60 + 30) * 60 * 1000);
  
  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);
  
  const nextDayEnd = new Date(date);
  nextDayEnd.setDate(nextDayEnd.getDate() + 1);
  nextDayEnd.setUTCHours(23, 59, 59, 999);
  
  return { start, end, nextDayEnd };
}
  private deduplicate(flights: SearchFlightResultDTO[]): SearchFlightResultDTO[] {
    const seen = new Set<string>();
    return flights.filter((f) => {
      if (seen.has(f.id)) return false;
      seen.add(f.id);
      return true;
    });
  }

  private extractIataCodes(
    flights: SearchFlightResultDTO[],
    type: "arrival" | "departure"
  ): string[] {
    return [
      ...new Set(
        flights
          .map((f) => (type === "arrival" ? f.arrival.iataCode : f.departure.iataCode))
          .filter((code): code is string => !!code)
      ),
    ];
  }
private isValidLayover(arrivalTime: string, departureTime: string): boolean {
  const layoverMinutes =
    (new Date(departureTime).getTime() - new Date(arrivalTime).getTime()) / 60000;
  return layoverMinutes >= 45 && layoverMinutes <= 480;
}


private async fetchAllLegs(
  from: string,
  to: string,
  dateStart: Date,
  dateEnd: Date,
  nextDayEnd: Date
): Promise<SearchFlightResultDTO[]> {

  // Q1 — all flights departing FROM origin
  const q1Raw = await this._flightRepository.searchFlights([from], [], dateStart, nextDayEnd);
  const q1 = FlightMapper.toSearchResultDTOs(q1Raw).filter(
    (f) => f.departure.iataCode === from && f.arrival.iataCode !== from
  );

  // Q2 — all flights arriving AT destination
  const q2Raw = await this._flightRepository.searchFlights([], [to], dateStart, nextDayEnd);
  const q2 = FlightMapper.toSearchResultDTOs(q2Raw).filter(
    (f) => f.arrival.iataCode === to && f.departure.iataCode !== to
  );

  // Direct flights
  const directFlights = q1.filter((f) => f.arrival.iataCode === to);

  // One-stop first legs — depart from origin, don't arrive at destination
  const firstLegs = q1.filter((f) => f.arrival.iataCode !== to);

  // One-stop second legs — arrive at destination, don't depart from origin
  const secondLegs = q2.filter((f) => f.departure.iataCode !== from);

  const firstLegArrivalCodes = new Set(firstLegs.map((f) => f.arrival.iataCode));
  const secondLegDepartureCodes = new Set(secondLegs.map((f) => f.departure.iataCode));

  const oneStopConnectingCodes = [...firstLegArrivalCodes].filter((code) =>
    secondLegDepartureCodes.has(code)
  );

  // Valid one-stop first legs
  const validFirstLegs = firstLegs.filter((firstLeg) => {
    if (!oneStopConnectingCodes.includes(firstLeg.arrival.iataCode)) return false;
    return secondLegs.some(
      (secondLeg) =>
        secondLeg.departure.iataCode === firstLeg.arrival.iataCode &&
        this.isValidLayover(firstLeg.arrival.time, secondLeg.departure.time)
    );
  });

  // Valid one-stop second legs
  const validSecondLegs = secondLegs.filter((secondLeg) => {
    return validFirstLegs.some(
      (firstLeg) =>
        firstLeg.arrival.iataCode === secondLeg.departure.iataCode &&
        this.isValidLayover(firstLeg.arrival.time, secondLeg.departure.time)
    );
  });

  // ── Two-stop logic ─────────────────────────────────────────────────────
  // Q3 — flights departing from ALL first leg arrival codes
  // middle leg must connect firstLegArrivals → secondLegDepartures
  const firstLegArrivalCodesArr = [...firstLegArrivalCodes];
  const secondLegDepartureCodesArr = [...secondLegDepartureCodes];

  let validMiddleLegs: SearchFlightResultDTO[] = [];
  let validTwoStopSecondLegs: SearchFlightResultDTO[] = [];

  if (firstLegArrivalCodesArr.length > 0 && secondLegDepartureCodesArr.length > 0) {
    const q3Raw = await this._flightRepository.searchFlights(
      firstLegArrivalCodesArr, [], dateStart, nextDayEnd
    );
    const q3 = FlightMapper.toSearchResultDTOs(q3Raw).filter(
      (f) =>
        f.departure.iataCode !== from &&
        f.arrival.iataCode !== from &&
        f.arrival.iataCode !== to &&           // must NOT arrive at destination directly
        f.departure.iataCode !== to &&         // must NOT depart from destination
        secondLegDepartureCodesArr.includes(f.arrival.iataCode) // must arrive at a second leg departure
    );

    // Middle leg valid if:
    // 1. A first leg arrives at middle leg departure with valid layover
    // 2. Middle leg arrives at a code that has a valid second leg to destination
    validMiddleLegs = q3.filter((middleLeg) => {
      const hasValidFirstLeg = firstLegs.some(
        (firstLeg) =>
          firstLeg.arrival.iataCode === middleLeg.departure.iataCode &&
          this.isValidLayover(firstLeg.arrival.time, middleLeg.departure.time)
      );
      const hasValidSecondLeg = secondLegs.some(
        (secondLeg) =>
          secondLeg.departure.iataCode === middleLeg.arrival.iataCode &&
          this.isValidLayover(middleLeg.arrival.time, secondLeg.departure.time)
      );
      return hasValidFirstLeg && hasValidSecondLeg;
    });

    // Two-stop second legs — reuse Q2 secondLegs, validate layover with middle leg
    validTwoStopSecondLegs = secondLegs.filter((secondLeg) => {
      return validMiddleLegs.some(
        (middleLeg) =>
          middleLeg.arrival.iataCode === secondLeg.departure.iataCode &&
          this.isValidLayover(middleLeg.arrival.time, secondLeg.departure.time)
      );
    });
  }

  return this.deduplicate([
    ...directFlights,
    ...validFirstLegs,
    ...validSecondLegs,
    ...validMiddleLegs,
    ...validTwoStopSecondLegs,
  ]);
}

  async execute(data: SearchFlightsDTO): Promise<SearchFlightResponseDTO> {
  const { from, to, departureDate, passengers, tripType, returnDate } = data;

  if (!from || !to || !departureDate || !passengers)
    throw new validationError("From, to, departure date and passengers are required");
  if (from.trim().toLowerCase() === to.trim().toLowerCase())
    throw new validationError("Departure and arrival destinations cannot be the same");
  if (passengers < 1)
    throw new validationError("At least 1 passenger is required");
  if (isNaN(new Date(departureDate).getTime()))
    throw new validationError("Invalid departure date format");
  if (tripType === "round-trip" && !returnDate)
    throw new validationError("Return date is required for round-trip");

  const { pageNumber, limitNumber } = paginateReq(data.page ?? 1, data.limit ?? 6);

  const { start, end, nextDayEnd } = this.buildDateRange(departureDate);
  const allOutbound = await this.fetchAllLegs(from, to, start, end, nextDayEnd);

  const outboundSlice = allOutbound.slice(
    (pageNumber - 1) * limitNumber,
    pageNumber * limitNumber
  );
  const outboundPagination = paginateRes({
    totalCount: allOutbound.length,
    pageNumber,
    limitNumber,
  });

  let returnSlice: SearchFlightResultDTO[] | undefined;
  let returnPagination: { currentPage: number; totalPages: number } | undefined;

  if (tripType === "round-trip" && returnDate) {
    const { start: retStart, end: retEnd, nextDayEnd: retNextDayEnd } =
      this.buildDateRange(returnDate);
    const allReturn = await this.fetchAllLegs(to, from, retStart, retEnd, retNextDayEnd);

    returnSlice = allReturn.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );
    returnPagination = paginateRes({
      totalCount: allReturn.length,
      pageNumber,
      limitNumber,
    });
  }

  return {
    outbound: outboundSlice,
    ...(returnSlice && { return: returnSlice }),
    pagination: {
      outbound: {
        currentPage: outboundPagination.currentPage,
        totalPages: outboundPagination.totalPages,
        totalCount: allOutbound.length,
      },
      ...(returnPagination && {
        return: {
          currentPage: returnPagination.currentPage,
          totalPages: returnPagination.totalPages,
          totalCount: returnSlice ? allOutbound.length : 0,
        },
      }),
    },
  };
}

  
}