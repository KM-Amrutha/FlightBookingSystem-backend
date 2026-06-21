
export const TYPES_REPOSITORIES = {
     OtpRepository: Symbol.for("OtpRepository"),
     UserRepository: Symbol.for("UserRepository"),
     ProviderRepository: Symbol.for("ProviderRepository"),
     PasswordResetRepository: Symbol.for("PasswordResetRepository")

}

export const  TYPES_AIRCRAFT_REPOSITORIES = {
     AircraftRepository: Symbol.for("AircraftRepository"),
     DestionationRepository: Symbol.for("DestinationRepository"),
     SeatRepository: Symbol.for("SeatRepository"),
     SeatLayoutRepository: Symbol.for("SeatLayoutRepository"),
     SeatTypeRepository: Symbol.for("SeatTypeRepository"),
     FlightRepository: Symbol.for("FlightRepository"),
     FlightSeatRepository: Symbol.for("FlightSeatRepository"),
}

export const TYPES_BOOKING_REPOSITORIES = {
     BookingRepository: Symbol.for("BookingRepository"),
     FoodRepository: Symbol.for("FoodRepository"),
     OfferRepository: Symbol.for("OfferRepository"),
     TicketRepository: Symbol.for("TicketRepository"),
     UserWalletRepository: Symbol.for("UserWalletRepository"),
     ProviderWalletRepository: Symbol.for("ProviderWalletRepository"),
     AdminWalletRepository: Symbol.for("AdminWalletRepository"),
}