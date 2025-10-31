import {container} from "@di/container";


import {
  SignUpUserController,
  SignUpProviderController,
  OtpController,
  SignInController,
  SignOutController,
  RefreshAccessTokenController,
   ForgotPasswordController,
   PasswordResetLinkController,
   ProviderVerificationController,

CreateProviderUseCase,
CreateUserUseCase,
  TokenUseCase,
  CheckUserBlockStatusUseCase,
   OtpUseCase,
   SignInUseCase,
   SendPasswordRestLinkUseCase,
    GetPendingProvidersUseCase,
    RejectProviderUseCase,
    VerifyProviderUseCase,

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

} from "@di/file-imports-index"

import {TYPES_AUTH_CONTROLLERS, TYPES_PROVIDER_CONTROLLERS} from "@di/types-controllers";
import {TYPES_AUTH_USECASES, TYPES_LOGGER_USECASES,TYPES_PROVIDER_USECASES} from "@di/types-usecases";
import {TYPES_SERVICES} from "di/types-services"


export const signUpUserController = container.get<SignUpUserController>(TYPES_AUTH_CONTROLLERS.SignUpUserController);
export const signUpProviderController = container.get<SignUpProviderController>(TYPES_AUTH_CONTROLLERS.SignUpProviderController);
export const otpController = container.get<OtpController>(TYPES_AUTH_CONTROLLERS.OtpController);
export const signInController = container.get<SignInController>(TYPES_AUTH_CONTROLLERS.SignInController);
export const signOutController = container.get<SignOutController>(TYPES_AUTH_CONTROLLERS.SignOutController);
export const refreshAccessTokenController = container.get<RefreshAccessTokenController>(TYPES_AUTH_CONTROLLERS.RefreshAccessTokenController);
export const  forgotPasswordController = container.get<ForgotPasswordController>(TYPES_AUTH_CONTROLLERS.ForgotPasswordController);
export const passwordResetLinkController = container.get<PasswordResetLinkController>(TYPES_AUTH_CONTROLLERS.PasswordResetLinkController);
export const providerVerificationController = container.get<ProviderVerificationController>(TYPES_PROVIDER_CONTROLLERS.ProviderVerificationController);



export const createUseUseCase = container.get<ICreateUserUseCase>(TYPES_AUTH_USECASES.CreateUserUseCase);
export const createProviderUseCase = container.get<ICreateProviderUseCase>(TYPES_AUTH_USECASES.CreateProviderUseCase);
export const tokenUseCase = container.get<ITokenUseCase>(TYPES_AUTH_USECASES.TokenUseCase);
export const checkUserBlockStatusUseCase = container.get<ICheckUserBlockStatusUseCase>(TYPES_AUTH_USECASES.CheckUserBlockStatusUseCase);
export const otpUseCase = container.get<IOtpUseCase>(TYPES_AUTH_USECASES.OtpUseCase);
export const signInUseCase = container.get<ISignInUseCase>(TYPES_AUTH_USECASES.SignInUseCase);
export const forgotPasswordUseCase = container.get<IForgotPasswordUseCase>(TYPES_AUTH_USECASES.ForgotPasswordUseCase);
export const sendPasswordResetLinkUseCase = container.get<ISendPasswordRestLinkUseCase>(TYPES_AUTH_USECASES.SendPasswordRestLinkUseCase);
export const loggerUseCase = container.get<ILoggerUseCase>(TYPES_LOGGER_USECASES.LoggerUseCase);
export const getPendingProvidersUseCase = container.get<IGetPendingProvidersUseCase>(TYPES_PROVIDER_USECASES.GetPendingProvidersUseCase)
export const rejectProviderUseCase = container.get<IRejectProviderUseCase>(TYPES_PROVIDER_USECASES.RejectProviderUseCase);
export const verifyProviderUseCase = container.get<IVerifyProviderUseCase>(TYPES_PROVIDER_USECASES.VerifyProviderUseCase);
