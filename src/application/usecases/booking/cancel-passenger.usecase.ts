import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IFlightSeatRepository } from "@domain/interfaces/IFlightSeatRepository";
import { IUserWalletCreditService } from "@di/file-imports-index";
import { TYPES_SERVICES } from "@di/types-services";
import { ICancelPassengerUseCase } from "@di/file-imports-index";
import { CancelPassengerResponseDTO } from "@application/dtos/booking-dtos";
import { BookingMapper } from "@application/mappers/bookingMapper";

import {
  NotFoundError,
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import {
  TYPES_BOOKING_REPOSITORIES,
  TYPES_AIRCRAFT_REPOSITORIES,
} from "@di/types-repositories";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";


@injectable()
export class CancelPassengerUseCase implements ICancelPassengerUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository)
    private readonly _flightSeatRepository: IFlightSeatRepository,
   @inject(TYPES_SERVICES.UserWalletCreditService)
   private readonly _walletCreditService: IUserWalletCreditService
  ) {}

  async execute(
    userId: string,
    bookingId: string,
    passengerId: string
  ): Promise<CancelPassengerResponseDTO> {
    if (!bookingId) throw new validationError(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);

    const booking = await this._bookingRepository.getBookingById(bookingId);
    if (!booking) throw new NotFoundError(BOOKING_MESSAGES.BOOKING_NOT_FOUND);


    
    if (booking.userId.toString() !== userId.toString()) {
  throw new ForbiddenError(BOOKING_MESSAGES.SESSION_INVALID);
}
    if (booking.status !== "confirmed") {
      throw new validationError(BOOKING_MESSAGES.BOOKING_ALREADY_CANCELLED);
    }

    // ── find passenger ────────────────────────────────────────────────────
    const passenger = booking.passengers.find(
      (p) => p.passengerId === passengerId
    );
    if (!passenger) throw new NotFoundError(BOOKING_MESSAGES.PASSENGER_NOT_FOUND);
    if (passenger.status === "cancelled") {
      throw new validationError(BOOKING_MESSAGES.PASSENGER_ALREADY_CANCELLED);
    }

    // ── validate all segments not yet departed ────────────────────────────
    const now = new Date();
    for (const segment of passenger.segments) {
      if (segment.status === "cancelled") continue;
      if (segment.departureTime <= now) {
        throw new validationError(BOOKING_MESSAGES.FLIGHT_ALREADY_DEPARTED_CANCEL);
      }
    }

    // ── release seats ─────────────────────────────────────────────────────
    for (const segment of passenger.segments) {
      if (segment.status === "cancelled") continue;
      await this._flightSeatRepository.releaseSeat(segment.flightSeatId);
    }

    // ── cancel passenger in booking ───────────────────────────────────────
    const refundAmount = passenger.passengerTotal;

    const updatedBooking = await this._bookingRepository.cancelPassenger(
      bookingId,
      passengerId,
      refundAmount
    );
    if (!updatedBooking) throw new NotFoundError(BOOKING_MESSAGES.BOOKING_NOT_FOUND);

    // ── check if all passengers cancelled → cancel booking ────────────────
    const allCancelled = updatedBooking.passengers.every(
      (p) => p.status === "cancelled"
    );
    if (allCancelled) {
      await this._bookingRepository.cancelBooking(bookingId);
    }

    const updatedWallet =
  await this._walletCreditService.creditRefund(
    userId,
    bookingId,
    passengerId,
    refundAmount
  );


// ── return via mapper ─────────────────────────────────────────────────
return BookingMapper.toCancelPassengerResponseDTO(
  bookingId,
  passengerId,
  refundAmount,
  updatedWallet.balance
);
  }
}