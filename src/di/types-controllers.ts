export const TYPES_AUTH_CONTROLLERS = {
    SignUpUserController: Symbol.for("SignUpUserController"),
    SignUpProviderController: Symbol.for("SignUpProviderController"),
    OtpController: Symbol.for("OtpController"),
    SignInController: Symbol.for("SignInController"),
    SignOutController:Symbol.for("SignOutController"),
    RefreshAccessTokenController:Symbol.for("RefreshAccessTokenController"),
    ForgotPasswordController: Symbol.for("ForgotPasswordController"),
    PasswordResetLinkController: Symbol.for("PasswordResetLinkController"),
    GoogleAuthController: Symbol.for("GoogleAuthController"),
    ChangePasswordController:Symbol.for("ChangePasswordController")
    
}

export const TYPES_ADMIN_CONTROLLERS = {
    ProviderVerificationController : Symbol.for("ProviderVerificationController"),
    GetAllProvidersController : Symbol.for("GetAllProvidersController"),
    UpdateProviderStatusController : Symbol.for("UpdateProviderStatusController"),
    GetAllUsersController : Symbol.for("GetAllUsersController"),
    UpdateUserStatusController : Symbol.for("UpdateUserStatusController"),
}

export const TYPES_PROVIDER_CONTROLLERS = {
    CompleteProviderProfileController : Symbol.for("CompleteProviderProfileController"),
    GetProviderProfileController : Symbol.for("GetProviderProfileController"),
}

export const TYPES_USER_CONTROLLERS = {
    GetUserProfileController: Symbol.for("GetUserProfileController"),
    UpdateUserProfileController: Symbol.for("UpdateUserProfileController"),
}

export const TYPES_AIRCRAFT_CONTROLLERS = {
    CreateAircraftController: Symbol.for("CreateAircraftController"),
    GetProviderAircraftsController: Symbol.for("GetProviderAircraftsController"),
    UpdateAircraftController: Symbol.for("UpdateAircraftController"),
    DeleteAircraftController: Symbol.for("DeleteAircraftController"),
    SearchDestinationsController: Symbol.for("SearchDestinationsController"),
    GetAllSeatTypesController: Symbol.for("GetAllSeatTypesController"),
    CreateSeatLayoutController: Symbol.for("CreateSeatLayoutController"),
    GenerateSeatsController: Symbol.for("GenerateSeatsController"), 
    GetSeatLayoutsController: Symbol.for("GetSeatLayoutsController"),
    DeleteSeatLayoutController: Symbol.for("DeleteSeatLayoutController"),
}
export const TYPES_FLIGHT_CONTROLLERS = {
    ApproveFlightController: Symbol.for("ApproveFlightController"),
    CreateFlightController: Symbol.for("CreateFlightController"),
    GetProviderFlightsController: Symbol.for("GetProviderFlightsController"),
    PendingFlightsForApprovalController: Symbol.for("PendingFlightsForApprovalController"),
    AvailableAircraftsForScheduleController: Symbol.for("AvailableAircraftsForScheduleController"),
    UpdateFlightController: Symbol.for("UpdateFlightController"),
     GetFlightByIdController: Symbol.for("GetFlightByIdController"),
    SearchFlightsController: Symbol.for("SearchFlightsController"),
    DeleteFlightController:Symbol.for("DeleteFlightController"),
    GetFlightSeatsController: Symbol.for("GetFlightSeatsController"),
    GetFlightSeatsForUserController: Symbol.for("GetFlightSeatsForUserController"),
    CreateRecurringFlightController: Symbol.for("CreateRecurringFlightController"),
    RejectSingleFlightController: Symbol.for("RejectSingleFlightController"),
    GetAllFlightsForAdminController: Symbol.for("GetAllFlightsForAdminController"),
   
}
