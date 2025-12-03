export const TYPES_AUTH_CONTROLLERS = {
    SignUpUserController: Symbol.for("SignUpUserController"),
    SignUpProviderController: Symbol.for("SignUpProviderController"),
    OtpController: Symbol.for("OtpController"),
    SignInController: Symbol.for("SignInController"),
    SignOutController:Symbol.for("SignOutController"),
    RefreshAccessTokenController:Symbol.for("RefreshAccessTokenController"),
    ForgotPasswordController: Symbol.for("ForgotPasswordController"),
    PasswordResetLinkController: Symbol.for("PasswordResetLinkController"),
    
}

export const TYPES_ADMIN_CONTROLLERS = {
    ProviderVerificationController : Symbol.for("ProviderVerificationController"),
    
}

export const TYPES_PROVIDER_CONTROLLERS = {
    CompleteProviderProfileController : Symbol.for("CompleteProviderProfileController"),
    GetProviderProfileController : Symbol.for("GetProviderProfileController"),
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
    DeleteSeatLayoutController: Symbol.for("DeleteSeatLayoutController")
}
