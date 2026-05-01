import { ISeat } from "@domain/entities/seat.entity";
import { ISeatLayout } from "@domain/entities/seatLayout.entity";
import { ISeatType } from "@domain/entities/seatType.entity";
import { SeatDetailsDTO, SeatLayoutDetailsDTO, SeatTypeDTO } from "@application/dtos/seat-dtos";

export class SeatMapper {
  /**
   * Convert ISeat entity to SeatDetailsDTO
   * Used by: GetSeatByIdUseCase, UpdateSeatUseCase
   */
  static toSeatDTO(seat: ISeat): SeatDetailsDTO {
    return {
      _id: seat.id,
      aircraftId: seat.aircraftId,
      seatTypeId: seat.seatTypeId,
      seatNumber: seat.seatNumber,
      rowNumber: seat.rowNumber,
      columnPosition: seat.columnPosition,
      section: seat.section,
      position: seat.position,
      isExitRow: seat.isExitRow,
      isBlocked: seat.isBlocked,
      features: seat.features,
      createdAt: seat.createdAt,
      updatedAt: seat.updatedAt,
      ...(seat.blockReason && { blockReason: seat.blockReason }),
      ...(seat.seatTypeName && { seatTypeName: seat.seatTypeName }),
      ...(seat.cabinClass && { cabinClass: seat.cabinClass }),
    };
  }

  /**
   * Convert array of ISeat entities to SeatDetailsDTO[]
   * Used by: GetSeatsByAircraftIdUseCase, GetAvailableSeatsUseCase
   */
  static toSeatDTOs(seats: ISeat[]): SeatDetailsDTO[] {
    return seats.map((seat) => this.toSeatDTO(seat));
  }

  /**
   * Convert ISeatLayout entity to SeatLayoutDetailsDTO
   * Used by: GetSeatLayoutByIdUseCase, GetSeatLayoutsByAircraftIdUseCase
   */
  static toSeatLayoutDTO(layout: ISeatLayout): SeatLayoutDetailsDTO {
    return {
      _id: layout.id,
      aircraftId: layout.aircraftId,
      cabinClass: layout.cabinClass,
      layout: layout.layout,
      startRow: layout.startRow,
      endRow: layout.endRow,
      totalRows: layout.totalRows,
      seatsPerRow: layout.seatsPerRow,
      columns: layout.columns,
      aisleColumns: layout.aisleColumns,
      exitRows: layout.exitRows,
      wingStartRow: layout.wingStartRow,
      wingEndRow: layout.wingEndRow,
      createdAt: layout.createdAt,
      updatedAt: layout.updatedAt,
    };
  }

  /**
   * Convert array of ISeatLayout entities to SeatLayoutDetailsDTO[]
   * Used by: GetSeatLayoutsByAircraftIdUseCase
   */
  static toSeatLayoutDTOs(layouts: ISeatLayout[]): SeatLayoutDetailsDTO[] {
    return layouts.map((layout) => this.toSeatLayoutDTO(layout));
  }

  /**
   * Convert ISeatType entity to SeatTypeDTO
   * Used by: GetSeatTypeByIdUseCase, GetAllSeatTypesUseCase
   */
  static toSeatTypeDTO(seatType: ISeatType): SeatTypeDTO {
    return {
      _id: seatType.id,
      seatTypeName: seatType.seatTypeName,
      cabinClass: seatType.cabinClass,
      basePriceMultiplier: seatType.basePriceMultiplier,
      seatPitch: seatType.seatPitch,
      seatWidth: seatType.seatWidth,
      features: seatType.features,
      createdAt: seatType.createdAt,
      updatedAt: seatType.updatedAt,
    };
  }

  /**
   * Convert array of ISeatType entities to SeatTypeDTO[]
   * Used by: GetAllSeatTypesUseCase
   */
  static toSeatTypeDTOs(seatTypes: ISeatType[]): SeatTypeDTO[] {
    return seatTypes.map((seatType) => this.toSeatTypeDTO(seatType));
  }
}