import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "@presentation/middlewares/auth.middleware";
// import { authenticateAdmin } from "@presentation/middlewares/admin.middleware";
import { providerVerificationController } from "@di/container-resolver";

const adminRoutes = express.Router();

adminRoutes.get("/providers/pending",authenticate,asyncHandler(providerVerificationController.getPendingProviders.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/verify",authenticate,asyncHandler(providerVerificationController.verifyProvider.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/reject",authenticate,asyncHandler(providerVerificationController.rejectProvider.bind(providerVerificationController)));

export default adminRoutes;
