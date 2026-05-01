import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "../middlewares/auth.middleware";  

import {
    searchFlightsController,
    searchDestinationsController,
    getUserProfileController,
    updateUserProfileController,
    getFlightSeatsForUserController
    

} from "@di/container-resolver";

const userRoutes = express.Router();

userRoutes.get('/flights/search',asyncHandler(searchFlightsController.handle.bind(searchFlightsController)));  
userRoutes.get('/destinations/search', asyncHandler(searchDestinationsController.handle.bind(searchDestinationsController)));
userRoutes.get('/profile',authenticate, asyncHandler(getUserProfileController.handle.bind(getUserProfileController)));
userRoutes.put('/profile', authenticate, asyncHandler(updateUserProfileController.handle.bind(updateUserProfileController)));
userRoutes.get('/flights/:flightId/seats', authenticate, asyncHandler(getFlightSeatsForUserController.handle.bind(getFlightSeatsForUserController)));
export default userRoutes;