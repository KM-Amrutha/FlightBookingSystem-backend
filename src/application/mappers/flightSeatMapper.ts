import { IFlightSeat } from "@domain/entities/flightSeat.entity";
import { IFlight } from "@domain/entities/flight.entity";
import { FlightSeatDTO, FlightSeatMapDTO, CreateFlightSeatDTO } from "@application/dtos/flightSeat-dtos";

export class FlightSeatMapper {

  /**
   * Convert CreateFlightSeatDTO → Partial<IFlightSeat>
   * Used by: FlightSeatRepository.createFlightSeats (via usecase)
   */
  static toFlightSeatEntity(dto: CreateFlightSeatDTO): Partial<IFlightSeat> {
    return {
      flightId: dto.flightId,
      aircraftId: dto.aircraftId,
      seatId: dto.seatId,
      seatNumber: dto.seatNumber,
      rowNumber: dto.rowNumber,
      columnPosition: dto.columnPosition,
      section: dto.section,
      position: dto.position,
      cabinClass: dto.cabinClass,
      isExitRow: dto.isExitRow,
      features: dto.features,
      isBooked: dto.isBooked,
      isBlocked: dto.isBlocked,
      isLocked: dto.isLocked,
    };
  }

  static toFlightSeatEntities(dtos: CreateFlightSeatDTO[]): Partial<IFlightSeat>[] {
    return dtos.map((dto) => this.toFlightSeatEntity(dto));
  }

  static toFlightSeatDTO(seat: IFlightSeat, flight: IFlight): FlightSeatDTO {
    const baseFare = flight.baseFare[seat.cabinClass as keyof typeof flight.baseFare] ?? 0;
    const surcharge = flight.seatSurcharge[seat.position as keyof typeof flight.seatSurcharge] ?? 0;
    const fare = baseFare + surcharge;

    return {
      _id: seat.id,
      flightId: seat.flightId,
      aircraftId: seat.aircraftId,
      seatId: seat.seatId,
      seatNumber: seat.seatNumber,
      rowNumber: seat.rowNumber,
      columnPosition: seat.columnPosition,
      section: seat.section,
      position: seat.position,
      cabinClass: seat.cabinClass,
      isExitRow: seat.isExitRow,
      features: seat.features,
      isBooked: seat.isBooked,
      isBlocked: seat.isBlocked,
      isLocked: seat.isLocked,
      ...(seat.lockedUntil && { lockedUntil: seat.lockedUntil.toISOString() }),
      fare,
      ...(seat.bookingId && { bookingId: seat.bookingId }),
      createdAt: seat.createdAt.toISOString(),
      updatedAt: seat.updatedAt.toISOString(),
    };
  }

  static toFlightSeatMapDTO(
    seats: IFlightSeat[],
    flight: IFlight,
    cabinClass: string
  ): FlightSeatMapDTO {
    const baseFare = flight.baseFare[cabinClass as keyof typeof flight.baseFare] ?? 0;

    return {
      flightId: flight.id,
      cabinClass,
      baseFare,
      seatSurcharge: {
        ...(flight.seatSurcharge.window && { window: flight.seatSurcharge.window }),
        ...(flight.seatSurcharge.aisle && { aisle: flight.seatSurcharge.aisle }),
        ...(flight.seatSurcharge.extraLegroom && { extraLegroom: flight.seatSurcharge.extraLegroom }),
      },
      seats: seats.map((seat) => this.toFlightSeatDTO(seat, flight)),
    };
  }

  static toFlightSeatDTOs(seats: IFlightSeat[], flight: IFlight): FlightSeatDTO[] {
    return seats.map((seat) => this.toFlightSeatDTO(seat, flight));
  }
}