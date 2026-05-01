export const TYPES_AUTH_USECASES = {
            CheckUserBlockStatusUseCase: Symbol.for("CheckUserBlockStatusUseCase"),
            TokenUseCase: Symbol.for("TokenUseCase"),
            CreateUserUseCase: Symbol.for("CreateUserUseCase"),
            CreateProviderUseCase:Symbol.for("CreateProviderUseCase"),
            OtpUseCase:Symbol.for("OtpUseCase"),
            SignInUseCase : Symbol.for("SignInUseCase"),
            ForgotPasswordUseCase: Symbol.for("ForgotPasswordUseCase"),
            SendPasswordRestLinkUseCase: Symbol.for("SendPasswordRestLinkUseCase"),
            GoogleAuthUseCase: Symbol.for("GoogleAuthUseCase"),
            ChangePasswordUseCase: Symbol.for("ChangePasswordUseCase"),
}

export const TYPES_LOGGER_USECASES = {
             LoggerUseCase: Symbol.for("LoggerUseCase"),
};
 

export const  TYPES_PROVIDER_USECASES = {
    GetPendingProvidersUseCase: Symbol.for("GetPendingProvidersUseCase"),
    RejectProviderUseCase: Symbol.for("RejectProviderUseCase"),
    VerifyProviderUseCase:Symbol.for("VerifyProviderUseCase"),

    CompleteProviderProfileUseCase:Symbol.for("CompleteProviderProfileUseCase"),
    GetProviderProfileUseCase:Symbol.for("GetProviderProfileUseCase"),
       
}

export const TYPES_USER_USECASES = {
  UpdateUserProfileUseCase: Symbol.for("UpdateUserProfileUseCase"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),

}

export const TYPES_ADMIN_USECASES = {

  GetAllProvidersUseCase: Symbol.for("GetAllProvidersUseCase"),
  UpdateProviderStatusUseCase: Symbol.for("UpdateProviderStatusUseCase"), 
  GetAllUsersUseCase: Symbol.for("GetAllUsersUseCase"),
  UpdateUserStatusUseCase: Symbol.for("UpdateUserStatusUseCase"),
}

export const TYPES_AIRCRAFT_USECASES = {
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
  DeleteSeatLayoutUseCase: Symbol.for("DeleteSeatLayoutUseCase"),
}
export const TYPES_FLIGHT_USECASES = {
  CreateFlightUseCase: Symbol.for("CreateFlightUseCase"),
  GetProviderFlightsUseCase: Symbol.for("GetProviderFlightsUseCase"),
  
  PendingFlightsForApprovalUseCase: Symbol.for("PendingFlightsForApprovalUseCase"),
  ApproveFlightUseCase: Symbol.for("ApproveFlightUseCase"),
  AvailableAircraftsForScheduleUseCase: Symbol.for("AvailableAircraftsForScheduleUseCase"),
  UpdateFlightUseCase: Symbol.for("UpdateFlightUseCase"),
  SearchFlightsUseCase: Symbol.for("SearchFlightsUseCase"),
  DeleteFlightUseCase:Symbol.for("DeleteFlightUseCase"),
  GetFlightSeatsUseCase: Symbol.for("GetFlightSeatsUseCase"),
  CreateRecurringFlightUseCase: Symbol.for("CreateRecurringFlightUseCase"),
  GetFlightByIdUseCase: Symbol.for("GetFlightByIdUseCase"),
  GetAllFlightsForAdminUseCase: Symbol.for("GetAllFlightsForAdminUseCase"),
  RejectSingleFlightUseCase: Symbol.for("RejectSingleFlightUseCase"),
}