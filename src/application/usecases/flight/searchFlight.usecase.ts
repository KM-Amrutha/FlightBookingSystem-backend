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
      if (seen.has(f._id)) return false;
      seen.add(f._id);
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

  // Q1 — all flights departing FROM origin, excluding return flights
  const q1Raw = await this._flightRepository.searchFlights([from], [], dateStart, nextDayEnd);
  const q1 = FlightMapper.toSearchResultDTOs(q1Raw).filter(
    (f) => f.departure.iataCode === from && f.arrival.iataCode !== from
  );

  // Q2 — all flights arriving AT destination, excluding return flights
  const q2Raw = await this._flightRepository.searchFlights([], [to], dateStart, nextDayEnd);
  const q2 = FlightMapper.toSearchResultDTOs(q2Raw).filter(
    (f) => f.arrival.iataCode === to && f.departure.iataCode !== to
  );

  // Direct flights — depart from, arrive to
  const directFlights = q1.filter((f) => f.arrival.iataCode === to);

  // One-stop first legs — depart from, don't arrive at destination
  const firstLegs = q1.filter((f) => f.arrival.iataCode !== to);

  // One-stop second legs — arrive at destination, don't depart from origin
  const secondLegs = q2.filter((f) => f.departure.iataCode !== from);

  // Valid connecting airports for one-stop
  const firstLegArrivalCodes = new Set(firstLegs.map((f) => f.arrival.iataCode));
  const secondLegDepartureCodes = new Set(secondLegs.map((f) => f.departure.iataCode));

  const oneStopConnectingCodes = [...firstLegArrivalCodes].filter((code) =>
    secondLegDepartureCodes.has(code)
  );

  // Filter first legs — only keep if at least one valid onward second leg exists with valid layover
  const validFirstLegs = firstLegs.filter((firstLeg) => {
    if (!oneStopConnectingCodes.includes(firstLeg.arrival.iataCode)) return false;
    return secondLegs.some(
      (secondLeg) =>
        secondLeg.departure.iataCode === firstLeg.arrival.iataCode &&
        this.isValidLayover(firstLeg.arrival.time, secondLeg.departure.time)
    );
  });

  // Filter second legs — only keep if at least one valid prior first leg exists with valid layover
  const validSecondLegs = secondLegs.filter((secondLeg) => {
    return validFirstLegs.some(
      (firstLeg) =>
        firstLeg.arrival.iataCode === secondLeg.departure.iataCode &&
        this.isValidLayover(firstLeg.arrival.time, secondLeg.departure.time)
    );
  });

  // Two-stop middle legs
  // Q3 — flights departing from first leg arrival codes, not arriving at origin or destination
  const twoStopCodes = [...firstLegArrivalCodes].filter(
    (code) => !secondLegDepartureCodes.has(code)
  );

  let validMiddleLegs: SearchFlightResultDTO[] = [];
  let validTwoStopSecondLegs: SearchFlightResultDTO[] = [];

  if (twoStopCodes.length > 0) {
    const q3Raw = await this._flightRepository.searchFlights(
      twoStopCodes, [], dateStart, nextDayEnd
    );
    const q3 = FlightMapper.toSearchResultDTOs(q3Raw).filter(
      (f) =>
        f.departure.iataCode !== from &&
        f.arrival.iataCode !== from &&
        f.departure.iataCode !== to &&
        f.arrival.iataCode !== to
    );

    // Middle legs valid if:
    // 1. A first leg arrives at middle leg departure with valid layover
    // 2. Middle leg arrives at a code that has a second leg to destination with valid layover
    const q4Raw = await this._flightRepository.searchFlights([], [to], dateStart, nextDayEnd);
    const q4 = FlightMapper.toSearchResultDTOs(q4Raw).filter(
      (f) => f.arrival.iataCode === to && f.departure.iataCode !== from
    );

    validMiddleLegs = q3.filter((middleLeg) => {
      const hasValidFirstLeg = firstLegs.some(
        (firstLeg) =>
          firstLeg.arrival.iataCode === middleLeg.departure.iataCode &&
          this.isValidLayover(firstLeg.arrival.time, middleLeg.departure.time)
      );
      const hasValidSecondLeg = q4.some(
        (secondLeg) =>
          secondLeg.departure.iataCode === middleLeg.arrival.iataCode &&
          this.isValidLayover(middleLeg.arrival.time, secondLeg.departure.time)
      );
      return hasValidFirstLeg && hasValidSecondLeg;
    });

    // Two-stop second legs — arrive at destination, depart from middle leg arrivals
    const middleLegArrivalCodes = new Set(validMiddleLegs.map((f) => f.arrival.iataCode));
    validTwoStopSecondLegs = q4.filter((secondLeg) => {
      if (!middleLegArrivalCodes.has(secondLeg.departure.iataCode)) return false;
      return validMiddleLegs.some(
        (middleLeg) =>
          middleLeg.arrival.iataCode === secondLeg.departure.iataCode &&
          this.isValidLayover(middleLeg.arrival.time, secondLeg.departure.time)
      );
    });
  }

  // Merge all valid flights — no duplicates
  const allFlights = this.deduplicate([
    ...directFlights,       // 1. Direct
    ...validFirstLegs,      // 2. One-stop first legs
    ...validSecondLegs,     // 3. One-stop second legs
    ...validMiddleLegs,     // 4. Two-stop middle legs
    ...validTwoStopSecondLegs, // 5. Two-stop second legs
  ]);

  return allFlights;
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