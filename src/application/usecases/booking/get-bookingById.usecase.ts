import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IFlightRepository } from "@domain/interfaces/IFlightRepository";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IAircraftRepository } from "@domain/interfaces/IAircraftRepository";
import { IGetBookingByIdUseCase } from "@di/file-imports-index";
import { BookingResponseDTO } from "@application/dtos/booking-dtos";
import { BookingMapper } from "@application/mappers/bookingMapper";
import {
  NotFoundError,
  ForbiddenError,
  validationError,
} from "@presentation/middlewares/error.middleware";
import { TYPES_BOOKING_REPOSITORIES,TYPES_AIRCRAFT_REPOSITORIES,
   TYPES_REPOSITORIES } from "@di/types-repositories";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";

@injectable()
export class GetBookingByIdUseCase implements IGetBookingByIdUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository,

    @inject(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository)
    private readonly _flightRepository: IFlightRepository,

    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository,

    @inject(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository)
    private readonly _aircraftRepository: IAircraftRepository
  ) {}

  async execute(userId: string, bookingId: string): Promise<BookingResponseDTO> {
    if (!bookingId) {
      throw new validationError(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const booking = await this._bookingRepository.getBookingById(bookingId);
    console.log('bookingid is:', booking)

    if (!booking) {
      throw new NotFoundError(BOOKING_MESSAGES.BOOKING_NOT_FOUND);
    }

    if (booking.userId.toString() !== userId.toString()) {
      throw new ForbiddenError(BOOKING_MESSAGES.SESSION_INVALID);
    }

    const flights = await Promise.all(
      booking.segments.map((s) => this._flightRepository.getFlightDetails(s.flightId))
    );

    const resolvedFlights = flights.filter(
      (f): f is NonNullable<typeof f> => f !== null
    );

    const uniqueProviderIds = [...new Set(resolvedFlights.map((f) => f.providerId))];
    const uniqueAircraftIds = [...new Set(resolvedFlights.map((f) => f.aircraftId))];

    const [providers, aircrafts] = await Promise.all([
      Promise.all(
        uniqueProviderIds.map((id) => this._providerRepository.getProviderDetailsById(id))
      ),
      Promise.all(
        uniqueAircraftIds.map((id) => this._aircraftRepository.getAircraftById(id))
      ),
    ]);
    console.log('resolvedFlights aircraftIds:', resolvedFlights.map(f => f.aircraftId));
console.log('aircrafts fetched:', aircrafts);

    return BookingMapper.toBookingResponseDTOWithFlights(
      booking,
      flights,
      providers,
      aircrafts
    );
  }
}