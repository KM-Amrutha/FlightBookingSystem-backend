import { IFlightSeat } from "@domain/entities/flightSeat.entity";
import { FlightSeatDTO, FlightSeatMapDTO } from "@application/dtos/flightSeat-dtos";

export class FlightSeatMapper {

  /**
   * Convert CreateFlightSeatDTO → Partial<IFlightSeat>
   * Used by: FlightSeatRepository.createFlightSeats (via usecase)
   */

  static toFlightSeatDTO(seat: IFlightSeat, fare:number): FlightSeatDTO {
   
    return {
      id: seat.id,
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
    flightId: string,
    cabinClass: string,
    baseFare: number,            
    seatSurcharge: {
      window?: number;
      aisle?: number;
      extraLegroom?: number;
    }
  ): FlightSeatMapDTO {
    return {
      flightId,
      cabinClass,
      baseFare,
      seatSurcharge,
      seats: seats.map((seat) => {
        const surcharge = seatSurcharge[seat.position as keyof typeof seatSurcharge] ?? 0;
        const fare = baseFare + surcharge; // ✅ calculation in usecase caller, mapper just assembles
        return this.toFlightSeatDTO(seat, fare);
      }),
    };
  }
  static toFlightSeatDTOs(seats: IFlightSeat[], fareMap: Map<string, number>): FlightSeatDTO[] {
    return seats.map((seat) => {
      const fare = fareMap.get(seat.id) ?? 0;
      return this.toFlightSeatDTO(seat, fare);
    });
  }
}