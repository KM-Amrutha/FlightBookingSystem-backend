import { Container } from "inversify";

import {
    TYPES_AUTH_CONTROLLERS,
    TYPES_ADMIN_CONTROLLERS,
    TYPES_PROVIDER_CONTROLLERS,
    TYPES_AIRCRAFT_CONTROLLERS,

} from "@di/types-controllers"

import { TYPES_AUTH_USECASES,
     TYPES_LOGGER_USECASES, 
     TYPES_PROVIDER_USECASES,
    TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { TYPES_SERVICES } from "di/types-services"

import { TYPES_REPOSITORIES, TYPES_AIRCRAFT_REPOSITORIES }   from "di/types-repositories"

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


// controllers

SignUpUserController,
SignUpProviderController,
OtpController,
SignInController,
SignOutController,
RefreshAccessTokenController,
 ForgotPasswordController,
 PasswordResetLinkController,

 ProviderVerificationController,

 CompleteProviderProfileController,
 GetProviderProfileController,

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



IUserRepository,
IOtpRepository,
IProviderRepository,
IPasswordResetRepository,

IAircraftRepository,
IDestinationRepository,
ISeatRepository,
ISeatLayoutRepository,
ISeatTypeRepository,

IAuthService,
IEncryptionService,
IHashService,
IOtpService,
IEmailService,
ICloudStorageService,
ILoggerService,



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

GetPendingProvidersUseCase,
VerifyProviderUseCase,
RejectProviderUseCase,
CompleteProviderProfileUseCase,
GetProviderProfileUseCase,

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





// Bind Services
container.bind<IAuthService>(TYPES_SERVICES.JwtService).to(JwtService);
container.bind<IEncryptionService>(TYPES_SERVICES.EncryptionService).to(EncryptionService);
container.bind<IHashService>(TYPES_SERVICES.HashService).to(HashService);
container.bind<IOtpService>(TYPES_SERVICES.OtpService).to(OtpService);
container.bind<IEmailService>(TYPES_SERVICES.EmailService).to(EmailService);
container.bind<ICloudStorageService>(TYPES_SERVICES.CloudinaryService).to(CloudinaryService);
container.bind<ILoggerService>(TYPES_SERVICES.LoggerService).to(LoggerService);


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

container.bind<ICreateAircraftUseCase>(TYPES_ARICRAFT_USECASES.CreateAircraftUseCase).to(CreateAircraftUseCase);
container.bind<IUpdateAircraftUseCase>(TYPES_ARICRAFT_USECASES.UpdateAircraftUseCase).to(UpdateAircraftUseCase);
container.bind<IGetProviderAircraftsUseCase>(TYPES_ARICRAFT_USECASES.GetAircraftsUseCase).to(GetProviderAircraftsUseCase);
container.bind<IDeleteAircraftUseCase>(TYPES_ARICRAFT_USECASES.DeleteAircraftUseCase).to(DeleteAircraftUseCase);
container.bind<IUpdateAircraftStatusUseCase>(TYPES_ARICRAFT_USECASES.UpdateAircraftStatusUseCase).to(UpdateAircraftStatusUseCase);
container.bind<ISearchDestinationsUseCase>(TYPES_ARICRAFT_USECASES.SearchDestinationsUseCase).to(SearchDestinationsUseCase);
container.bind<IUpdateAircraftLocationUseCase>(TYPES_ARICRAFT_USECASES.UpdateAircraftLocationUseCase).to(UpdateAircraftLocationUseCase);
container.bind<ICreateSeatLayoutUseCase>(TYPES_ARICRAFT_USECASES.CreateSeatLayoutUseCase).to(CreateSeatLayoutUseCase);
container.bind<IGenerateSeatsUseCase>(TYPES_ARICRAFT_USECASES.GenerateSeatsUseCase).to(GenerateSeatsUseCase);
container.bind<IGetAllSeatTypesUseCase>(TYPES_ARICRAFT_USECASES.GetAllSeatTypesUseCase).to(GetAllSeatTypesUseCase);
container.bind<IGetSeatLayoutsByAircraftUseCase>(TYPES_ARICRAFT_USECASES.GetSeatLayoutsByAircraftUseCase).to(GetSeatLayoutsByAircraftUseCase)
container.bind<IDeleteSeatLayoutUseCase>(TYPES_ARICRAFT_USECASES.DeleteSeatLayoutUseCase).to(DeleteSeatLayoutUseCase)



// Bind Controllers
container.bind(TYPES_AUTH_CONTROLLERS.SignUpUserController).to(SignUpUserController);
container.bind(TYPES_AUTH_CONTROLLERS.SignUpProviderController).to(SignUpProviderController);
container.bind(TYPES_AUTH_CONTROLLERS.OtpController).to(OtpController);
container.bind(TYPES_AUTH_CONTROLLERS.SignInController).to(SignInController);
container.bind(TYPES_AUTH_CONTROLLERS.SignOutController).to(SignOutController);
container.bind(TYPES_AUTH_CONTROLLERS.RefreshAccessTokenController).to(RefreshAccessTokenController);
container.bind(TYPES_AUTH_CONTROLLERS.ForgotPasswordController).to( ForgotPasswordController);
container.bind(TYPES_AUTH_CONTROLLERS.PasswordResetLinkController).to(PasswordResetLinkController);

container.bind(TYPES_ADMIN_CONTROLLERS.ProviderVerificationController).to(ProviderVerificationController);

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


export { container };

