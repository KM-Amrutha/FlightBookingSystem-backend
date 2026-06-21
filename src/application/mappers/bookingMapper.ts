import { IBooking } from "@domain/entities/booking.entity";
import { IFlight } from "@domain/entities/flight.entity";
import {IProvider} from "@domain/entities/provider.entity";
import {IAircraft} from "@domain/entities/aircraft.entity";
import { CancelPassengerResponseDTO } from "@application/dtos/wallet-dtos";
import {
  BookingSegmentFlightDTO,
  BookingResponseDTO,
  BookingPassengerResponseDTO,
  BookingFlightFoodResponseDTO,
  BookingListItemDTO,
  BookingSegmentSummaryDTO,
  ProviderBookingPassengerDTO,
  ProviderBookingDetailResponseDTO,
} from "@application/dtos/booking-dtos";

export class BookingMapper {

  // ─── IFlight → BookingSegmentFlightDTO ───────────────────────────────────
  static toBookingSegmentFlightDTO(flight: IFlight,
     providerName: string,    
  providerLogo?: string,
  manufacturer?: string ): BookingSegmentFlightDTO {
    console.log("segmentFlight amenities:", flight.amenities);
    return {
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      aircraftId: flight.aircraftId,
       aircraftName: flight.aircraftName,
      manufacturer: manufacturer ?? "",
      providerId: flight.providerId,
       providerName,                       
    ...(providerLogo && { providerLogo }),
      from: flight.departureDestination?.iataCode ?? "",
      to: flight.arrivalDestination?.iataCode ?? "",
      fromName: flight.departureDestination?.name ?? "",
      toName: flight.arrivalDestination?.name ?? "",
      departureTime: flight.departureTime.toISOString(),
      arrivalTime: flight.arrivalTime.toISOString(),
...(flight.gate && { gate: flight.gate }),
      durationMinutes: flight.durationMinutes,
      baseFare: {
        ...(flight.baseFare.economy && { economy: flight.baseFare.economy }),
        ...(flight.baseFare.premium_economy && { premium_economy: flight.baseFare.premium_economy }),
        ...(flight.baseFare.business && { business: flight.baseFare.business }),
        ...(flight.baseFare.first && { first: flight.baseFare.first }),
      },
      baggageRules: {
        freeCabinKg: flight.baggageRules?.freeCabinKg ?? 0,
        extraChargePerKg: flight.baggageRules?.extraChargePerKg ?? 0,
        ...(flight.baggageRules?.maxExtraKg && { maxExtraKg: flight.baggageRules.maxExtraKg }),
      },
       amenities: flight.amenities ?? [], 
      foodMenuIds: flight.foodMenuId ?? [],
    };
  }

  // ─── IBooking → BookingResponseDTO ───────────────────────────────────────
  
  // ─── IBooking → BookingListItemDTO ───────────────────────────────────────
  static toBookingListItemDTO(booking: IBooking): BookingListItemDTO {
    return {
      id: booking.id,
      userId: booking.userId,
      segments: booking.segments.map((s) => ({
        flightId: s.flightId,
        flightNumber: s.flightNumber,
        from: s.from,
        to: s.to,
        departureTime: s.departureTime.toISOString(),
        arrivalTime: s.arrivalTime.toISOString(),
      })),
      passengers: booking.passengers.map(
        (p): BookingPassengerResponseDTO => ({
          passengerId: p.passengerId,
          name: p.name,
          dob: p.dob.toISOString(),
          gender: p.gender,
          address: p.address,
          mobile: p.mobile,
          extraLuggageKg: p.extraLuggageKg,
          segments: p.segments.map((s) => ({
            flightId: s.flightId,
            flightNumber: s.flightNumber,
            from: s.from,
            to: s.to,
            departureTime: s.departureTime.toISOString(),
            arrivalTime: s.arrivalTime.toISOString(),
            flightSeatId: s.flightSeatId,
            seatNumber: s.seatNumber,
            cabinClass: s.cabinClass,
            position: s.position,
            baseFare: s.baseFare,
            seatSurcharge: s.seatSurcharge,
            luggageCharge: s.luggageCharge,
            segmentFare: s.segmentFare,
            status: s.status,
            ...(s.cancelledAt && { cancelledAt: s.cancelledAt.toISOString() }),
          })),
          passengerTotal: p.passengerTotal,
          status: p.status,
          ...(p.cancelledAt && { cancelledAt: p.cancelledAt.toISOString() }),
          ...(p.refundAmount !== undefined && { refundAmount: p.refundAmount }),
        })
      ),
      flightFoods: booking.flightFoods.map(
        (f): BookingFlightFoodResponseDTO => ({
          flightId: f.flightId,
          aircraftId: f.aircraftId,
          items: f.items.map((i) => ({
            foodId: i.foodId,
            foodName: i.foodName,
            foodPrice: i.foodPrice,
            quantity: i.quantity,
            itemTotal: i.itemTotal,
          })),
          flightFoodTotal: f.flightFoodTotal,
        })
      ),
      subtotal: booking.subtotal,
      discount: booking.discount,
      grandTotal: booking.grandTotal,
      status: booking.status,
      ...(booking.paymentIntentId && { paymentIntentId: booking.paymentIntentId }),
      ...(booking.paymentConfirmedAt && {
        paymentConfirmedAt: booking.paymentConfirmedAt.toISOString(),
      }),
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  static toBookingListDTOs(bookings: IBooking[]): BookingListItemDTO[] {
    return bookings.map((b) => BookingMapper.toBookingListItemDTO(b));
  }

  // ─── Cancel Passenger Response ────────────────────────────────────────────
  static toCancelPassengerResponseDTO(
    bookingId: string,
    passengerId: string,
    refundAmount: number,
    walletBalance: number
  ): CancelPassengerResponseDTO {
    return {
      bookingId,
      passengerId,
      refundAmount,
      walletBalance,
    };
  }
  
static toBookingResponseDTOWithFlights(
  booking: IBooking,
  flights: (IFlight | null)[],
  providers: (IProvider | null)[],
  aircrafts: (IAircraft | null)[]
): BookingResponseDTO {

  // ── build maps with toString() to avoid ObjectId reference mismatch ──
  const flightMap = new Map<string, IFlight>();
  for (const flight of flights) {
    if (flight) flightMap.set(flight.id.toString(), flight);
  }

  const providerMap = new Map<string, IProvider>();
  for (const provider of providers) {
    if (provider) providerMap.set(provider.id.toString(), provider);
  }

  const aircraftMap = new Map<string, IAircraft>();
  for (const aircraft of aircrafts) {
    if (aircraft) aircraftMap.set(aircraft.id.toString(), aircraft);
  }

  return {
    id: booking.id,
    userId: booking.userId,
    segments: booking.segments.map((s): BookingSegmentSummaryDTO => {
      const flight = flightMap.get(s.flightId.toString());
      const provider = flight ? providerMap.get(flight.providerId.toString()) : undefined;
      const aircraft = flight ? aircraftMap.get(flight.aircraftId.toString()) : undefined;

      return {
        flightId: s.flightId,
        flightNumber: s.flightNumber,
        aircraftName: flight?.aircraftName ?? "",
        providerName: provider?.companyName ?? "",
        ...(provider?.logoUrl && { providerLogo: provider.logoUrl }),
        manufacturer: aircraft?.manufacturer ?? "",
        from: s.from,
        fromName: flight?.departureDestination?.name ?? "",
        to: s.to,
        toName: flight?.arrivalDestination?.name ?? "",
        departureTime: s.departureTime.toISOString(),
        arrivalTime: s.arrivalTime.toISOString(),
        ...(flight?.gate && { gate: flight.gate }),
        durationMinutes: flight?.durationMinutes ?? 0,
        baggageRules: {
          freeCabinKg: flight?.baggageRules?.freeCabinKg ?? 0,
          extraChargePerKg: flight?.baggageRules?.extraChargePerKg ?? 0,
          ...(flight?.baggageRules?.maxExtraKg && {
            maxExtraKg: flight.baggageRules.maxExtraKg,
          }),
        },
      };
    }),
    passengers: booking.passengers.map(
      (p): BookingPassengerResponseDTO => ({
        passengerId: p.passengerId,
        name: p.name,
        dob: p.dob.toISOString(),
        gender: p.gender,
        address: p.address,
        mobile: p.mobile,
        extraLuggageKg: p.extraLuggageKg,
        segments: p.segments.map((s) => ({
          flightId: s.flightId,
          flightNumber: s.flightNumber,
          from: s.from,
          to: s.to,
          departureTime: s.departureTime.toISOString(),
          arrivalTime: s.arrivalTime.toISOString(),
          flightSeatId: s.flightSeatId,
          seatNumber: s.seatNumber,
          cabinClass: s.cabinClass,
          position: s.position,
          baseFare: s.baseFare,
          seatSurcharge: s.seatSurcharge,
          luggageCharge: s.luggageCharge,
          segmentFare: s.segmentFare,
          status: s.status,
          ...(s.cancelledAt && { cancelledAt: s.cancelledAt.toISOString() }),
        })),
        passengerTotal: p.passengerTotal,
        status: p.status,
        ...(p.cancelledAt && { cancelledAt: p.cancelledAt.toISOString() }),
        ...(p.refundAmount !== undefined && { refundAmount: p.refundAmount }),
      })
    ),
    flightFoods: booking.flightFoods.map(
      (f): BookingFlightFoodResponseDTO => ({
        flightId: f.flightId,
        aircraftId: f.aircraftId,
        items: f.items.map((i) => ({
          foodId: i.foodId,
          foodName: i.foodName,
          foodPrice: i.foodPrice,
          quantity: i.quantity,
          itemTotal: i.itemTotal,
        })),
        flightFoodTotal: f.flightFoodTotal,
      })
    ),
    subtotal: booking.subtotal,
    discount: booking.discount,
    grandTotal: booking.grandTotal,
    status: booking.status,
    ...(booking.paymentIntentId && { paymentIntentId: booking.paymentIntentId }),
    ...(booking.paymentConfirmedAt && {
      paymentConfirmedAt: booking.paymentConfirmedAt.toISOString(),
    }),
    createdAt: booking.createdAt.toISOString(),
    updatedAt: booking.updatedAt.toISOString(),
  };
}


static toProviderBookingDetailResponseDTO(
  booking: IBooking,
  providerId: string
): ProviderBookingDetailResponseDTO {

  // ── provider's flight IDs ─────────────────────────────────────────
  const providerFlightIds = new Set(
    booking.passengers.flatMap((p) =>
      p.segments
        .filter((s) => s.providerId.toString() === providerId.toString())
        .map((s) => s.flightId)
    )
  );

  // ── filter top-level segments ─────────────────────────────────────
  const providerSegments = booking.segments.filter((s) =>
    providerFlightIds.has(s.flightId)
  );

  // ── filter passengers ─────────────────────────────────────────────
  const passengers: ProviderBookingPassengerDTO[] = booking.passengers
    .filter((p) =>
      p.segments.some(
        (s) => s.providerId.toString() === providerId.toString()
      )
    )
    .map((p) => {
      const providerSegs = p.segments.filter(
        (s) => s.providerId.toString() === providerId.toString()
      );
      const passengerTotal = providerSegs.reduce(
        (sum, s) => sum + s.segmentFare,
        0
      );
      return {
        passengerId: p.passengerId,
        name: p.name,
        gender: p.gender,
        dob: p.dob.toISOString(),
        mobile: p.mobile,
        status: p.status,
        segments: providerSegs.map((s) => ({
          flightId: s.flightId,
          flightNumber: s.flightNumber,
          from: s.from,
          to: s.to,
          departureTime: s.departureTime.toISOString(),
          arrivalTime: s.arrivalTime.toISOString(),
          flightSeatId: s.flightSeatId,
          seatNumber: s.seatNumber,
          cabinClass: s.cabinClass,
          position: s.position,
          baseFare: s.baseFare,
          seatSurcharge: s.seatSurcharge,
          luggageCharge: s.luggageCharge,
          segmentFare: s.segmentFare,
          status: s.status,
          ...(s.cancelledAt && { cancelledAt: s.cancelledAt.toISOString() }),
        })),
        passengerTotal,
      };
    });

  // ── filter foods ──────────────────────────────────────────────────
  const flightFoods = booking.flightFoods
    .filter((ff) => ff.providerId.toString() === providerId.toString())
    .map((f) => ({
      flightId: f.flightId,
      aircraftId: f.aircraftId,
      items: f.items.map((i) => ({
        foodId: i.foodId,
        foodName: i.foodName,
        foodPrice: i.foodPrice,
        quantity: i.quantity,
        itemTotal: i.itemTotal,
      })),
      flightFoodTotal: f.flightFoodTotal,
    }));

  // ── revenue calc ──────────────────────────────────────────────────
  const grossAmount =
    passengers.reduce((sum, p) => sum + p.passengerTotal, 0) +
    flightFoods.reduce((sum, f) => sum + f.flightFoodTotal, 0);

  const commissionAmount = booking.commissionAmount ?? 0;
  const providerRevenue = grossAmount - commissionAmount;

  return {
    id: booking.id,
    status: booking.status,
    ...(booking.paymentConfirmedAt && {
      paymentConfirmedAt: booking.paymentConfirmedAt.toISOString(),
    }),
    createdAt: booking.createdAt.toISOString(),
    segments: providerSegments.map((s) => ({  // ← filtered
      flightId: s.flightId,
      flightNumber: s.flightNumber,
      from: s.from,
      to: s.to,
      departureTime: s.departureTime.toISOString(),
      arrivalTime: s.arrivalTime.toISOString(),
    })),
    passengers,
    flightFoods,
    grossAmount,
    commissionAmount,
    providerRevenue,
    grandTotal: booking.grandTotal,
  };
}


static toProviderBookingListItemDTO(
  booking: IBooking,
  providerId: string
): BookingListItemDTO {
  const providerFlightIds = new Set(
    booking.passengers.flatMap((p) =>
      p.segments
        .filter((s) => s.providerId.toString() === providerId.toString())
        .map((s) => s.flightId)
    )
  );

  const filteredSegments = booking.segments.filter((s) =>
    providerFlightIds.has(s.flightId)
  );

  const filteredPassengers = booking.passengers
    .filter((p) =>
      p.segments.some(
        (s) => s.providerId.toString() === providerId.toString()
      )
    )
    .map((p) => {
      const providerSegs = p.segments.filter(
        (s) => s.providerId.toString() === providerId.toString()
      );
      return {
        ...p,
        segments: providerSegs,
        passengerTotal: providerSegs.reduce((sum, s) => sum + s.segmentFare, 0),
      };
    });

  const filteredFoods = booking.flightFoods.filter(
    (ff) => ff.providerId.toString() === providerId.toString()
  );

  // calculate provider gross amount
  const providerGross =
    filteredPassengers.reduce((sum, p) => sum + p.passengerTotal, 0) +
    filteredFoods.reduce((sum, f) => sum + f.flightFoodTotal, 0);

  return BookingMapper.toBookingListItemDTO({
    ...booking,
    segments: filteredSegments,
    passengers: filteredPassengers,
    flightFoods: filteredFoods,
    grandTotal: providerGross,      // ← provider amount, not full booking total
    subtotal: providerGross,
    discount: 0,
  });
}

static toProviderBookingListDTOs(
  bookings: IBooking[],
  providerId: string
): BookingListItemDTO[] {
  return bookings.map((b) =>
    BookingMapper.toProviderBookingListItemDTO(b, providerId)
  );
}

}