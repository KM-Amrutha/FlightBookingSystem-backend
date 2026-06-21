import { inject, injectable } from "inversify";
import { IFlightSeatRepository, IFlightRepository } from "@di/file-imports-index";
import { FlightSeatMapDTO } from "@application/dtos/flightSeat-dtos";
import { NotFoundError, ForbiddenError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetFlightSeatsUseCase } from "@di/file-imports-index";
import { FlightSeatMapper } from "@application/mappers/flightSeatMapper";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class GetFlightSeatsUseCase implements IGetFlightSeatsUseCase {
  constructor(
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private _flightSeatRepository: IFlightSeatRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private _flightRepository: IFlightRepository
  ) {}

  async execute(
    flightId: string,
    requesterId: string,
    role: "provider" | "user"
  ): Promise<FlightSeatMapDTO[]> {
    if (!flightId) {
      throw new validationError(FLIGHT_MESSAGES.FLIGHT_ID_REQUIRED);     
    }

    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) {
      throw new NotFoundError(FLIGHT_MESSAGES.NOT_FOUND);                  
    }

    if (role === "provider") {
      if (flight.providerId !== requesterId) {
        throw new ForbiddenError(FLIGHT_MESSAGES.SEAT_VIEW_FORBIDDEN);    
      }
    }

    if (role === "user") {
      if (flight.adminApproval.status !== "approved") {
        throw new ForbiddenError(FLIGHT_MESSAGES.FLIGHT_NOT_AVAILABLE);   
      }
      if (flight.flightStatus !== "scheduled") {
        throw new ForbiddenError(FLIGHT_MESSAGES.FLIGHT_NOT_AVAILABLE);    
      }
    }

    let seats = await this._flightSeatRepository.getFlightSeatsByFlightId(flightId);
    if (!seats || seats.length === 0) return [];

    if (role === "user") {
      seats = seats.filter((seat) => !seat.isBlocked);
    }

    const groupedByCabin = seats.reduce((acc, seat) => {
      if (!acc[seat.cabinClass]) acc[seat.cabinClass] = [];
      acc[seat.cabinClass]!.push(seat);
      return acc;
    }, {} as Record<string, typeof seats>);

    return Object.entries(groupedByCabin).map(([cabinClass, cabinSeats]) => {
      const baseFare = flight.baseFare[cabinClass as keyof typeof flight.baseFare] ?? 0;
      const seatSurcharge = {
        ...(flight.seatSurcharge.window !== undefined && { window: flight.seatSurcharge.window }),
        ...(flight.seatSurcharge.aisle !== undefined && { aisle: flight.seatSurcharge.aisle }),
        ...(flight.seatSurcharge.extraLegroom !== undefined && { extraLegroom: flight.seatSurcharge.extraLegroom }),
      };

      return FlightSeatMapper.toFlightSeatMapDTO(
        cabinSeats,
        flight.id,
        cabinClass,
        baseFare,       
        seatSurcharge  
      );
    });
  }
}