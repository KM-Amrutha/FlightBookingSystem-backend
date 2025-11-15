import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticateAdmin } from "@presentation/middlewares/admin.middleware";
import { providerVerificationController } from "@di/container-resolver";

const adminRoutes = express.Router();

adminRoutes.get("/providers/pending",authenticateAdmin,asyncHandler(providerVerificationController.getPendingProviders.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/verify",authenticateAdmin,asyncHandler(providerVerificationController.verifyProvider.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/reject",authenticateAdmin,asyncHandler(providerVerificationController.rejectProvider.bind(providerVerificationController)));

export default adminRoutes;
