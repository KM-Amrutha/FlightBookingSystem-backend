import { Container } from "inversify";

import {
    TYPES_AUTH_CONTROLLERS,
    TYPES_ADMIN_CONTROLLERS,
    TYPES_PROVIDER_CONTROLLERS,
    TYPES_AIRCRAFT_CONTROLLERS,
    TYPES_FLIGHT_CONTROLLERS,
    TYPES_USER_CONTROLLERS,

} from "@di/types-controllers"

import { TYPES_AUTH_USECASES,
         TYPES_LOGGER_USECASES, 
         TYPES_PROVIDER_USECASES,
         TYPES_ADMIN_USECASES,
         TYPES_AIRCRAFT_USECASES,
         TYPES_FLIGHT_USECASES,
         TYPES_USER_USECASES
        } 
         from "@di/types-usecases";
import { TYPES_SERVICES } from "di/types-services"

import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES, TYPES_BOOKING_REPOSITORIES }   from "di/types-repositories"

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


IAuthService,
IEncryptionService,
IHashService,
IOtpService,
IEmailService,
ICloudStorageService,
ILoggerService,
IGoogleAuthService,
IRedisService,

} from"@di/file-imports-index";

// services

import {
JwtService,
EncryptionService,
HashService,
OtpService,
EmailService,
CloudinaryService,
LoggerService,
GoogleAuthService,
RedisService,
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

// Bind Services
container.bind<IAuthService>(TYPES_SERVICES.JwtService).to(JwtService);
container.bind<IEncryptionService>(TYPES_SERVICES.EncryptionService).to(EncryptionService);
container.bind<IHashService>(TYPES_SERVICES.HashService).to(HashService);
container.bind<IOtpService>(TYPES_SERVICES.OtpService).to(OtpService);
container.bind<IEmailService>(TYPES_SERVICES.EmailService).to(EmailService);
container.bind<ICloudStorageService>(TYPES_SERVICES.CloudinaryService).to(CloudinaryService);
container.bind<ILoggerService>(TYPES_SERVICES.LoggerService).to(LoggerService);
container.bind<IGoogleAuthService>(TYPES_SERVICES.GoogleAuthService).to(GoogleAuthService);
container.bind<IRedisService>(TYPES_SERVICES.RedisService).to(RedisService);



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


container.bind(TYPES_USER_CONTROLLERS.GetUserProfileController).to(GetUserProfileController);
container.bind(TYPES_USER_CONTROLLERS.UpdateUserProfileController).to(UpdateUserProfileController); 


export { container };

