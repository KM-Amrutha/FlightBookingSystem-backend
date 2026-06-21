import { Container } from "inversify";

import {
    TYPES_AUTH_CONTROLLERS,
    TYPES_ADMIN_CONTROLLERS,
    TYPES_PROVIDER_CONTROLLERS,
    TYPES_AIRCRAFT_CONTROLLERS,
    TYPES_FLIGHT_CONTROLLERS,
    TYPES_USER_CONTROLLERS,
    TYPES_BOOKING_CONTROLLERS,
    TYPES_OFFER_CONTROLLERS,
    TYPES_FOOD_CONTROLLERS,

} from "@di/types-controllers"

import { TYPES_AUTH_USECASES,
         TYPES_LOGGER_USECASES, 
         TYPES_PROVIDER_USECASES,
         TYPES_ADMIN_USECASES,
         TYPES_AIRCRAFT_USECASES,
         TYPES_FLIGHT_USECASES,
         TYPES_USER_USECASES,
         TYPES_BOOKING_USECASES,
         TYPES_OFFER_USECASES,
         TYPES_FOOD_USECASES,
        } 
         from "@di/types-usecases";
import { TYPES_SERVICES } from "di/types-services"

import { TYPES_REPOSITORIES,
     TYPES_AIRCRAFT_REPOSITORIES,
      TYPES_BOOKING_REPOSITORIES }   from "di/types-repositories"

import {
OtpRepository,
UserRepository,
ProviderRepository,
PasswordResetRepository,

AircraftRepository,
DestinationRepository,
SeatRepository,
SeatLayoutRepository,
SeatTypeRepository,
FlightRepository,
FlightSeatRepository,
BookingRepository,
FoodRepository,
OfferRepository,
TicketRepository,
UserWalletRepository,
ProviderWalletRepository,
AdminWalletRepository,


// controllers

SignUpUserController,
SignUpProviderController,
OtpController,
SignInController,
SignOutController,
RefreshAccessTokenController,
 ForgotPasswordController,
 PasswordResetLinkController,
 ChangePasswordController,

 ProviderVerificationController,
 GetAllProvidersController,
 UpdateProviderStatusController,
 UpdateUserStatusController,
 GetAdminDashboardController,

 GetUserProfileController,
 UpdateUserProfileController,

 CompleteProviderProfileController,
 GetProviderProfileController,
 GoogleAuthController,
 GetAllUsersController,

CreateAircraftController,
GetProviderAircraftsController,
UpdateAircraftController,
DeleteAircraftController,
SearchDestinationsController,
GetAllSeatTypesController,  
CreateSeatLayoutController,
GenerateSeatsController,
GetSeatLayoutsController,
DeleteSeatLayoutController,

ApproveFlightController,
CreateFlightController,
GetProviderFlightsController,
PendingFlightsForApprovalController,
AvailableAircraftsForScheduleController,
UpdateFlightController,
GetFlightByIdController,
SearchFlightsController,
DeleteFlightController,
GetFlightSeatsController,
GetFlightSeatsForUserController,
CreateRecurringFlightController,
GetAllFlightsForAdminController,
RejectSingleFlightController,
AddFlightToSegmentController,
GetBookingSegmentController,
UpdateBookingSegmentController,
GetBookingSeatsMapController,
SeatLockController,
BookingDetailsController,
GetBookingSummaryController,
GetAdminWalletController,

InitiateBookingController,
RetryPaymentController, 
HandleWebhookController,
GetBookingByIdController,
GetUserBookingsController,
GetProviderBookingsController,
GetAdminBookingsController, 
GetTicketController,
CancelPassengerController,
GetUserWalletController,
GetProviderWalletController,
SetProviderCommissionController,
GetProviderBookingByIdController,

GetEligibleOffersController,
CreateOfferController,
GetProviderOffersController,
UpdateOfferController,
DeleteOfferController,
OfferStatusChangeController,

CreateFoodController,
UpdateFoodController,
DeleteFoodController,
GetFoodsByProviderController,
GetFoodsByAircraftController,
FoodStatusChangeController,

IUserRepository,
IOtpRepository,
IProviderRepository,
IPasswordResetRepository,

IAircraftRepository,
IDestinationRepository,
ISeatRepository,
ISeatLayoutRepository,
ISeatTypeRepository,
IFlightRepository,
IFlightSeatRepository,
IBookingRepository,
IFoodRepository,
IOfferRepository,
ITicketRepository,
IUserWalletRepository,
IProviderWalletRepository,
IAdminWalletRepository,



IAuthService,
IEncryptionService,
IHashService,
IOtpService,
IEmailService,
ICloudStorageService,
ILoggerService,
IGoogleAuthService,
IRedisService,
IStripeService,
IUserWalletCreditService,
IProviderWalletService,
ITicketGenerationService,



} from"@di/file-imports-index";

// services

import {
JwtService,
EncryptionService,
HashService,
OtpService,
EmailService,
CloudinaryService,
S3StorageService,
LoggerService,
GoogleAuthService,
RedisService,
StripeService,
UserWalletCreditService,
ProviderWalletService,
TicketGenerationService,
} from "@di/file-imports-index";

import {
CreateUserUseCase,
CreateProviderUseCase,
CheckUserBlockStatusUseCase,
TokenUseCase,
OtpUseCase,
SignInUseCase,
ForgotPasswordUseCase,
SendPasswordRestLinkUseCase,
LoggerUseCase,
GoogleAuthUseCase,
ChangePasswordUseCase,

GetPendingProvidersUseCase,
VerifyProviderUseCase,
RejectProviderUseCase,
CompleteProviderProfileUseCase,
GetProviderProfileUseCase,
GetAllProvidersUseCase,
UpdateProviderStatusUseCase,
GetAllUsersUseCase,
UpdateUserStatusUseCase,
GetAdminDashboardUseCase,
SetProviderCommissionUseCase,
GetAdminWalletUseCase,

GetUserProfileUseCase,
UpdateUserProfileUseCase,

CreateAircraftUseCase,
UpdateAircraftUseCase,
GetProviderAircraftsUseCase,
DeleteAircraftUseCase,
UpdateAircraftStatusUseCase,
SearchDestinationsUseCase,
UpdateAircraftLocationUseCase,
CreateSeatLayoutUseCase,
GenerateSeatsUseCase,
GetAllSeatTypesUseCase,
GetSeatLayoutsByAircraftUseCase,
DeleteSeatLayoutUseCase,
CreateFlightUseCase,
GetProviderFlightsUseCase,
PendingFlightsForApprovalUseCase,
ApproveFlightUseCase,
AvailableAircraftsForScheduleUseCase,
UpdateFlightUseCase,
GetFlightByIdUseCase,
SearchFlightsUseCase,
DeleteFlightUseCase,
GetFlightSeatsUseCase,
CreateRecurringFlightUseCase,
GetAllFlightsForAdminUseCase,
RejectSingleFlightUseCase,
AddFlightToSegmentUseCase,
GetBookingSegmentUseCase,
UpdateBookingSegmentUseCase,
GetBookingSeatsMapUseCase,
SeatLockUseCase,
BookingDetailsUseCase,
GetBookingSummaryUseCase,

InitiateBookingUseCase,
RetryPaymentUseCase,    
HandleWebhookUseCase,
GetBookingByIdUseCase,
GetUserBookingsUseCase,
GetProviderBookingsUseCase,
GetAdminBookingsUseCase,
GetTicketUseCase,
CancelPassengerUseCase,
GetUserWalletUseCase,
GetProviderWalletUseCase,
GetProviderBookingByIdUseCase,

GetEligibleOffersUseCase,
CreateOfferUseCase,
UpdateOfferUseCase,
DeleteOfferUseCase,
OfferStatusChangeUseCase,
GetProviderOffersUseCase,

CreateFoodUseCase,
UpdateFoodUseCase,
GetFoodsByAircraftUseCase,
GetFoodsByProviderUseCase,
FoodStatusChangeUseCase,
DeleteFoodUseCase,



IGetUserProfileUseCase,
IUpdateUserProfileUseCase,
ICheckUserBlockStatusUseCase,
ICreateProviderUseCase,
ICreateUserUseCase,
IForgotPasswordUseCase,
IOtpUseCase,
ISendPasswordRestLinkUseCase,
ISignInUseCase,
ITokenUseCase,
ILoggerUseCase,
IGetPendingProvidersUseCase,
IRejectProviderUseCase,
IVerifyProviderUseCase,
ICompleteProviderProfileUseCase,
IGetProviderProfileUseCase,
IGetAllProvidersUseCase,
IUpdateProviderStatusUseCase,
IGetAllUsersUseCase,
IUpdateUserStatusUseCase,
IGetAdminDashboardUseCase,
ISetProviderCommissionUseCase,



ICreateAircraftUseCase,
IUpdateAircraftUseCase,
IGetProviderAircraftsUseCase,
IDeleteAircraftUseCase,
IUpdateAircraftStatusUseCase,
ISearchDestinationsUseCase,
IUpdateAircraftLocationUseCase,
ICreateSeatLayoutUseCase,
IGenerateSeatsUseCase,
IGetAllSeatTypesUseCase,
IGetSeatLayoutsByAircraftUseCase,
IDeleteSeatLayoutUseCase,
ICreateFlightUseCase,
IGetProviderFlightsUseCase,
IPendingFlightsForApprovalUseCase,
IApproveFlightUseCase,
IAvailableAircraftsForScheduleUsecase,
IUpdateFlightUseCase,
IGetFlightByIdUseCase,
ISearchFlightsUseCase,
IDeleteFlightUseCase,
IChangePasswordUseCase,
IGetFlightSeatsUseCase,
IGetAllFlightsForAdminUseCase,
IRejectSingleFlightUseCase,
ICreateRecurringFlightUseCase,
IAddFlightToSegmentUseCase,
IGetBookingSegmentUseCase,
IUpdateBookingSegmentUseCase,
IGetBookingSeatsMapUseCase,
ISeatLockUseCase,
IBookingDetailsUseCase,
IGetBookingSummaryUseCase,

IInitiateBookingUseCase,
IRetryPaymentUseCase,   
IHandleWebhookUseCase,
IGetBookingByIdUseCase,
IGetUserBookingsUseCase,
IGetProviderBookingsUseCase,
IGetAdminBookingsUseCase,
IGetTicketUseCase,
ICancelPassengerUseCase,
IGetUserWalletUseCase,
IGetProviderWalletUseCase,
IGetAdminWalletUseCase,
IGetProviderBookingByIdUseCase,

ICreateOfferUseCase,
IGetProviderOffersUseCase,
IUpdateOfferUseCase,
IDeleteOfferUseCase,
IGetEligibleOffersUseCase,
IOfferStatusChangeUseCase,

ICreateFoodUseCase,
IUpdateFoodUseCase,
IGetFoodsByAircraftUseCase,
IGetFoodsByProviderUseCase,
IFoodStatusChangeUseCase,
IDeleteFoodUseCase






} from "@di/file-imports-index";

const container = new Container();

// Bind Repositories
container.bind<IUserRepository>(TYPES_REPOSITORIES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES_REPOSITORIES.OtpRepository).to(OtpRepository);
container.bind<IProviderRepository>(TYPES_REPOSITORIES.ProviderRepository).to(ProviderRepository);
container.bind<IPasswordResetRepository>(TYPES_REPOSITORIES.PasswordResetRepository).to(PasswordResetRepository);

container.bind<IAircraftRepository>(TYPES_AIRCRAFT_REPOSITORIES.AircraftRepository).to(AircraftRepository);
container.bind<IDestinationRepository>(TYPES_AIRCRAFT_REPOSITORIES.DestionationRepository).to(DestinationRepository);
container.bind<ISeatRepository>(TYPES_AIRCRAFT_REPOSITORIES.SeatRepository).to(SeatRepository);
container.bind<ISeatLayoutRepository>(TYPES_AIRCRAFT_REPOSITORIES.SeatLayoutRepository).to(SeatLayoutRepository);
container.bind<ISeatTypeRepository>(TYPES_AIRCRAFT_REPOSITORIES.SeatTypeRepository).to(SeatTypeRepository);
container.bind<IFlightRepository>(TYPES_AIRCRAFT_REPOSITORIES.FlightRepository).to(FlightRepository);
container.bind<IFlightSeatRepository>(TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository).to(FlightSeatRepository);
container.bind<IBookingRepository>(TYPES_BOOKING_REPOSITORIES.BookingRepository).to(BookingRepository);
container.bind<IFoodRepository>(TYPES_BOOKING_REPOSITORIES.FoodRepository).to(FoodRepository);
container.bind<IOfferRepository>(TYPES_BOOKING_REPOSITORIES.OfferRepository).to(OfferRepository);
container.bind<ITicketRepository>(TYPES_BOOKING_REPOSITORIES.TicketRepository).to(TicketRepository);
container.bind<IUserWalletRepository>(TYPES_BOOKING_REPOSITORIES.UserWalletRepository).to(UserWalletRepository);
container.bind<IProviderWalletRepository>(TYPES_BOOKING_REPOSITORIES.ProviderWalletRepository).to(ProviderWalletRepository);
container.bind<IAdminWalletRepository>(TYPES_BOOKING_REPOSITORIES.AdminWalletRepository).to(AdminWalletRepository);


// Bind Services
container.bind<IAuthService>(TYPES_SERVICES.JwtService).to(JwtService);
container.bind<IEncryptionService>(TYPES_SERVICES.EncryptionService).to(EncryptionService);
container.bind<IHashService>(TYPES_SERVICES.HashService).to(HashService);
container.bind<IOtpService>(TYPES_SERVICES.OtpService).to(OtpService);
container.bind<IEmailService>(TYPES_SERVICES.EmailService).to(EmailService);
container.bind<ICloudStorageService>(TYPES_SERVICES.CloudinaryService).to(CloudinaryService);
container.bind<ICloudStorageService>(TYPES_SERVICES.S3StorageService).to(S3StorageService);
container.bind<ILoggerService>(TYPES_SERVICES.LoggerService).to(LoggerService);
container.bind<IGoogleAuthService>(TYPES_SERVICES.GoogleAuthService).to(GoogleAuthService);
container.bind<IRedisService>(TYPES_SERVICES.RedisService).to(RedisService);
container.bind<IStripeService>(TYPES_SERVICES.StripeService).to(StripeService);
container.bind<IUserWalletCreditService>(TYPES_SERVICES.UserWalletCreditService).to(UserWalletCreditService);
container.bind<IProviderWalletService>(TYPES_SERVICES.ProviderWalletService).to(ProviderWalletService);
container.bind<ITicketGenerationService>(TYPES_SERVICES.TicketGenerationService).to(TicketGenerationService);


// Bind UseCases
container.bind<ICreateUserUseCase>(TYPES_AUTH_USECASES.CreateUserUseCase).to(CreateUserUseCase);
container.bind<ICheckUserBlockStatusUseCase>(TYPES_AUTH_USECASES.CheckUserBlockStatusUseCase).to(CheckUserBlockStatusUseCase);
container.bind<ICreateProviderUseCase>(TYPES_AUTH_USECASES.CreateProviderUseCase).to(CreateProviderUseCase);
container.bind<IOtpUseCase>(TYPES_AUTH_USECASES.OtpUseCase).to(OtpUseCase);
container.bind<ISignInUseCase>(TYPES_AUTH_USECASES.SignInUseCase).to(SignInUseCase);
container.bind<IForgotPasswordUseCase>(TYPES_AUTH_USECASES.ForgotPasswordUseCase).to(ForgotPasswordUseCase);
container.bind<ISendPasswordRestLinkUseCase>(TYPES_AUTH_USECASES.SendPasswordRestLinkUseCase).to(SendPasswordRestLinkUseCase);
container.bind<ITokenUseCase>(TYPES_AUTH_USECASES.TokenUseCase).to(TokenUseCase);
container.bind<ILoggerUseCase>(TYPES_LOGGER_USECASES.LoggerUseCase).to(LoggerUseCase);
container.bind<IGetPendingProvidersUseCase>(TYPES_PROVIDER_USECASES.GetPendingProvidersUseCase).to(GetPendingProvidersUseCase);
container.bind<IRejectProviderUseCase>(TYPES_PROVIDER_USECASES.RejectProviderUseCase).to(RejectProviderUseCase);
container.bind<IVerifyProviderUseCase>(TYPES_PROVIDER_USECASES.VerifyProviderUseCase).to(VerifyProviderUseCase);
container.bind<ICompleteProviderProfileUseCase>(TYPES_PROVIDER_USECASES.CompleteProviderProfileUseCase).to(CompleteProviderProfileUseCase);
container.bind<IGetProviderProfileUseCase>(TYPES_PROVIDER_USECASES.GetProviderProfileUseCase).to(GetProviderProfileUseCase);
container.bind<GoogleAuthUseCase>(TYPES_AUTH_USECASES.GoogleAuthUseCase).to(GoogleAuthUseCase);
container.bind<IChangePasswordUseCase>(TYPES_AUTH_USECASES.ChangePasswordUseCase).to(ChangePasswordUseCase)


container.bind<IGetAllProvidersUseCase>(TYPES_ADMIN_USECASES.GetAllProvidersUseCase).to(GetAllProvidersUseCase);
container.bind<IUpdateProviderStatusUseCase>(TYPES_ADMIN_USECASES.UpdateProviderStatusUseCase).to(UpdateProviderStatusUseCase);
container.bind<IGetAllUsersUseCase>(TYPES_ADMIN_USECASES.GetAllUsersUseCase).to(GetAllUsersUseCase);
container.bind<IUpdateUserStatusUseCase>(TYPES_ADMIN_USECASES.UpdateUserStatusUseCase).to(UpdateUserStatusUseCase);


container.bind<IGetUserProfileUseCase>(TYPES_USER_USECASES.GetUserProfileUseCase).to(GetUserProfileUseCase);
container.bind<IUpdateUserProfileUseCase>(TYPES_USER_USECASES.UpdateUserProfileUseCase).to(UpdateUserProfileUseCase);
container.bind<IGetAdminDashboardUseCase>(TYPES_ADMIN_USECASES.GetAdminDashboardUseCase).to(GetAdminDashboardUseCase);
container.bind<ISetProviderCommissionUseCase>(TYPES_ADMIN_USECASES.SetProviderCommissionUseCase).to(SetProviderCommissionUseCase);
container.bind<IGetAdminWalletUseCase>(TYPES_ADMIN_USECASES.GetAdminWalletUseCase).to(GetAdminWalletUseCase);

container.bind<ICreateAircraftUseCase>(TYPES_AIRCRAFT_USECASES.CreateAircraftUseCase).to(CreateAircraftUseCase);
container.bind<IUpdateAircraftUseCase>(TYPES_AIRCRAFT_USECASES.UpdateAircraftUseCase).to(UpdateAircraftUseCase);
container.bind<IGetProviderAircraftsUseCase>(TYPES_AIRCRAFT_USECASES.GetAircraftsUseCase).to(GetProviderAircraftsUseCase);
container.bind<IDeleteAircraftUseCase>(TYPES_AIRCRAFT_USECASES.DeleteAircraftUseCase).to(DeleteAircraftUseCase);
container.bind<IUpdateAircraftStatusUseCase>(TYPES_AIRCRAFT_USECASES.UpdateAircraftStatusUseCase).to(UpdateAircraftStatusUseCase);
container.bind<ISearchDestinationsUseCase>(TYPES_AIRCRAFT_USECASES.SearchDestinationsUseCase).to(SearchDestinationsUseCase);
container.bind<IUpdateAircraftLocationUseCase>(TYPES_AIRCRAFT_USECASES.UpdateAircraftLocationUseCase).to(UpdateAircraftLocationUseCase);
container.bind<ICreateSeatLayoutUseCase>(TYPES_AIRCRAFT_USECASES.CreateSeatLayoutUseCase).to(CreateSeatLayoutUseCase);
container.bind<IGenerateSeatsUseCase>(TYPES_AIRCRAFT_USECASES.GenerateSeatsUseCase).to(GenerateSeatsUseCase);
container.bind<IGetAllSeatTypesUseCase>(TYPES_AIRCRAFT_USECASES.GetAllSeatTypesUseCase).to(GetAllSeatTypesUseCase);
container.bind<IGetSeatLayoutsByAircraftUseCase>(TYPES_AIRCRAFT_USECASES.GetSeatLayoutsByAircraftUseCase).to(GetSeatLayoutsByAircraftUseCase)
container.bind<IDeleteSeatLayoutUseCase>(TYPES_AIRCRAFT_USECASES.DeleteSeatLayoutUseCase).to(DeleteSeatLayoutUseCase)


container.bind<ICreateFlightUseCase>(TYPES_FLIGHT_USECASES.CreateFlightUseCase).to(CreateFlightUseCase);
container.bind<IGetProviderFlightsUseCase>(TYPES_FLIGHT_USECASES.GetProviderFlightsUseCase).to(GetProviderFlightsUseCase);
container.bind<IPendingFlightsForApprovalUseCase>(TYPES_FLIGHT_USECASES.PendingFlightsForApprovalUseCase).to(PendingFlightsForApprovalUseCase);   
container.bind<IApproveFlightUseCase>(TYPES_FLIGHT_USECASES.ApproveFlightUseCase).to(ApproveFlightUseCase);
container.bind<IAvailableAircraftsForScheduleUsecase>(TYPES_FLIGHT_USECASES.AvailableAircraftsForScheduleUseCase).to(AvailableAircraftsForScheduleUseCase);   
container.bind<IUpdateFlightUseCase>(TYPES_FLIGHT_USECASES.UpdateFlightUseCase).to(UpdateFlightUseCase);
container.bind<IGetFlightByIdUseCase>(TYPES_FLIGHT_USECASES.GetFlightByIdUseCase).to(GetFlightByIdUseCase);
container.bind<ISearchFlightsUseCase>(TYPES_FLIGHT_USECASES.SearchFlightsUseCase).to(SearchFlightsUseCase); 
container.bind<IDeleteFlightUseCase>(TYPES_FLIGHT_USECASES.DeleteFlightUseCase).to(DeleteFlightUseCase);
container.bind<IGetFlightSeatsUseCase>(TYPES_FLIGHT_USECASES.GetFlightSeatsUseCase).to(GetFlightSeatsUseCase);
container.bind<ICreateRecurringFlightUseCase>(TYPES_FLIGHT_USECASES.CreateRecurringFlightUseCase).to(CreateRecurringFlightUseCase); 
container.bind<IGetAllFlightsForAdminUseCase>(TYPES_FLIGHT_USECASES.GetAllFlightsForAdminUseCase).to(GetAllFlightsForAdminUseCase);
container.bind<IRejectSingleFlightUseCase>(TYPES_FLIGHT_USECASES.RejectSingleFlightUseCase).to(RejectSingleFlightUseCase);
container.bind<IAddFlightToSegmentUseCase>(TYPES_BOOKING_USECASES.AddFlightToSegmentUseCase).to(AddFlightToSegmentUseCase);
container.bind<IGetBookingSegmentUseCase>(TYPES_BOOKING_USECASES.GetBookingSegmentUseCase).to(GetBookingSegmentUseCase);
container.bind<IUpdateBookingSegmentUseCase>(TYPES_BOOKING_USECASES.UpdateBookingSegmentUseCase).to(UpdateBookingSegmentUseCase);
container.bind<IGetBookingSeatsMapUseCase>(TYPES_BOOKING_USECASES.GetBookingSeatsMapUseCase).to(GetBookingSeatsMapUseCase);
container.bind<ISeatLockUseCase>(TYPES_BOOKING_USECASES.SeatLockUseCase).to(SeatLockUseCase);
container.bind<IBookingDetailsUseCase>(TYPES_BOOKING_USECASES.BookingDetailsUseCase).to(BookingDetailsUseCase);
container.bind<IGetBookingSummaryUseCase>(TYPES_BOOKING_USECASES.GetBookingSummaryUseCase).to(GetBookingSummaryUseCase);

container.bind<IInitiateBookingUseCase>(TYPES_BOOKING_USECASES.InitiateBookingUseCase).to(InitiateBookingUseCase);
container.bind<IRetryPaymentUseCase>(TYPES_BOOKING_USECASES.RetryPaymentUseCase).to(RetryPaymentUseCase);
container.bind<IHandleWebhookUseCase>(TYPES_BOOKING_USECASES.HandleWebhookUseCase).to(HandleWebhookUseCase);

container.bind<IGetBookingByIdUseCase>(TYPES_BOOKING_USECASES.GetBookingByIdUseCase).to(GetBookingByIdUseCase);
container.bind<IGetUserBookingsUseCase>(TYPES_BOOKING_USECASES.GetUserBookingsUseCase).to(GetUserBookingsUseCase);
container.bind<IGetProviderBookingsUseCase>(TYPES_BOOKING_USECASES.GetProviderBookingsUseCase).to(GetProviderBookingsUseCase);
container.bind<IGetAdminBookingsUseCase>(TYPES_BOOKING_USECASES.GetAdminBookingsUseCase).to(GetAdminBookingsUseCase);
container.bind<IGetTicketUseCase>(TYPES_BOOKING_USECASES.GetTicketUseCase).to(GetTicketUseCase);
container.bind<ICancelPassengerUseCase>(TYPES_BOOKING_USECASES.CancelPassengerUseCase).to(CancelPassengerUseCase);
container.bind<IGetUserWalletUseCase>(TYPES_BOOKING_USECASES.GetUserWalletUseCase).to(GetUserWalletUseCase);
container.bind<IGetProviderWalletUseCase>(TYPES_BOOKING_USECASES.GetProviderWalletUseCase).to(GetProviderWalletUseCase);
container.bind<IGetProviderBookingByIdUseCase>(TYPES_BOOKING_USECASES.GetProviderBookingByIdUseCase).to(GetProviderBookingByIdUseCase);

container.bind<ICreateOfferUseCase>(TYPES_OFFER_USECASES.CreateOfferUseCase).to(CreateOfferUseCase);
container.bind<IGetEligibleOffersUseCase>(TYPES_OFFER_USECASES.GetEligibleOffersUseCase).to(GetEligibleOffersUseCase);
container.bind<IOfferStatusChangeUseCase>(TYPES_OFFER_USECASES.OfferStatusChangeUseCase).to(OfferStatusChangeUseCase)
container.bind<IUpdateOfferUseCase>(TYPES_OFFER_USECASES.UpdateOfferUseCase).to(UpdateOfferUseCase);
container.bind<IGetProviderOffersUseCase>(TYPES_OFFER_USECASES.GetProviderOffersUseCase).to(GetProviderOffersUseCase);
container.bind<IDeleteOfferUseCase>(TYPES_OFFER_USECASES.DeleteOfferUseCase).to(DeleteOfferUseCase);


container.bind<ICreateFoodUseCase>(TYPES_FOOD_USECASES.CreateFoodUseCase).to(CreateFoodUseCase);
container.bind<IUpdateFoodUseCase>(TYPES_FOOD_USECASES.UpdateFoodUseCase).to(UpdateFoodUseCase);
container.bind<IGetFoodsByAircraftUseCase>(TYPES_FOOD_USECASES.GetFoodsByAircraftUseCase).to(GetFoodsByAircraftUseCase);
container.bind<IGetFoodsByProviderUseCase>(TYPES_FOOD_USECASES.GetFoodsByProviderUseCase).to(GetFoodsByProviderUseCase);
container.bind<IFoodStatusChangeUseCase>(TYPES_FOOD_USECASES.FoodStatusChangeUseCase).to(FoodStatusChangeUseCase);
container.bind<IDeleteFoodUseCase>(TYPES_FOOD_USECASES.DeleteFoodUseCase).to(DeleteFoodUseCase);


// Bind Controllers
container.bind(TYPES_AUTH_CONTROLLERS.SignUpUserController).to(SignUpUserController);
container.bind(TYPES_AUTH_CONTROLLERS.SignUpProviderController).to(SignUpProviderController);
container.bind(TYPES_AUTH_CONTROLLERS.OtpController).to(OtpController);
container.bind(TYPES_AUTH_CONTROLLERS.SignInController).to(SignInController);
container.bind(TYPES_AUTH_CONTROLLERS.SignOutController).to(SignOutController);
container.bind(TYPES_AUTH_CONTROLLERS.RefreshAccessTokenController).to(RefreshAccessTokenController);
container.bind(TYPES_AUTH_CONTROLLERS.ForgotPasswordController).to( ForgotPasswordController);
container.bind(TYPES_AUTH_CONTROLLERS.PasswordResetLinkController).to(PasswordResetLinkController);
container.bind(TYPES_AUTH_CONTROLLERS.GoogleAuthController).to(GoogleAuthController);
container.bind(TYPES_AUTH_CONTROLLERS.ChangePasswordController).to(ChangePasswordController)

container.bind(TYPES_ADMIN_CONTROLLERS.ProviderVerificationController).to(ProviderVerificationController);
container.bind(TYPES_ADMIN_CONTROLLERS.GetAllProvidersController).to(GetAllProvidersController);
container.bind(TYPES_ADMIN_CONTROLLERS.UpdateProviderStatusController).to(UpdateProviderStatusController);
container.bind(TYPES_ADMIN_CONTROLLERS.GetAllUsersController).to(GetAllUsersController);
container.bind(TYPES_ADMIN_CONTROLLERS.UpdateUserStatusController).to(UpdateUserStatusController);
container.bind(TYPES_ADMIN_CONTROLLERS.GetAdminDashboardController).to(GetAdminDashboardController);
container.bind(TYPES_ADMIN_CONTROLLERS.SetProviderCommissionController).to(SetProviderCommissionController);
container.bind(TYPES_ADMIN_CONTROLLERS.GetAdminWalletController).to(GetAdminWalletController);

container.bind(TYPES_PROVIDER_CONTROLLERS.CompleteProviderProfileController).to(CompleteProviderProfileController);
container.bind(TYPES_PROVIDER_CONTROLLERS.GetProviderProfileController).to(GetProviderProfileController);

container.bind(TYPES_AIRCRAFT_CONTROLLERS.CreateAircraftController).to(CreateAircraftController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.GetProviderAircraftsController).to(GetProviderAircraftsController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.UpdateAircraftController).to(UpdateAircraftController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.DeleteAircraftController).to(DeleteAircraftController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.SearchDestinationsController).to(SearchDestinationsController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.GetAllSeatTypesController).to(GetAllSeatTypesController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.CreateSeatLayoutController).to(CreateSeatLayoutController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.GenerateSeatsController).to(GenerateSeatsController); 
container.bind(TYPES_AIRCRAFT_CONTROLLERS.GetSeatLayoutsController).to(GetSeatLayoutsController);
container.bind(TYPES_AIRCRAFT_CONTROLLERS.DeleteSeatLayoutController).to(DeleteSeatLayoutController)

container.bind(TYPES_FLIGHT_CONTROLLERS.CreateFlightController).to(CreateFlightController);
container.bind(TYPES_FLIGHT_CONTROLLERS.GetProviderFlightsController).to(GetProviderFlightsController);
container.bind(TYPES_FLIGHT_CONTROLLERS.PendingFlightsForApprovalController).to(PendingFlightsForApprovalController);
container.bind(TYPES_FLIGHT_CONTROLLERS.ApproveFlightController).to(ApproveFlightController); 
container.bind(TYPES_FLIGHT_CONTROLLERS.AvailableAircraftsForScheduleController).to(AvailableAircraftsForScheduleController);
container.bind(TYPES_FLIGHT_CONTROLLERS.UpdateFlightController).to(UpdateFlightController);
container.bind(TYPES_FLIGHT_CONTROLLERS.GetFlightByIdController).to(GetFlightByIdController);
container.bind(TYPES_FLIGHT_CONTROLLERS.SearchFlightsController).to(SearchFlightsController);  
container.bind(TYPES_FLIGHT_CONTROLLERS.DeleteFlightController).to(DeleteFlightController);
container.bind(TYPES_FLIGHT_CONTROLLERS.GetFlightSeatsController).to(GetFlightSeatsController);
container.bind(TYPES_FLIGHT_CONTROLLERS.GetFlightSeatsForUserController).to(GetFlightSeatsForUserController);
container.bind(TYPES_FLIGHT_CONTROLLERS.CreateRecurringFlightController).to(CreateRecurringFlightController);   
container.bind(TYPES_FLIGHT_CONTROLLERS.GetAllFlightsForAdminController).to(GetAllFlightsForAdminController);
container.bind(TYPES_FLIGHT_CONTROLLERS.RejectSingleFlightController).to(RejectSingleFlightController); 

container.bind(TYPES_BOOKING_CONTROLLERS.AddFlightToSegmentController).to(AddFlightToSegmentController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetBookingSegmentController).to(GetBookingSegmentController);
container.bind(TYPES_BOOKING_CONTROLLERS.UpdateBookingSegmentController).to(UpdateBookingSegmentController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetBookingSeatsMapController).to(GetBookingSeatsMapController);
container.bind(TYPES_BOOKING_CONTROLLERS.SeatLockController).to(SeatLockController);
container.bind(TYPES_BOOKING_CONTROLLERS.BookingDetailsController).to(BookingDetailsController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetBookingSummaryController).to(GetBookingSummaryController);

container.bind(TYPES_BOOKING_CONTROLLERS.InitiateBookingController).to(InitiateBookingController);
container.bind(TYPES_BOOKING_CONTROLLERS.RetryPaymentController).to(RetryPaymentController);
container.bind(TYPES_BOOKING_CONTROLLERS.HandleWebhookController).to(HandleWebhookController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetBookingByIdController).to(GetBookingByIdController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetUserBookingsController).to(GetUserBookingsController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetProviderBookingsController).to(GetProviderBookingsController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetAdminBookingsController).to(GetAdminBookingsController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetTicketController).to(GetTicketController);
container.bind(TYPES_BOOKING_CONTROLLERS.CancelPassengerController).to(CancelPassengerController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetUserWalletController).to(GetUserWalletController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetProviderWalletController).to(GetProviderWalletController);
container.bind(TYPES_BOOKING_CONTROLLERS.GetProviderBookingByIdController).to(GetProviderBookingByIdController);

container.bind(TYPES_OFFER_CONTROLLERS.CreateOfferController).to(CreateOfferController);
container.bind(TYPES_OFFER_CONTROLLERS.DeleteOfferController).to(DeleteOfferController);
container.bind(TYPES_OFFER_CONTROLLERS.GetEligibleOffersController).to(GetEligibleOffersController);
container.bind(TYPES_OFFER_CONTROLLERS.GetProviderOffersController).to(GetProviderOffersController);
container.bind(TYPES_OFFER_CONTROLLERS.OfferStatusChangeController).to(OfferStatusChangeController);
container.bind(TYPES_OFFER_CONTROLLERS.UpdateOfferController).to(UpdateOfferController);

container.bind(TYPES_FOOD_CONTROLLERS.CreateFoodController).to(CreateFoodController);
container.bind(TYPES_FOOD_CONTROLLERS.GetFoodsByProviderController).to(GetFoodsByProviderController);
container.bind(TYPES_FOOD_CONTROLLERS.GetFoodsByAircraftController).to(GetFoodsByAircraftController);
container.bind(TYPES_FOOD_CONTROLLERS.FoodStatusChangeController).to(FoodStatusChangeController);
container.bind(TYPES_FOOD_CONTROLLERS.UpdateFoodController).to(UpdateFoodController);
container.bind(TYPES_FOOD_CONTROLLERS.DeleteFoodController).to(DeleteFoodController);

container.bind(TYPES_USER_CONTROLLERS.GetUserProfileController).to(GetUserProfileController);
container.bind(TYPES_USER_CONTROLLERS.UpdateUserProfileController).to(UpdateUserProfileController); 


export { container };

