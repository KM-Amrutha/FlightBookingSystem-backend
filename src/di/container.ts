import { Container } from "inversify";

import {
    TYPES_AUTH_CONTROLLERS,
    TYPES_PROVIDER_CONTROLLERS

} from "@di/types-controllers"

import { TYPES_AUTH_USECASES, TYPES_LOGGER_USECASES, TYPES_PROVIDER_USECASES } from "@di/types-usecases";
import { TYPES_SERVICES } from "di/types-services"
import { TYPES_REPOSITORIES }   from "di/types-repositories"

import {
OtpRepository,
UserRepository,
ProviderRepository,
PasswordResetRepository,

SignUpUserController,
SignUpProviderController,
OtpController,
SignInController,
SignOutController,
RefreshAccessTokenController,
 ForgotPasswordController,
 PasswordResetLinkController,
 ProviderVerificationController,

IUserRepository,
IOtpRepository,
IProviderRepository,
IPasswordResetRepository,

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
IVerifyProviderUseCase

} from "@di/file-imports-index";

const container = new Container();

// Bind Repositories
container.bind<IUserRepository>(TYPES_REPOSITORIES.UserRepository).to(UserRepository);
container.bind<IOtpRepository>(TYPES_REPOSITORIES.OtpRepository).to(OtpRepository);
container.bind<IProviderRepository>(TYPES_REPOSITORIES.ProviderRepository).to(ProviderRepository);
container.bind<IPasswordResetRepository>(TYPES_REPOSITORIES.PasswordResetRepository).to(PasswordResetRepository);



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



// Bind Controllers
container.bind(TYPES_AUTH_CONTROLLERS.SignUpUserController).to(SignUpUserController);
container.bind(TYPES_AUTH_CONTROLLERS.SignUpProviderController).to(SignUpProviderController);
container.bind(TYPES_AUTH_CONTROLLERS.OtpController).to(OtpController);
container.bind(TYPES_AUTH_CONTROLLERS.SignInController).to(SignInController);
container.bind(TYPES_AUTH_CONTROLLERS.SignOutController).to(SignOutController);
container.bind(TYPES_AUTH_CONTROLLERS.RefreshAccessTokenController).to(RefreshAccessTokenController);
container.bind(TYPES_AUTH_CONTROLLERS.ForgotPasswordController).to( ForgotPasswordController);
container.bind(TYPES_AUTH_CONTROLLERS.PasswordResetLinkController).to(PasswordResetLinkController);
container.bind(TYPES_PROVIDER_CONTROLLERS.ProviderVerificationController).to(ProviderVerificationController);

export { container };

