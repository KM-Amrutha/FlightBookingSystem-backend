import { inject, injectable } from "inversify";
import { IFlightSeatRepository, IFlightRepository } from "@di/file-imports-index";
import { FlightSeatMapDTO } from "@application/dtos/flightSeat-dtos";
import { NotFoundError, ForbiddenError, validationError } from "@presentation/middlewares/error.middleware";
import { TYPES_AIRCRAFT_REPOSITORIES } from "@di/types-repositories";
import { IGetFlightSeatsUseCase } from "@di/file-imports-index";
import { FlightSeatMapper } from "@application/mappers/flightSeatMapper";
import { IFlightSeat } from "@domain/entities/flightSeat.entity";

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
      throw new validationError("Flight ID is required");
    }

    const flight = await this._flightRepository.getFlightDetails(flightId);
    if (!flight) {
      throw new NotFoundError("Flight not found");
    }

    // Provider — must own the flight
    if (role === "provider") {
      if (flight.providerId !== requesterId) {
        throw new ForbiddenError("You don't have permission to view this flight's seats");
      }
    }

    // User — flight must be approved and scheduled
    if (role === "user") {
      if (flight.adminApproval.status !== "approved") {
        throw new ForbiddenError("This flight is not available for booking");
      }
      if (flight.flightStatus !== "scheduled") {
        throw new ForbiddenError("This flight is not available for booking");
      }
    }

    let seats = await this._flightSeatRepository.getFlightSeatsByFlightId(flightId);
    if (!seats || seats.length === 0) return [];

    // User sees only available seats — filter out blocked ones
    if (role === "user") {
      seats = seats.filter((seat) => !seat.isBlocked);
    }

    const groupedByCabin = seats.reduce((acc, seat) => {
      if (!acc[seat.cabinClass]) {
        acc[seat.cabinClass] = [];
      }
      acc[seat.cabinClass]!.push(seat);
      return acc;
    }, {} as Record<string, IFlightSeat[]>);

    return Object.entries(groupedByCabin).map(([cabinClass, cabinSeats]) =>
      FlightSeatMapper.toFlightSeatMapDTO(cabinSeats, flight, cabinClass)
    );
  }
}