import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "../middlewares/auth.middleware";

import { completeProviderProfileController } from "@di/container-resolver";
import { getProviderProfileController } from "@di/container-resolver";

const providerRoutes = express.Router();

providerRoutes.get( '/profile',authenticate,asyncHandler(getProviderProfileController.handle.bind(getProviderProfileController)));
providerRoutes.post('/complete-profile',authenticate,asyncHandler(completeProviderProfileController.handle.bind(completeProviderProfileController)));

export default providerRoutes;