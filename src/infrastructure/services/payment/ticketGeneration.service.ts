import { inject, injectable } from "inversify";
import { IBooking } from "@domain/entities/booking.entity";
import { IFlight } from "@domain/entities/flight.entity";
import { IProvider } from "@domain/entities/provider.entity";
import { IAircraft } from "@domain/entities/aircraft.entity";
import { ITicket, ITicketFlightFood } from "@domain/entities/ticket.entity";
import { ITicketRepository } from "@domain/interfaces/ITicketRepository";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import { ITicketGenerationService } from "@di/file-imports-index";
import {
  TYPES_BOOKING_REPOSITORIES,
  TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES,
} from "@di/types-repositories";

@injectable()
export class TicketGenerationService implements ITicketGenerationService {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.TicketRepository)
    private readonly _ticketRepository: ITicketRepository,

    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private readonly _flightRepository: IFlightRepository,

    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private readonly _aircraftRepository: IAircraftRepository
  ) {}

  async generateTicket(booking: IBooking): Promise<void> {
    // ── idempotency ───────────────────────────────────────────────────────
    const existing = await this._ticketRepository.getTicketsByBookingId(
      booking.id
    );
    if (existing.length > 0) return;

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");

    // ── fetch all flights in parallel ─────────────────────────────────────
    const flightIds = booking.segments.map((s) => s.flightId);
    const flights = await Promise.all(
      flightIds.map((id) => this._flightRepository.getFlightDetails(id))
    );

    const resolvedFlights = flights.filter((f): f is IFlight => f !== null);

    // ── fetch unique providers + aircrafts in parallel ────────────────────
    const uniqueProviderIds = [
      ...new Set(resolvedFlights.map((f) => f.providerId.toString())),
    ];
    const uniqueAircraftIds = [
      ...new Set(resolvedFlights.map((f) => f.aircraftId.toString())),
    ];

    const [providers, aircrafts] = await Promise.all([
      Promise.all(
        uniqueProviderIds.map((id) =>
          this._providerRepository.getProviderDetailsById(id)
        )
      ),
      Promise.all(
        uniqueAircraftIds.map((id) =>
          this._aircraftRepository.getAircraftById(id)
        )
      ),
    ]);

    // ── build maps ────────────────────────────────────────────────────────
    const flightMap = new Map<string, IFlight>();
    for (const flight of resolvedFlights) {
      flightMap.set(flight.id.toString(), flight);
    }

    const providerMap = new Map<string, IProvider>();
    for (const provider of providers) {
      if (provider) providerMap.set(provider.id.toString(), provider);
    }

    const aircraftMap = new Map<string, IAircraft>();
    for (const aircraft of aircrafts) {
      if (aircraft) aircraftMap.set(aircraft.id.toString(), aircraft);
    }

    // ── food map: flightId → ITicketFlightFood ────────────────────────────
    const foodMap = new Map<string, ITicketFlightFood>();
    for (const flightFood of booking.flightFoods) {
      if (flightFood.flightFoodTotal > 0) {
        const flight = flightMap.get(flightFood.flightId.toString());
        foodMap.set(flightFood.flightId.toString(), {
          flightId: flightFood.flightId,
          flightNumber: flight?.flightNumber ?? "",
          items: flightFood.items.map((item) => ({
            foodName: item.foodName,
            foodPrice: item.foodPrice,
            quantity: item.quantity,
            itemTotal: item.itemTotal,
          })),
          flightFoodTotal: flightFood.flightFoodTotal,
        });
      }
    }

    // ── generate one ticket per active passenger per active segment ───────
    const activePassengers = booking.passengers.filter(
      (p) => p.status === "active"
    );

    for (let pIdx = 0; pIdx < activePassengers.length; pIdx++) {
      const passenger = activePassengers[pIdx]!;
      const activeSegments = passenger.segments.filter(
        (s) => s.status === "active"
      );

      for (let fIdx = 0; fIdx < activeSegments.length; fIdx++) {
        const segment = activeSegments[fIdx]!;

        const flight = flightMap.get(segment.flightId.toString());
        const provider = flight
          ? providerMap.get(flight.providerId.toString())
          : undefined;
        const aircraft = flight
          ? aircraftMap.get(flight.aircraftId.toString())
          : undefined;

        const randomPart = Math.random()
          .toString(36)
          .toUpperCase()
          .slice(2, 8);

        const ticketNumber = `SKY-${datePart}-${randomPart}-P${pIdx + 1}-F${fIdx + 1}`;

        const ticketData: Partial<ITicket> = {
  bookingId: booking.id,
  userId: booking.userId,
  ticketNumber,
  passengerIndex: pIdx + 1,
  flightIndex: fIdx + 1,
  issuedAt: now,
  passenger: {
    passengerId: passenger.passengerId,
    name: passenger.name,
    dob: passenger.dob,
    gender: passenger.gender,
    mobile: passenger.mobile,
    segment: {
      flightId: segment.flightId,
      flightNumber: segment.flightNumber,
      from: segment.from,
      fromName: flight?.departureDestination?.name ?? segment.from,
      to: segment.to,
      toName: flight?.arrivalDestination?.name ?? segment.to,
      departureTime: segment.departureTime,
      arrivalTime: segment.arrivalTime,
      seatNumber: segment.seatNumber,
      cabinClass: segment.cabinClass,
      position: segment.position,
      baseFare: segment.baseFare,
      seatSurcharge: segment.seatSurcharge,
      luggageCharge: segment.luggageCharge,
      segmentFare: segment.segmentFare,
      providerName: provider?.companyName ?? "",
      ...(provider?.logoUrl && { providerLogo: provider.logoUrl }),
      aircraftName: flight?.aircraftName ?? "",
      manufacturer: aircraft?.manufacturer ?? "",
      ...(flight?.gate && { gate: flight.gate }),
      durationMinutes: flight?.durationMinutes ?? 0,
      baggageRules: {
        freeCabinKg: flight?.baggageRules?.freeCabinKg ?? 0,
        extraChargePerKg: flight?.baggageRules?.extraChargePerKg ?? 0,
        ...(flight?.baggageRules?.maxExtraKg && {
          maxExtraKg: flight.baggageRules.maxExtraKg,
        }),
      },
      amenities: flight?.amenities ?? [], 
    },
    segmentTotal: segment.segmentFare,
  },
  fareBreakdown: {
    subtotal: booking.subtotal,
    discount: booking.discount,
    grandTotal: booking.grandTotal,
  },
};

const food = foodMap.get(segment.flightId.toString());
if (food) {
  ticketData.flightFood = food;
}
await this._ticketRepository.createTicket(ticketData);
      }
    }
  }
}