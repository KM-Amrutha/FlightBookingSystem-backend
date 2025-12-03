export const TYPES_AUTH_USECASES = {
    CheckUserBlockStatusUseCase: Symbol.for("CheckUserBlockStatusUseCase"),
    TokenUseCase: Symbol.for("TokenUseCase"),
        CreateUserUseCase: Symbol.for("CreateUserUseCase"),
        CreateProviderUseCase:Symbol.for("CreateProviderUseCase"),
        OtpUseCase:Symbol.for("OtpUseCase"),
            SignInUseCase : Symbol.for("SignInUseCase"),
            ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
            SendPasswordRestLinkUseCase: Symbol.for("SendPasswordRestLinkUseCase"),
}

export const TYPES_LOGGER_USECASES = {
  LoggerUseCase: Symbol.for("LoggerUseCase"),
};
 

export const  TYPES_PROVIDER_USECASES = {
  GetPendingProvidersUseCase: Symbol.for("GetPendingProvidersUseCase"),
    RejectProviderUseCase: Symbol.for("RejectProviderUseCase"),
    VerifyProviderUseCase:Symbol.for("VerifyProviderUseCase"),

      CompleteProviderProfileUseCase:Symbol.for("CompleteProviderProfileUseCase"),
      GetProviderProfileUseCase:Symbol.for("GetProviderProfileUseCase")
}

export const TYPES_ARICRAFT_USECASES = {
  CreateAircraftUseCase: Symbol.for("CreateAircraftUseCase"),
  UpdateAircraftUseCase: Symbol.for("UpdateAircraftUseCase"),
  GetAircraftsUseCase: Symbol.for("GetAircraftsUseCase"),
  DeleteAircraftUseCase: Symbol.for("DeleteAircraftUseCase"),
  SearchDestinationsUseCase: Symbol.for("SearchDestinationsUseCase"),
  UpdateAircraftStatusUseCase: Symbol.for("UpdateAircraftStatusUseCase"),
  UpdateAircraftLocationUseCase: Symbol.for("UpdateAircraftLocationUseCase"),
  CreateSeatLayoutUseCase: Symbol.for("CreateSeatLayoutUseCase"),
  GenerateSeatsUseCase: Symbol.for("GenerateSeatsUseCase"),
  GetAllSeatTypesUseCase: Symbol.for("GetAllSeatTypesUseCase"),
  GetSeatLayoutsByAircraftUseCase: Symbol.for("GetSeatLayoutsByAircraftUseCase"),
  DeleteSeatLayoutUseCase: Symbol.for("DeleteSeatLayoutUseCase")
  
}