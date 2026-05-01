import express from "express";
import { asyncHandler } from "@shared/utils/async-handler";
import { authenticate } from "../middlewares/auth.middleware";

import { completeProviderProfileController,
     getProviderProfileController,
    createAircraftController,
    getProviderAircraftsController,
    updateAircraftController,
    deleteAircraftController,
    searchDestinationsController,
    getAllSeatTypesController,
    createSeatLayoutController,
    generateSeatsController,
    getSeatLayoutsController,
    deletleSeatLayoutController,
    availableAircraftsForScheduleController,
    createFlightController,
      getProviderFlightsController,
      updateFlightController,
      getFlightByIdController,
      deleteFlightController,
      getFlightSeatsController,
      createRecurringFlightController
    

 } from "@di/container-resolver";


const providerRoutes = express.Router();

providerRoutes.get( '/profile',authenticate,asyncHandler(getProviderProfileController.handle.bind(getProviderProfileController)));
providerRoutes.post('/complete-profile',authenticate,asyncHandler(completeProviderProfileController.handle.bind(completeProviderProfileController)));

// Aircraft Routes
providerRoutes.post('/aircrafts',authenticate,asyncHandler( createAircraftController.handle.bind( createAircraftController)));
providerRoutes.get('/aircrafts',authenticate,asyncHandler( getProviderAircraftsController.handle.bind( getProviderAircraftsController)));
providerRoutes.get('/destinations/search', authenticate, asyncHandler(searchDestinationsController.handle.bind(searchDestinationsController)));


providerRoutes.get('/seat-types', authenticate, asyncHandler(getAllSeatTypesController.handle.bind(getAllSeatTypesController)));    
providerRoutes.post('/seat-layouts', authenticate, asyncHandler(createSeatLayoutController.handle.bind(createSeatLayoutController)));
providerRoutes.get('/aircraft/available', authenticate, asyncHandler(availableAircraftsForScheduleController.handle.bind(availableAircraftsForScheduleController)));

providerRoutes.get('/aircraft/:aircraftId/seat-layouts', authenticate, asyncHandler(getSeatLayoutsController.handle.bind(getSeatLayoutsController)));
providerRoutes.delete('/seat-layouts/:layoutId', authenticate, asyncHandler(deletleSeatLayoutController.handle.bind(deletleSeatLayoutController))); 

providerRoutes.post('/aircraft/:aircraftId/generate-seats', authenticate, asyncHandler(generateSeatsController.handle.bind(generateSeatsController)));

providerRoutes.put('/aircraft/:aircraftId', authenticate, asyncHandler(updateAircraftController.handle.bind(updateAircraftController)));
providerRoutes.delete('/aircraft/:aircraftId', authenticate, asyncHandler(deleteAircraftController.handle.bind(deleteAircraftController)));

providerRoutes.post('/flights', authenticate, asyncHandler(createFlightController.handle.bind(createFlightController)));

providerRoutes.get('/flights', authenticate,asyncHandler(getProviderFlightsController.handle.bind(getProviderFlightsController)));
providerRoutes.put('/update-flights/:flightId',authenticate,asyncHandler(updateFlightController.handle.bind(updateFlightController)));
providerRoutes.get('/flights/:flightId',authenticate,asyncHandler(getFlightByIdController.handle.bind(getFlightByIdController)))
providerRoutes.delete('/flights/:flightId',authenticate,asyncHandler(deleteFlightController.handle.bind(deleteFlightController)));
providerRoutes.get('/flights/:flightId/seats', authenticate, asyncHandler(getFlightSeatsController.handle.bind(getFlightSeatsController)));
providerRoutes.post('/flights/recurring', authenticate, asyncHandler(createRecurringFlightController.handle.bind(createRecurringFlightController)));

export default providerRoutes;

