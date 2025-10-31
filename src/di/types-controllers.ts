
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

export const TYPES_PROVIDER_CONTROLLERS = {
    ProviderVerificationController : Symbol.for("ProviderVerificationController"),
    
}