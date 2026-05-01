import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "../middlewares/auth.middleware";

import {signUpUserController} from "@di/container-resolver";
import { signUpProviderController } from "@di/container-resolver";
import {otpController} from "@di/container-resolver";
import {signInController} from "@di/container-resolver";
import { signOutController } from "@di/container-resolver";
import { refreshAccessTokenController } from "@di/container-resolver";
import { forgotPasswordController } from "@di/container-resolver";
import { passwordResetLinkController } from "@di/container-resolver";
import { googleAuthController } from "@di/container-resolver";
import { changePasswordController } from "@di/container-resolver";



const authRoutes = express.Router();

// registrtion and login routes

authRoutes.post("/user/sign-up",asyncHandler(signUpUserController.handle.bind(signUpUserController)));
authRoutes.post("/provider/sign-up",asyncHandler(signUpProviderController.handle.bind(signUpProviderController)));
authRoutes.post("/sign-in",asyncHandler(signInController.handle.bind(signInController)));
authRoutes.post("/google",asyncHandler(googleAuthController.handle.bind(googleAuthController)));

// otp
authRoutes.post("/otp/verify",asyncHandler(otpController.verifyOtp.bind(otpController)));
authRoutes.post("/otp/resend", asyncHandler(otpController.resendOtp.bind(otpController)));

authRoutes.post("/sign-out",asyncHandler(signOutController.handle.bind(signOutController)));
authRoutes.post("/refresh-token",asyncHandler(refreshAccessTokenController.handle.bind(refreshAccessTokenController)));

// PASSWORD ROUTES

authRoutes.patch("/password-reset",asyncHandler(passwordResetLinkController.handle.bind(passwordResetLinkController)));
authRoutes.post("/password-reset/:token", asyncHandler(forgotPasswordController.handle.bind(forgotPasswordController)));
authRoutes.patch("/password/change", authenticate,asyncHandler(changePasswordController.handle.bind(changePasswordController)));

export default authRoutes;