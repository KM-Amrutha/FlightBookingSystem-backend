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

    CompleteProviderProfileController,
    GetProviderProfileController,
     GetAllSeatTypesController,
    CreateAircraftController,
    GetProviderAircraftsController,
    UpdateAircraftController, 
    DeleteAircraftController,
    SearchDestinationsController,
    CreateSeatLayoutController, 
    GenerateSeatsController,
    GetSeatLayoutsController,
    DeleteSeatLayoutController,

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
   IGetProviderProfileUseCase,
   ICompleteProviderProfileUseCase,
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
  

    
      
   

} from "@di/file-imports-index"

import {TYPES_AUTH_CONTROLLERS, TYPES_ADMIN_CONTROLLERS, TYPES_PROVIDER_CONTROLLERS,TYPES_AIRCRAFT_CONTROLLERS} from "@di/types-controllers";
import {TYPES_AUTH_USECASES, TYPES_LOGGER_USECASES,TYPES_PROVIDER_USECASES,TYPES_ARICRAFT_USECASES} from "@di/types-usecases";
import {TYPES_SERVICES} from "di/types-services"


export const signUpUserController = container.get<SignUpUserController>(TYPES_AUTH_CONTROLLERS.SignUpUserController);
export const signUpProviderController = container.get<SignUpProviderController>(TYPES_AUTH_CONTROLLERS.SignUpProviderController);
export const otpController = container.get<OtpController>(TYPES_AUTH_CONTROLLERS.OtpController);
export const signInController = container.get<SignInController>(TYPES_AUTH_CONTROLLERS.SignInController);
export const signOutController = container.get<SignOutController>(TYPES_AUTH_CONTROLLERS.SignOutController);
export const refreshAccessTokenController = container.get<RefreshAccessTokenController>(TYPES_AUTH_CONTROLLERS.RefreshAccessTokenController);
export const  forgotPasswordController = container.get<ForgotPasswordController>(TYPES_AUTH_CONTROLLERS.ForgotPasswordController);
export const passwordResetLinkController = container.get<PasswordResetLinkController>(TYPES_AUTH_CONTROLLERS.PasswordResetLinkController);
export const providerVerificationController = container.get<ProviderVerificationController>(TYPES_ADMIN_CONTROLLERS.ProviderVerificationController);

export const completeProviderProfileController = container.get<CompleteProviderProfileController>(TYPES_PROVIDER_CONTROLLERS.CompleteProviderProfileController);
export const getProviderProfileController = container.get<GetProviderProfileController>(TYPES_PROVIDER_CONTROLLERS.GetProviderProfileController);

export const createAircraftController = container.get<CreateAircraftController>(TYPES_AIRCRAFT_CONTROLLERS.CreateAircraftController);
export const getProviderAircraftsController = container.get<GetProviderAircraftsController>(TYPES_AIRCRAFT_CONTROLLERS.GetProviderAircraftsController);
export const updateAircraftController = container.get<UpdateAircraftController>(TYPES_AIRCRAFT_CONTROLLERS.UpdateAircraftController);
export const deleteAircraftController = container.get<DeleteAircraftController>(TYPES_AIRCRAFT_CONTROLLERS.DeleteAircraftController);
export const searchDestinationsController = container.get<SearchDestinationsController>(TYPES_AIRCRAFT_CONTROLLERS.SearchDestinationsController);
export const getAllSeatTypesController = container.get<GetAllSeatTypesController>(TYPES_AIRCRAFT_CONTROLLERS.GetAllSeatTypesController);
export const createSeatLayoutController = container.get<CreateSeatLayoutController>(TYPES_AIRCRAFT_CONTROLLERS.CreateSeatLayoutController);
export const generateSeatsController = container.get<GenerateSeatsController>(TYPES_AIRCRAFT_CONTROLLERS.GenerateSeatsController);
export const getSeatLayoutsController = container.get<GetSeatLayoutsController>(TYPES_AIRCRAFT_CONTROLLERS.GetSeatLayoutsController)
export const deletleSeatLayoutController = container.get<DeleteSeatLayoutController>(TYPES_AIRCRAFT_CONTROLLERS.DeleteSeatLayoutController)

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
export const completeProviderProfileUseCase = container.get<ICompleteProviderProfileUseCase>(TYPES_PROVIDER_USECASES.CompleteProviderProfileUseCase);
export const getProviderProfileUseCase = container.get<IGetProviderProfileUseCase>(TYPES_PROVIDER_USECASES.GetProviderProfileUseCase);

export const createAircraftUseCase = container.get<ICreateAircraftUseCase>(TYPES_ARICRAFT_USECASES.CreateAircraftUseCase);
export const updateAircraftUseCase = container.get<IUpdateAircraftUseCase>(TYPES_ARICRAFT_USECASES.UpdateAircraftUseCase);
export const getProviderAircraftsUseCase = container.get<IGetProviderAircraftsUseCase>(TYPES_ARICRAFT_USECASES.GetAircraftsUseCase);
export const deleteAircraftUseCase = container.get<IDeleteAircraftUseCase>(TYPES_ARICRAFT_USECASES.DeleteAircraftUseCase);
export const updateAircraftStatusUseCase = container.get<IUpdateAircraftStatusUseCase>(TYPES_ARICRAFT_USECASES.UpdateAircraftStatusUseCase);
export const searchDestinationsUseCase = container.get<ISearchDestinationsUseCase>(TYPES_ARICRAFT_USECASES.SearchDestinationsUseCase);
export const updateAircraftLocationUseCase = container.get<IUpdateAircraftLocationUseCase>(TYPES_ARICRAFT_USECASES.UpdateAircraftLocationUseCase);
export const createSeatLayoutUseCase = container.get<ICreateSeatLayoutUseCase>(TYPES_ARICRAFT_USECASES.CreateSeatLayoutUseCase);
export const generateSeatsUseCase = container.get<IGenerateSeatsUseCase>(TYPES_ARICRAFT_USECASES.GenerateSeatsUseCase);
export const getAllSeatTypesUseCase = container.get<IGetAllSeatTypesUseCase>(TYPES_ARICRAFT_USECASES.GetAllSeatTypesUseCase);
export const deleteSeatLayoutUseCase = container.get<DeleteSeatLayoutUseCase>(TYPES_ARICRAFT_USECASES.DeleteSeatLayoutUseCase)