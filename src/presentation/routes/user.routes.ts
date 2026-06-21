import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "../middlewares/auth.middleware";  

import {
    searchFlightsController,
    searchDestinationsController,
    getUserProfileController,
    updateUserProfileController,
    getFlightSeatsForUserController,
    addFlightToSegmentController,
    getBookingSegmentController,
    updateBookingSegmentController,
    getBookingSeatsMapController,
    seatLockController,
    bookingDetailsController,
    getBookingSummaryController,
    initiateBookingController,
    retryPaymentController,
    getBookingByIdController,
    getUserBookingsController,
    getTicketController,
    cancelPassengerController,
    getUserWalletController,

    
    getEligibleOffersController,
    getFoodsByAircraftController,


} from "@di/container-resolver";

const userRoutes = express.Router();

userRoutes.get('/flights/search',asyncHandler(searchFlightsController.handle.bind(searchFlightsController)));  
userRoutes.get('/destinations/search', asyncHandler(searchDestinationsController.handle.bind(searchDestinationsController)));
userRoutes.get('/profile',authenticate, asyncHandler(getUserProfileController.handle.bind(getUserProfileController)));
userRoutes.put('/profile', authenticate, asyncHandler(updateUserProfileController.handle.bind(updateUserProfileController)));
userRoutes.get('/flights/:flightId/seats', authenticate, asyncHandler(getFlightSeatsForUserController.handle.bind(getFlightSeatsForUserController)));
userRoutes.post('/bookings/:sessionId/seat-lock', authenticate, asyncHandler(seatLockController.handle.bind(seatLockController)));

userRoutes.post('/bookings/segment', authenticate, asyncHandler(addFlightToSegmentController.handle.bind(addFlightToSegmentController)));
userRoutes.get('/bookings/:sessionId/segment', authenticate, asyncHandler(getBookingSegmentController.handle.bind(getBookingSegmentController)));
userRoutes.put('/bookings/:sessionId/segment', authenticate, asyncHandler(updateBookingSegmentController.handle.bind(updateBookingSegmentController)));
userRoutes.get('/bookings/:sessionId/seats-map', authenticate, asyncHandler(getBookingSeatsMapController.handle.bind(getBookingSeatsMapController)));
userRoutes.post('/bookings/:sessionId/details', authenticate,asyncHandler(bookingDetailsController.handle.bind(bookingDetailsController)));
userRoutes.get('/bookings/:sessionId/summary', authenticate,asyncHandler(getBookingSummaryController.handle.bind(getBookingSummaryController)));
userRoutes.get('/bookings/:sessionId/offers', authenticate, asyncHandler(getEligibleOffersController.handle.bind(getEligibleOffersController)));
userRoutes.get('/aircrafts/:aircraftId/foods', authenticate, asyncHandler(getFoodsByAircraftController.handle.bind(getFoodsByAircraftController)));
userRoutes.post('/bookings/initiate', authenticate, asyncHandler(initiateBookingController.handle.bind(initiateBookingController)));
userRoutes.post('/bookings/:bookingId/retry', authenticate, asyncHandler(retryPaymentController.handle.bind(retryPaymentController)));

userRoutes.get('/bookings/:bookingId', authenticate, asyncHandler(getBookingByIdController.handle.bind(getBookingByIdController)));
userRoutes.get('/bookings', authenticate, asyncHandler(getUserBookingsController.handle.bind(getUserBookingsController)));
userRoutes.get('/bookings/:bookingId/ticket', authenticate, asyncHandler(getTicketController.handle.bind(getTicketController)));
userRoutes.delete('/bookings/:bookingId/passengers/:passengerId', authenticate, asyncHandler(cancelPassengerController.handle.bind(cancelPassengerController)));
userRoutes.get('/wallet', authenticate, asyncHandler(getUserWalletController.handle.bind(getUserWalletController)));    
export default userRoutes;
