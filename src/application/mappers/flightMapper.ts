import { IFlight } from "@domain/entities/flight.entity";
import { CreateFlightDTO, FlightListDTO, FlightDetailsDTO, SearchFlightResultDTO } from "@application/dtos/flight-dtos";

export class FlightMapper {

  /**
   * Convert CreateFlightDTO → Partial<IFlight>
   * Used by: FlightRepository.createFlight (via usecase)
   */
  static toFlightEntity(dto: CreateFlightDTO): Partial<IFlight> {
    return {
      flightId: dto.flightId,
      flightNumber: dto.flightNumber,
      providerId: dto.providerId,
      aircraftId: dto.aircraftId,
      ...(dto.seatLayoutId && { seatLayoutId: dto.seatLayoutId }),
      aircraftName: dto.aircraftName ?? "",
      departureDestinationId: dto.departureDestinationId,
      arrivalDestinationId: dto.arrivalDestinationId,
      departureTime: new Date(dto.departureTime),
      arrivalTime: new Date(
        new Date(dto.departureTime).getTime() + dto.durationMinutes * 60 * 1000
      ),
      durationMinutes: dto.durationMinutes,
      ...(dto.gate && { gate: dto.gate }),
      ...(dto.bufferMinutes && { bufferMinutes: dto.bufferMinutes }),
      baseFare: dto.baseFare,
      seatSurcharge: dto.seatSurcharge,
      baggageRules: dto.baggageRules,
      ...(dto.luggageRuleId && { luggageRuleId: dto.luggageRuleId }),
      ...(dto.foodMenuId && { foodMenuId: dto.foodMenuId }),
      flightType: dto.flightType ?? "outbound",
      ...(dto.parentFlightId && { parentFlightId: dto.parentFlightId }),
      ...(dto.recurringGroupId && { recurringGroupId: dto.recurringGroupId }),
      ...(dto.recurringDays && { recurringDays: dto.recurringDays }),
    };
  }

  static toFlightListDTO(flight: IFlight, providerName?: string): FlightListDTO {
    return {
      _id: flight.id,
      flightId: flight.flightId,
      flightNumber: flight.flightNumber,
      aircraftName: flight.aircraftName,
      providerId: flight.providerId,
      ...(providerName && { providerName }),
      flightType: flight.flightType,
      ...(flight.parentFlightId && { parentFlightId: flight.parentFlightId }),
      ...(flight.recurringGroupId && { recurringGroupId: flight.recurringGroupId }),
      departureDestinationId: flight.departureDestinationId,
      arrivalDestinationId: flight.arrivalDestinationId,
      ...(flight.departureDestination && {
        departureDestination: {
          name: flight.departureDestination.name,
          iataCode: flight.departureDestination.iataCode,
        }
      }),
      ...(flight.arrivalDestination && {
        arrivalDestination: {
          name: flight.arrivalDestination.name,
          iataCode: flight.arrivalDestination.iataCode,
        }
      }),
      ...(flight.gate && { gate: flight.gate }),
      seatSurcharge: {
        ...(flight.seatSurcharge.window && { window: flight.seatSurcharge.window }),
        ...(flight.seatSurcharge.aisle && { aisle: flight.seatSurcharge.aisle }),
        ...(flight.seatSurcharge.extraLegroom && { extraLegroom: flight.seatSurcharge.extraLegroom }),
      },
      departureTime: flight.departureTime.toISOString(),
      arrivalTime: flight.arrivalTime.toISOString(),
      durationMinutes: flight.durationMinutes,
      baseFare: {
        economy: flight.baseFare.economy ?? 0,
        ...(flight.baseFare.premium_economy && { premium_economy: flight.baseFare.premium_economy }),
        ...(flight.baseFare.business && { business: flight.baseFare.business }),
        ...(flight.baseFare.first && { first: flight.baseFare.first }),
      },
      baggageRules: {
        freeCabinKg: flight.baggageRules?.freeCabinKg ?? 0,
        extraChargePerKg: flight.baggageRules?.extraChargePerKg ?? 0,
        ...(flight.baggageRules?.maxExtraKg && { maxExtraKg: flight.baggageRules.maxExtraKg }),
      },
      adminApproval: {
        status: flight.adminApproval.status,
        ...(flight.adminApproval.reviewedAt && {
          reviewedAt: flight.adminApproval.reviewedAt.toISOString(),
        }),
        ...(flight.adminApproval.reason && { reason: flight.adminApproval.reason }),
      },
      flightStatus: flight.flightStatus,
    };
  }

  static toFlightListDTOs(flights: IFlight[]): FlightListDTO[] {
    return flights.map((flight) => this.toFlightListDTO(flight));
  }

  static toFlightDetailsDTO(flight: IFlight): FlightDetailsDTO {
    return {
      _id: flight.id,
      flightId: flight.flightId,
      flightNumber: flight.flightNumber,
      aircraftName: flight.aircraftName,
      providerId: flight.providerId,
      aircraftId: flight.aircraftId,
      seatLayoutId: flight.seatLayoutId,
      flightType: flight.flightType,
      ...(flight.parentFlightId && { parentFlightId: flight.parentFlightId }),
      ...(flight.recurringGroupId && { recurringGroupId: flight.recurringGroupId }),
      ...(flight.recurringDays && { recurringDays: flight.recurringDays }),
      departureDestinationId: flight.departureDestinationId,
      arrivalDestinationId: flight.arrivalDestinationId,
      ...(flight.departureDestination && {
        departureDestination: {
          name: flight.departureDestination.name,
          iataCode: flight.departureDestination.iataCode,
        }
      }),
      ...(flight.arrivalDestination && {
        arrivalDestination: {
          name: flight.arrivalDestination.name,
          iataCode: flight.arrivalDestination.iataCode,
        }
      }),
      departureTime: flight.departureTime.toISOString(),
      arrivalTime: flight.arrivalTime.toISOString(),
      durationMinutes: flight.durationMinutes,
      ...(flight.bufferMinutes && { bufferMinutes: flight.bufferMinutes }),
      ...(flight.gate && { gate: flight.gate }),
      baseFare: {
        economy: flight.baseFare.economy ?? 0,
        ...(flight.baseFare.premium_economy && { premium_economy: flight.baseFare.premium_economy }),
        ...(flight.baseFare.business && { business: flight.baseFare.business }),
        ...(flight.baseFare.first && { first: flight.baseFare.first }),
      },
      seatSurcharge: {
        ...(flight.seatSurcharge.window && { window: flight.seatSurcharge.window }),
        ...(flight.seatSurcharge.aisle && { aisle: flight.seatSurcharge.aisle }),
        ...(flight.seatSurcharge.extraLegroom && { extraLegroom: flight.seatSurcharge.extraLegroom }),
      },
      baggageRules: {
        freeCabinKg: flight.baggageRules?.freeCabinKg ?? 0,
        extraChargePerKg: flight.baggageRules?.extraChargePerKg ?? 0,
        ...(flight.baggageRules?.maxExtraKg && { maxExtraKg: flight.baggageRules.maxExtraKg }),
      },
      ...(flight.luggageRuleId && { luggageRuleId: flight.luggageRuleId }),
      ...(flight.foodMenuId && { foodMenuId: flight.foodMenuId }),
      flightStatus: flight.flightStatus,
      adminApproval: {
        status: flight.adminApproval.status,
        ...(flight.adminApproval.reviewedAt && {
          reviewedAt: flight.adminApproval.reviewedAt.toISOString(),
        }),
        ...(flight.adminApproval.reason && { reason: flight.adminApproval.reason }),
      },
      createdAt: flight.createdAt.toISOString(),
      updatedAt: flight.updatedAt.toISOString(),
    };
  }

  static toFlightResponse(flight: IFlight) {
    return {
      flight: this.toFlightDetailsDTO(flight),
    };
  }

  static toPaginatedResponse(
    flights: IFlight[],
    totalCount: number,
    currentPage: number,
    totalPages: number
  ) {
    return {
      flights: this.toFlightListDTOs(flights),
      totalCount,
      currentPage,
      totalPages,
    };
  }

  static toSearchResultDTO(flight: IFlight): SearchFlightResultDTO {
    const availableClasses: SearchFlightResultDTO["availableClasses"] = [];
    if (flight.baseFare.economy) availableClasses.push("economy");
    if (flight.baseFare.premium_economy) availableClasses.push("premium_economy");
    if (flight.baseFare.business) availableClasses.push("business");
    if (flight.baseFare.first) availableClasses.push("first");

    return {
      _id: flight.id,
      flightId: flight.flightId,
      flightNumber: flight.flightNumber,
      aircraftName: flight.aircraftName,
      departure: {
        destinationId: flight.departureDestinationId,
        name: flight.departureDestination?.name ?? "",
        iataCode: flight.departureDestination?.iataCode ?? "",
        time: flight.departureTime.toISOString(),
      },
      arrival: {
        destinationId: flight.arrivalDestinationId,
        name: flight.arrivalDestination?.name ?? "",
        iataCode: flight.arrivalDestination?.iataCode ?? "",
        time: flight.arrivalTime.toISOString(),
      },
      durationMinutes: flight.durationMinutes,
      ...(flight.gate && { gate: flight.gate }),
      baseFare: {
        economy: flight.baseFare.economy ?? 0,
        ...(flight.baseFare.premium_economy && { premium_economy: flight.baseFare.premium_economy }),
        ...(flight.baseFare.business && { business: flight.baseFare.business }),
        ...(flight.baseFare.first && { first: flight.baseFare.first }),
      },
      baggageRules: {
        freeCabinKg: flight.baggageRules?.freeCabinKg ?? 0,
        extraChargePerKg: flight.baggageRules?.extraChargePerKg ?? 0,
        ...(flight.baggageRules?.maxExtraKg && { maxExtraKg: flight.baggageRules.maxExtraKg }),
      },
      flightStatus: flight.flightStatus,
      availableClasses,
    };
  }

  static toSearchResultDTOs(flights: IFlight[]): SearchFlightResultDTO[] {
    return flights.map((f) => this.toSearchResultDTO(f));
  }
}