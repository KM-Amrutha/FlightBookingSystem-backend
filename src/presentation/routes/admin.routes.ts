import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticateAdmin } from "@presentation/middlewares/admin.middleware";
import { providerVerificationController,
        pendingFlightsForApprovalController,
        approveFlightController,
        getAllProvidersController,
        updateProviderStatusController,
        getAllUsersController,
        updateUserStatusController,
        getAllFlightsForAdminController,
        rejectSingleFlightController,
        getAdminBookingsController,
        getAdminDashboardController,
        getAdminWalletController,
        setProviderCommissionController

 } from "@di/container-resolver";

const adminRoutes = express.Router();

adminRoutes.get("/providers/pending",authenticateAdmin,asyncHandler(providerVerificationController.getPendingProviders.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/verify",authenticateAdmin,asyncHandler(providerVerificationController.verifyProvider.bind(providerVerificationController)));
adminRoutes.patch("/providers/:providerId/reject",authenticateAdmin,asyncHandler(providerVerificationController.rejectProvider.bind(providerVerificationController)));



adminRoutes.get('/flights/pending-approval', authenticateAdmin, asyncHandler(pendingFlightsForApprovalController.handle.bind(pendingFlightsForApprovalController)));
adminRoutes.patch('/flights/:flightId/approval', authenticateAdmin, asyncHandler(approveFlightController.handle.bind(approveFlightController)));

adminRoutes.get('/providers', authenticateAdmin, asyncHandler( getAllProvidersController.handle.bind( getAllProvidersController)));
adminRoutes.patch('/providers/:id/status', authenticateAdmin, asyncHandler( updateProviderStatusController.handle.bind( updateProviderStatusController)));
adminRoutes.get('/users', authenticateAdmin, asyncHandler(getAllUsersController.handle.bind(getAllUsersController)));
adminRoutes.patch('/users/:id/status', authenticateAdmin, asyncHandler( updateUserStatusController.handle.bind( updateUserStatusController)));

adminRoutes.get('/flights', authenticateAdmin, asyncHandler(getAllFlightsForAdminController.handle.bind(getAllFlightsForAdminController)));
adminRoutes.patch('/flights/:flightId/reject', authenticateAdmin, asyncHandler(rejectSingleFlightController.handle.bind(rejectSingleFlightController)));

adminRoutes.get('/bookings', authenticateAdmin, asyncHandler(getAdminBookingsController.handle.bind(getAdminBookingsController)));
adminRoutes.get('/dashboard', authenticateAdmin, asyncHandler(getAdminDashboardController.handle.bind(getAdminDashboardController)));
adminRoutes.get('/wallet', authenticateAdmin, asyncHandler(getAdminWalletController.handle.bind(getAdminWalletController)));
adminRoutes.patch('/providers/:providerId/commission', authenticateAdmin, asyncHandler(setProviderCommissionController.handle.bind(setProviderCommissionController)));

export default adminRoutes;
