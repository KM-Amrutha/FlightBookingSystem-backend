import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticateAdmin } from "@presentation/middlewares/admin.middleware";
import { providerVerificationController,
        pendingFlightsForApprovalController,
        approveFlightController,
        getAllProvidersController,
        updateProviderStatusController
 } from "@di/container-resolver";

const adminRoutes = express.Router();

adminRoutes.get("/providers/pending",authenticateAdmin,asyncHandler(providerVerificationController.getPendingProviders.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/verify",authenticateAdmin,asyncHandler(providerVerificationController.verifyProvider.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/reject",authenticateAdmin,asyncHandler(providerVerificationController.rejectProvider.bind(providerVerificationController)));

adminRoutes.get('/flights/pending-approval', authenticateAdmin, asyncHandler(pendingFlightsForApprovalController.handle.bind(pendingFlightsForApprovalController)));
adminRoutes.patch('/flights/:flightId/approval', authenticateAdmin, asyncHandler(approveFlightController.handle.bind(approveFlightController)));
adminRoutes.get('/providers', authenticateAdmin, asyncHandler( getAllProvidersController.handle.bind( getAllProvidersController)));
adminRoutes.patch('/providers/:id/status', authenticateAdmin, asyncHandler( updateProviderStatusController.handle.bind( updateProviderStatusController)));



export default adminRoutes;
