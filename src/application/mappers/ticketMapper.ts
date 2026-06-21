import { ITicket } from "@domain/entities/ticket.entity";
import {
  TicketResponseDTO,
} from "@application/dtos/ticket-dtos";

export class TicketMapper {
  static toTicketResponseDTO(ticket: ITicket): TicketResponseDTO {
    return {
      id: ticket.id,
      bookingId: ticket.bookingId,
      userId: ticket.userId,
      ticketNumber: ticket.ticketNumber,
      passengerIndex: ticket.passengerIndex,
      flightIndex: ticket.flightIndex,
      issuedAt: ticket.issuedAt.toISOString(),
      passenger: {
        passengerId: ticket.passenger.passengerId,
        name: ticket.passenger.name,
        dob: ticket.passenger.dob.toISOString(),
        gender: ticket.passenger.gender,
        mobile: ticket.passenger.mobile,
        segment: {
          flightId: ticket.passenger.segment.flightId,
          flightNumber: ticket.passenger.segment.flightNumber,
          from: ticket.passenger.segment.from,
          fromName: ticket.passenger.segment.fromName,
          to: ticket.passenger.segment.to,
          toName: ticket.passenger.segment.toName,
          departureTime: ticket.passenger.segment.departureTime.toISOString(),
          arrivalTime: ticket.passenger.segment.arrivalTime.toISOString(),
          seatNumber: ticket.passenger.segment.seatNumber,
          cabinClass: ticket.passenger.segment.cabinClass,
          position: ticket.passenger.segment.position,
          baseFare: ticket.passenger.segment.baseFare,
          seatSurcharge: ticket.passenger.segment.seatSurcharge,
          luggageCharge: ticket.passenger.segment.luggageCharge,
          segmentFare: ticket.passenger.segment.segmentFare,
          providerName: ticket.passenger.segment.providerName,
          ...(ticket.passenger.segment.providerLogo && {
            providerLogo: ticket.passenger.segment.providerLogo,
          }),
          aircraftName: ticket.passenger.segment.aircraftName,
          manufacturer: ticket.passenger.segment.manufacturer,
          ...(ticket.passenger.segment.gate && {
            gate: ticket.passenger.segment.gate,
          }),
          durationMinutes: ticket.passenger.segment.durationMinutes,
          baggageRules: {
            freeCabinKg: ticket.passenger.segment.baggageRules.freeCabinKg,
            extraChargePerKg: ticket.passenger.segment.baggageRules.extraChargePerKg,
            ...(ticket.passenger.segment.baggageRules.maxExtraKg && {
              maxExtraKg: ticket.passenger.segment.baggageRules.maxExtraKg,
            }),
          },
        },
        segmentTotal: ticket.passenger.segmentTotal,
      },
      ...(ticket.flightFood && {
        flightFood: {
          flightId: ticket.flightFood.flightId,
          flightNumber: ticket.flightFood.flightNumber,
          items: ticket.flightFood.items.map((i) => ({
            foodName: i.foodName,
            foodPrice: i.foodPrice,
            quantity: i.quantity,
            itemTotal: i.itemTotal,
          })),
          flightFoodTotal: ticket.flightFood.flightFoodTotal,
        },
      }),
      ...(ticket.passenger.segment.amenities?.length && {
  amenities: ticket.passenger.segment.amenities,
}),
      fareBreakdown: {
        subtotal: ticket.fareBreakdown.subtotal,
        discount: ticket.fareBreakdown.discount,
        grandTotal: ticket.fareBreakdown.grandTotal,
      },
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    };
  }

  static toTicketResponseDTOs(tickets: ITicket[]): TicketResponseDTO[] {
    return tickets.map((t) => TicketMapper.toTicketResponseDTO(t));
  }
}