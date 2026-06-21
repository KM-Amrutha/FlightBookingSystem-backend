import {container} from "@di/container";


import {
  SignUpUserController,
  SignUpProviderController,
  OtpController,
  SignInController,
  SignOutController,
  RefreshAccessTokenController,
   ForgotPasswordController,
   PasswordResetLinkController,
   ProviderVerificationController,
   GoogleAuthController,
   UpdateProviderStatusController,
    GetAllProvidersController,
    GetAllUsersController,
    UpdateUserStatusController,
    ChangePasswordController,

    GetUserProfileController,
    UpdateUserProfileController,
    GetAdminDashboardController,
    SetProviderCommissionController,

    CompleteProviderProfileController,
    GetProviderProfileController,
     GetAllSeatTypesController,
    CreateAircraftController,
    GetProviderAircraftsController,
    UpdateAircraftController, 
    DeleteAircraftController,
    SearchDestinationsController,
    CreateSeatLayoutController, 
    GenerateSeatsController,
    GetSeatLayoutsController,
    DeleteSeatLayoutController,

    ApproveFlightController,
    CreateFlightController,
    GetProviderFlightsController,
    PendingFlightsForApprovalController,
    AvailableAircraftsForScheduleController,
    UpdateFlightController,
    GetFlightByIdController,
    DeleteFlightController,
    GetFlightSeatsController,
    GetFlightSeatsForUserController,
    CreateRecurringFlightController,
    GetAllFlightsForAdminController,
    RejectSingleFlightController,
   AddFlightToSegmentController,
   GetBookingSegmentController,
   UpdateBookingSegmentController,
   GetBookingSeatsMapController,
   SeatLockController,
   BookingDetailsController,
   GetBookingSummaryController,
   GetAdminWalletController,

   InitiateBookingController,
   RetryPaymentController,
   HandleWebhookController,
    GetBookingByIdController,
    GetUserBookingsController,
    GetProviderBookingsController,
    GetAdminBookingsController,
    GetTicketController,
    CancelPassengerController,
    GetUserWalletController,
    GetProviderWalletController,
    GetProviderBookingByIdController,

   CreateOfferController,
   GetEligibleOffersController,
   OfferStatusChangeController,
   DeleteOfferController,
   UpdateOfferController,
   GetProviderOffersController,

    CreateFoodController,
    UpdateFoodController,
     DeleteFoodController,
     GetFoodsByProviderController,
     GetFoodsByAircraftController,
     FoodStatusChangeController,



//   DeleteSeatLayoutUseCase,
 
   ICheckUserBlockStatusUseCase,
   ICreateProviderUseCase,
   ICreateUserUseCase,
   IForgotPasswordUseCase,
   IOtpUseCase,
   ISendPasswordRestLinkUseCase,
   ISignInUseCase,
   ITokenUseCase,
   ILoggerUseCase,
   IGetPendingProvidersUseCase,
   IUpdateUserStatusUseCase,
   IRejectProviderUseCase,
   IVerifyProviderUseCase,
   IGetProviderProfileUseCase,
   ICompleteProviderProfileUseCase,
   IGetAllProvidersUseCase,
   IUpdateProviderStatusUseCase,
   IGetAdminDashboardUseCase,
   IChangePasswordUseCase,
   IGetAllUsersUseCase,
    ICreateAircraftUseCase,
    IUpdateAircraftUseCase,
    IGetProviderAircraftsUseCase,
    IDeleteAircraftUseCase,
    IUpdateAircraftStatusUseCase,
    ISearchDestinationsUseCase,
    IUpdateAircraftLocationUseCase,
    ICreateSeatLayoutUseCase,
    IGenerateSeatsUseCase,
    IGetAllSeatTypesUseCase,
    IDeleteSeatLayoutUseCase,
    ICreateFlightUseCase,
    IGetProviderFlightsUseCase,
    IPendingFlightsForApprovalUseCase,
    IApproveFlightUseCase,  
    IAvailableAircraftsForScheduleUsecase,
    IUpdateFlightUseCase,
    ISearchFlightsUseCase,
    SearchFlightsController,
    IUpdateUserProfileUseCase,
    IGetFlightByIdUseCase,
    IGetUserProfileUseCase,
    IDeleteFlightUseCase,
    IGetFlightSeatsUseCase,
    ICreateRecurringFlightUseCase,
    IGetAllFlightsForAdminUseCase,
    IRejectSingleFlightUseCase,
    IAddFlightToSegmentUseCase,
    IGetBookingSegmentUseCase,
    IUpdateBookingSegmentUseCase,
    IGetBookingSeatsMapUseCase,
    ISeatLockUseCase,
    IBookingDetailsUseCase,
    IGetBookingSummaryUseCase,
    IInitiateBookingUseCase,
   IRetryPaymentUseCase,   
   IHandleWebhookUseCase,
   IGetBookingByIdUseCase,
   IGetUserBookingsUseCase,
   IGetProviderBookingsUseCase,
   IGetAdminBookingsUseCase,
   IGetTicketUseCase,
   ICancelPassengerUseCase,
   IGetUserWalletUseCase,
   IGetProviderWalletUseCase,
   ISetProviderCommissionUseCase,
   IGetAdminWalletUseCase,
   IGetProviderBookingByIdUseCase,

    IGetEligibleOffersUseCase,
    ICreateOfferUseCase,
    IUpdateOfferUseCase,
    IDeleteOfferUseCase,
    IOfferStatusChangeUseCase,
    IGetProviderOffersUseCase,

    ICreateFoodUseCase,
    IGetFoodsByAircraftUseCase,
    IGetFoodsByProviderUseCase,
    IFoodStatusChangeUseCase,
    IUpdateFoodUseCase,
    IDeleteFoodUseCase,

} from "@di/file-imports-index"

import {TYPES_AUTH_CONTROLLERS,
   TYPES_ADMIN_CONTROLLERS,
    TYPES_PROVIDER_CONTROLLERS,
    TYPES_AIRCRAFT_CONTROLLERS,
     TYPES_FLIGHT_CONTROLLERS,
       TYPES_USER_CONTROLLERS,
       TYPES_BOOKING_CONTROLLERS,
       TYPES_OFFER_CONTROLLERS,
       TYPES_FOOD_CONTROLLERS,

   } 
    from "@di/types-controllers";

import {TYPES_AUTH_USECASES,
   TYPES_LOGGER_USECASES,
   TYPES_PROVIDER_USECASES,
   TYPES_ADMIN_USECASES, 
   TYPES_AIRCRAFT_USECASES,
   TYPES_FLIGHT_USECASES,
   TYPES_USER_USECASES,
   TYPES_BOOKING_USECASES,
   TYPES_OFFER_USECASES,
   TYPES_FOOD_USECASES,

} 
 from "@di/types-usecases";

   import {
      TYPES_AIRCRAFT_REPOSITORIES,
      TYPES_BOOKING_REPOSITORIES
      
    } from "@di/types-repositories";
   import {
      IBookingRepository,
      IFlightSeatRepository
    } from "@di/file-imports-index";
   

export const bookingRepository = container.get<IBookingRepository>(
  TYPES_BOOKING_REPOSITORIES.BookingRepository
);

export const flightSeatRepository = container.get<IFlightSeatRepository>(
  TYPES_AIRCRAFT_REPOSITORIES.FlightSeatRepository
);

export const signUpUserController = container.get<SignUpUserController>(TYPES_AUTH_CONTROLLERS.SignUpUserController);
export const signUpProviderController = container.get<SignUpProviderController>(TYPES_AUTH_CONTROLLERS.SignUpProviderController);
export const otpController = container.get<OtpController>(TYPES_AUTH_CONTROLLERS.OtpController);
export const signInController = container.get<SignInController>(TYPES_AUTH_CONTROLLERS.SignInController);
export const signOutController = container.get<SignOutController>(TYPES_AUTH_CONTROLLERS.SignOutController);
export const refreshAccessTokenController = container.get<RefreshAccessTokenController>(TYPES_AUTH_CONTROLLERS.RefreshAccessTokenController);
export const  forgotPasswordController = container.get<ForgotPasswordController>(TYPES_AUTH_CONTROLLERS.ForgotPasswordController);
export const passwordResetLinkController = container.get<PasswordResetLinkController>(TYPES_AUTH_CONTROLLERS.PasswordResetLinkController);
export const providerVerificationController = container.get<ProviderVerificationController>(TYPES_ADMIN_CONTROLLERS.ProviderVerificationController);
export const googleAuthController = container.get<GoogleAuthController>(TYPES_AUTH_CONTROLLERS.GoogleAuthController);
export const changePasswordController = container.get<ChangePasswordController>(TYPES_AUTH_CONTROLLERS.ChangePasswordController);

export const completeProviderProfileController = container.get<CompleteProviderProfileController>(TYPES_PROVIDER_CONTROLLERS.CompleteProviderProfileController);
export const getProviderProfileController = container.get<GetProviderProfileController>(TYPES_PROVIDER_CONTROLLERS.GetProviderProfileController);
export const getAllProvidersController = container.get<GetAllProvidersController>(TYPES_ADMIN_CONTROLLERS.GetAllProvidersController);
export const updateProviderStatusController = container.get<UpdateProviderStatusController>(TYPES_ADMIN_CONTROLLERS.UpdateProviderStatusController);
export const getAllUsersController = container.get<GetAllUsersController>(TYPES_ADMIN_CONTROLLERS.GetAllUsersController);
export const updateUserStatusController = container.get<UpdateUserStatusController>(TYPES_ADMIN_CONTROLLERS.UpdateUserStatusController);  

export const getUserProfileController = container.get<GetUserProfileController>(TYPES_USER_CONTROLLERS.GetUserProfileController);
export const updateUserProfileController = container.get<UpdateUserProfileController>(TYPES_USER_CONTROLLERS.UpdateUserProfileController);   
export const getAdminDashboardController = container.get<GetAdminDashboardController>(TYPES_ADMIN_CONTROLLERS.GetAdminDashboardController);
export const setProviderCommissionController = container.get<SetProviderCommissionController>(TYPES_ADMIN_CONTROLLERS.SetProviderCommissionController);
export const getAdminWalletController = container.get<GetAdminWalletController>(TYPES_ADMIN_CONTROLLERS.GetAdminWalletController);

export const createAircraftController = container.get<CreateAircraftController>(TYPES_AIRCRAFT_CONTROLLERS.CreateAircraftController);
export const getProviderAircraftsController = container.get<GetProviderAircraftsController>(TYPES_AIRCRAFT_CONTROLLERS.GetProviderAircraftsController);
export const updateAircraftController = container.get<UpdateAircraftController>(TYPES_AIRCRAFT_CONTROLLERS.UpdateAircraftController);
export const deleteAircraftController = container.get<DeleteAircraftController>(TYPES_AIRCRAFT_CONTROLLERS.DeleteAircraftController);
export const searchDestinationsController = container.get<SearchDestinationsController>(TYPES_AIRCRAFT_CONTROLLERS.SearchDestinationsController);
export const getAllSeatTypesController = container.get<GetAllSeatTypesController>(TYPES_AIRCRAFT_CONTROLLERS.GetAllSeatTypesController);
export const createSeatLayoutController = container.get<CreateSeatLayoutController>(TYPES_AIRCRAFT_CONTROLLERS.CreateSeatLayoutController);
export const generateSeatsController = container.get<GenerateSeatsController>(TYPES_AIRCRAFT_CONTROLLERS.GenerateSeatsController);
export const getSeatLayoutsController = container.get<GetSeatLayoutsController>(TYPES_AIRCRAFT_CONTROLLERS.GetSeatLayoutsController)
export const deletleSeatLayoutController = container.get<DeleteSeatLayoutController>(TYPES_AIRCRAFT_CONTROLLERS.DeleteSeatLayoutController)

export const createFlightController = container.get<CreateFlightController>(TYPES_FLIGHT_CONTROLLERS.CreateFlightController);
export const availableAircraftsForScheduleController = container.get<AvailableAircraftsForScheduleController>(TYPES_FLIGHT_CONTROLLERS.AvailableAircraftsForScheduleController);  

export const getProviderFlightsController = container.get<GetProviderFlightsController>(TYPES_FLIGHT_CONTROLLERS.GetProviderFlightsController);
export const pendingFlightsForApprovalController = container.get<PendingFlightsForApprovalController>(TYPES_FLIGHT_CONTROLLERS.PendingFlightsForApprovalController);
export const approveFlightController = container.get<ApproveFlightController>(TYPES_FLIGHT_CONTROLLERS.ApproveFlightController);  
export const updateFlightController = container.get<UpdateFlightController>(TYPES_FLIGHT_CONTROLLERS.UpdateFlightController);
export const getFlightByIdController = container.get<GetFlightByIdController>(TYPES_FLIGHT_CONTROLLERS.GetFlightByIdController);
export const searchFlightsController = container.get<SearchFlightsController>(TYPES_FLIGHT_CONTROLLERS.SearchFlightsController);
export const deleteFlightController = container.get<DeleteFlightController>(TYPES_FLIGHT_CONTROLLERS.DeleteFlightController);
export const getFlightSeatsController = container.get<GetFlightSeatsController>(TYPES_FLIGHT_CONTROLLERS.GetFlightSeatsController);
export const getFlightSeatsForUserController = container.get<GetFlightSeatsForUserController>(TYPES_FLIGHT_CONTROLLERS.GetFlightSeatsForUserController); 
export const createRecurringFlightController = container.get<CreateRecurringFlightController>(TYPES_FLIGHT_CONTROLLERS.CreateRecurringFlightController);
export const getAllFlightsForAdminController = container.get<GetAllFlightsForAdminController>(TYPES_FLIGHT_CONTROLLERS.GetAllFlightsForAdminController);
export const rejectSingleFlightController = container.get<RejectSingleFlightController>(TYPES_FLIGHT_CONTROLLERS.RejectSingleFlightController); 
export const addFlightToSegmentController = container.get<AddFlightToSegmentController>(TYPES_BOOKING_CONTROLLERS.AddFlightToSegmentController);
export const getBookingSegmentController = container.get<GetBookingSegmentController>(TYPES_BOOKING_CONTROLLERS.GetBookingSegmentController);
export const updateBookingSegmentController = container.get<UpdateBookingSegmentController>(TYPES_BOOKING_CONTROLLERS.UpdateBookingSegmentController);
export const getBookingSeatsMapController = container.get<GetBookingSeatsMapController>(TYPES_BOOKING_CONTROLLERS.GetBookingSeatsMapController);
export const seatLockController = container.get<SeatLockController>(TYPES_BOOKING_CONTROLLERS.SeatLockController);
export const bookingDetailsController = container.get<BookingDetailsController>(TYPES_BOOKING_CONTROLLERS.BookingDetailsController);
export const getBookingSummaryController = container.get<GetBookingSummaryController>(TYPES_BOOKING_CONTROLLERS.GetBookingSummaryController);


export const initiateBookingController = container.get<InitiateBookingController>(TYPES_BOOKING_CONTROLLERS.InitiateBookingController);   
export const retryPaymentController = container.get<RetryPaymentController>(TYPES_BOOKING_CONTROLLERS.RetryPaymentController);
export const handleWebhookController = container.get<HandleWebhookController>(TYPES_BOOKING_CONTROLLERS.HandleWebhookController);
export const getBookingByIdController = container.get<GetBookingByIdController>(TYPES_BOOKING_CONTROLLERS.GetBookingByIdController);
export const getUserBookingsController = container.get<GetUserBookingsController>(TYPES_BOOKING_CONTROLLERS.GetUserBookingsController);
export const getProviderBookingsController = container.get<GetProviderBookingsController>(TYPES_BOOKING_CONTROLLERS.GetProviderBookingsController); 
export const getAdminBookingsController = container.get<GetAdminBookingsController>(TYPES_BOOKING_CONTROLLERS.GetAdminBookingsController);
export const getTicketController = container.get<GetTicketController>(TYPES_BOOKING_CONTROLLERS.GetTicketController);
export const cancelPassengerController = container.get<CancelPassengerController>(TYPES_BOOKING_CONTROLLERS.CancelPassengerController); 
export const getUserWalletController = container.get<GetUserWalletController>(TYPES_BOOKING_CONTROLLERS.GetUserWalletController); 
export const getProviderWalletController = container.get<GetProviderWalletController>(TYPES_BOOKING_CONTROLLERS.GetProviderWalletController); 
export const getProviderBookingByIdController = container.get<GetProviderBookingByIdController>(TYPES_BOOKING_CONTROLLERS.GetProviderBookingByIdController);

export const createOfferController = container.get<CreateOfferController>(TYPES_OFFER_CONTROLLERS.CreateOfferController);
export const getProviderOffersController = container.get<GetProviderOffersController>(TYPES_OFFER_CONTROLLERS.GetProviderOffersController)
export const updateOfferController = container.get<UpdateOfferController>(TYPES_OFFER_CONTROLLERS.UpdateOfferController);
export const deleteOfferController = container.get<DeleteOfferController>(TYPES_OFFER_CONTROLLERS.DeleteOfferController)
export const offerStatusChangeController = container.get<OfferStatusChangeController>(TYPES_OFFER_CONTROLLERS.OfferStatusChangeController)
export const getEligibleOffersController = container.get<GetEligibleOffersController>(TYPES_OFFER_CONTROLLERS.GetEligibleOffersController);

export const createFoodController = container.get<CreateFoodController>(TYPES_FOOD_CONTROLLERS.CreateFoodController);
export const updateFoodController = container.get<UpdateFoodController>(TYPES_FOOD_CONTROLLERS.UpdateFoodController);
export const deleteFoodController = container.get<DeleteFoodController>(TYPES_FOOD_CONTROLLERS.DeleteFoodController);
export const getFoodsByProviderController = container.get<GetFoodsByProviderController>(TYPES_FOOD_CONTROLLERS.GetFoodsByProviderController);
export const getFoodsByAircraftController = container.get<GetFoodsByAircraftController>(TYPES_FOOD_CONTROLLERS.GetFoodsByAircraftController);
export const foodStatusChangeController = container.get<FoodStatusChangeController>(TYPES_FOOD_CONTROLLERS.FoodStatusChangeController)

export const createUseUseCase = container.get<ICreateUserUseCase>(TYPES_AUTH_USECASES.CreateUserUseCase);
export const createProviderUseCase = container.get<ICreateProviderUseCase>(TYPES_AUTH_USECASES.CreateProviderUseCase);
export const tokenUseCase = container.get<ITokenUseCase>(TYPES_AUTH_USECASES.TokenUseCase);
export const checkUserBlockStatusUseCase = container.get<ICheckUserBlockStatusUseCase>(TYPES_AUTH_USECASES.CheckUserBlockStatusUseCase);
export const otpUseCase = container.get<IOtpUseCase>(TYPES_AUTH_USECASES.OtpUseCase);
export const signInUseCase = container.get<ISignInUseCase>(TYPES_AUTH_USECASES.SignInUseCase);
export const forgotPasswordUseCase = container.get<IForgotPasswordUseCase>(TYPES_AUTH_USECASES.ForgotPasswordUseCase);
export const sendPasswordResetLinkUseCase = container.get<ISendPasswordRestLinkUseCase>(TYPES_AUTH_USECASES.SendPasswordRestLinkUseCase);
export const changePasswordUseCase = container.get<IChangePasswordUseCase>(TYPES_AUTH_USECASES.ChangePasswordUseCase)
export const loggerUseCase = container.get<ILoggerUseCase>(TYPES_LOGGER_USECASES.LoggerUseCase);
export const getPendingProvidersUseCase = container.get<IGetPendingProvidersUseCase>(TYPES_PROVIDER_USECASES.GetPendingProvidersUseCase)
export const rejectProviderUseCase = container.get<IRejectProviderUseCase>(TYPES_PROVIDER_USECASES.RejectProviderUseCase);
export const verifyProviderUseCase = container.get<IVerifyProviderUseCase>(TYPES_PROVIDER_USECASES.VerifyProviderUseCase);
export const completeProviderProfileUseCase = container.get<ICompleteProviderProfileUseCase>(TYPES_PROVIDER_USECASES.CompleteProviderProfileUseCase);
export const getProviderProfileUseCase = container.get<IGetProviderProfileUseCase>(TYPES_PROVIDER_USECASES.GetProviderProfileUseCase);

export const getAllProvidersUseCase = container.get<IGetAllProvidersUseCase>(TYPES_ADMIN_USECASES.GetAllProvidersUseCase);
export const updateProviderStatusUseCase = container.get<IUpdateProviderStatusUseCase>(TYPES_ADMIN_USECASES.UpdateProviderStatusUseCase)
export const getAllUsersUseCase = container.get<IGetAllUsersUseCase>(TYPES_ADMIN_USECASES.GetAllUsersUseCase);
export const updateUserStatusUseCase = container.get<IUpdateUserStatusUseCase>(TYPES_ADMIN_USECASES.UpdateUserStatusUseCase);
export const getAdminDashboardUseCase = container.get<IGetAdminDashboardUseCase>(TYPES_ADMIN_USECASES.GetAdminDashboardUseCase);
export const setProviderCommissionUseCase  = container.get<ISetProviderCommissionUseCase>(TYPES_ADMIN_USECASES.SetProviderCommissionUseCase);
export const getAdminWalletUseCasse = container.get<IGetAdminWalletUseCase>(TYPES_ADMIN_USECASES.GetAdminWalletUseCase);

export const GetUserProfileUseCase = container.get<IGetUserProfileUseCase>(TYPES_USER_USECASES.GetUserProfileUseCase);
export const UpdateUserProfileUseCase = container.get<IUpdateUserProfileUseCase>(TYPES_USER_USECASES.UpdateUserProfileUseCase);


export const createAircraftUseCase = container.get<ICreateAircraftUseCase>(TYPES_AIRCRAFT_USECASES.CreateAircraftUseCase);
export const updateAircraftUseCase = container.get<IUpdateAircraftUseCase>(TYPES_AIRCRAFT_USECASES.UpdateAircraftUseCase);
export const getProviderAircraftsUseCase = container.get<IGetProviderAircraftsUseCase>(TYPES_AIRCRAFT_USECASES.GetAircraftsUseCase);
export const deleteAircraftUseCase = container.get<IDeleteAircraftUseCase>(TYPES_AIRCRAFT_USECASES.DeleteAircraftUseCase);
export const updateAircraftStatusUseCase = container.get<IUpdateAircraftStatusUseCase>(TYPES_AIRCRAFT_USECASES.UpdateAircraftStatusUseCase);
export const searchDestinationsUseCase = container.get<ISearchDestinationsUseCase>(TYPES_AIRCRAFT_USECASES.SearchDestinationsUseCase);
export const updateAircraftLocationUseCase = container.get<IUpdateAircraftLocationUseCase>(TYPES_AIRCRAFT_USECASES.UpdateAircraftLocationUseCase);
export const createSeatLayoutUseCase = container.get<ICreateSeatLayoutUseCase>(TYPES_AIRCRAFT_USECASES.CreateSeatLayoutUseCase);
export const generateSeatsUseCase = container.get<IGenerateSeatsUseCase>(TYPES_AIRCRAFT_USECASES.GenerateSeatsUseCase);
export const getAllSeatTypesUseCase = container.get<IGetAllSeatTypesUseCase>(TYPES_AIRCRAFT_USECASES.GetAllSeatTypesUseCase);
export const deleteSeatLayoutUseCase = container.get<IDeleteSeatLayoutUseCase>(TYPES_AIRCRAFT_USECASES.DeleteSeatLayoutUseCase);

export const createFlightUseCase = container.get<ICreateFlightUseCase>(TYPES_FLIGHT_USECASES.CreateFlightUseCase);
export const getProviderFlightsUseCase = container.get<IGetProviderFlightsUseCase>(TYPES_FLIGHT_USECASES.GetProviderFlightsUseCase);  
export const pendingFlightsForApprovalUseCase = container.get<IPendingFlightsForApprovalUseCase>(TYPES_FLIGHT_USECASES.PendingFlightsForApprovalUseCase);
export const approveFlightUseCase = container.get<IApproveFlightUseCase>(TYPES_FLIGHT_USECASES.ApproveFlightUseCase);   
export const availableAircraftsForScheduleUseCase = container.get<IAvailableAircraftsForScheduleUsecase>(TYPES_FLIGHT_USECASES.AvailableAircraftsForScheduleUseCase); 
export const updateFlightUsecase = container.get<IUpdateFlightUseCase>(TYPES_FLIGHT_USECASES.UpdateFlightUseCase);
export const getFlightByIdUseCase = container.get<IGetFlightByIdUseCase>(TYPES_FLIGHT_USECASES.GetFlightByIdUseCase);
export const searchFlightsUseCase = container.get<ISearchFlightsUseCase>(TYPES_FLIGHT_USECASES.SearchFlightsUseCase);
export const deleteFlightUseCase = container.get<IDeleteFlightUseCase>(TYPES_FLIGHT_USECASES.DeleteFlightUseCase);
export const getFlightSeatsUseCase = container.get<IGetFlightSeatsUseCase>(TYPES_FLIGHT_USECASES.GetFlightSeatsUseCase);
export const getFlightSeatsForUserUseCase = container.get<IGetFlightSeatsUseCase>(TYPES_FLIGHT_USECASES.GetFlightSeatsUseCase);
export const createRecurringFlightUseCase = container.get<ICreateRecurringFlightUseCase>(TYPES_FLIGHT_USECASES.CreateRecurringFlightUseCase);
export const getAllFlightsForAdminUseCase = container.get<IGetAllFlightsForAdminUseCase>(TYPES_FLIGHT_USECASES.GetAllFlightsForAdminUseCase);
export const rejectSingleFlightUseCase = container.get<IRejectSingleFlightUseCase>(TYPES_FLIGHT_USECASES.RejectSingleFlightUseCase);
export const addFlightToSegmentUseCase = container.get<IAddFlightToSegmentUseCase>(TYPES_BOOKING_USECASES.AddFlightToSegmentUseCase);
export const getBookingSegmentUseCase = container.get<IGetBookingSegmentUseCase>(TYPES_BOOKING_USECASES.GetBookingSegmentUseCase);
export const updateBookingSegmentUseCase = container.get<IUpdateBookingSegmentUseCase>(TYPES_BOOKING_USECASES.UpdateBookingSegmentUseCase);
export const getBookingSeatsMapUseCase = container.get<IGetBookingSeatsMapUseCase>(TYPES_BOOKING_USECASES.GetBookingSeatsMapUseCase);
export const seatLockUseCase = container.get<ISeatLockUseCase>(TYPES_BOOKING_USECASES.SeatLockUseCase);
export const bookingDetailsUseCase = container.get<IBookingDetailsUseCase>(TYPES_BOOKING_USECASES.BookingDetailsUseCase);
export const getBookingSummaryUseCase= container.get<IGetBookingSummaryUseCase>(TYPES_BOOKING_USECASES.GetBookingSummaryUseCase);

export const initiateBookingUseCase = container.get<IInitiateBookingUseCase>(TYPES_BOOKING_USECASES.InitiateBookingUseCase);
export const retryPaymentUseCase = container.get<IRetryPaymentUseCase>(TYPES_BOOKING_USECASES.RetryPaymentUseCase);
export const handleWebhookUseCase = container.get<IHandleWebhookUseCase>(TYPES_BOOKING_USECASES.HandleWebhookUseCase); 
export const getBookingByIdUseCase = container.get<IGetBookingByIdUseCase>(TYPES_BOOKING_USECASES.GetBookingByIdUseCase);
export const getUserBookingsUseCase = container.get<IGetUserBookingsUseCase>(TYPES_BOOKING_USECASES.GetUserBookingsUseCase);
export const getProviderBookingsUseCase = container.get<IGetProviderBookingsUseCase>(TYPES_BOOKING_USECASES.GetProviderBookingsUseCase);
export const getAdminBookingsUseCase = container.get<IGetAdminBookingsUseCase>(TYPES_BOOKING_USECASES.GetAdminBookingsUseCase); 
export const getTicketUseCase = container.get<IGetTicketUseCase>(TYPES_BOOKING_USECASES.GetTicketUseCase);
export const cancelPassengerUseCase = container.get<ICancelPassengerUseCase>(TYPES_BOOKING_USECASES.CancelPassengerUseCase);
export const getUserWalletUseCase = container.get<IGetUserWalletUseCase>(TYPES_BOOKING_USECASES.GetUserWalletUseCase);
export const getProviderWalletUseCase = container.get<IGetProviderWalletUseCase>(TYPES_BOOKING_USECASES.GetProviderWalletUseCase);
export const getProviderBookingByIdUseCase = container.get<IGetProviderBookingByIdUseCase>(TYPES_BOOKING_USECASES.GetProviderBookingByIdUseCase);

export const createOfferUseCase =container.get<ICreateOfferUseCase>(TYPES_OFFER_USECASES.CreateOfferUseCase);
export const getEligibleOffersUseCase = container.get<IGetEligibleOffersUseCase>(TYPES_OFFER_USECASES.GetEligibleOffersUseCase);
export const offerStatusChangeUseCase = container.get<IOfferStatusChangeUseCase>(TYPES_OFFER_USECASES.OfferStatusChangeUseCase);
export const updateOfferUseCase = container.get<IUpdateOfferUseCase>(TYPES_OFFER_USECASES.UpdateOfferUseCase);
export const getProviderOffersUseCase = container.get<IGetProviderOffersUseCase>(TYPES_OFFER_USECASES.GetProviderOffersUseCase);
export const deleteOfferUseCase = container.get<IDeleteOfferUseCase>(TYPES_OFFER_USECASES.DeleteOfferUseCase);


export const createFoodUseCase = container.get<ICreateFoodUseCase>(TYPES_FOOD_USECASES.CreateFoodUseCase);
export const updateFoodUseCase =container.get<IUpdateFoodUseCase>(TYPES_FOOD_USECASES.UpdateFoodUseCase);
export const getFoodsByAircraftUseCase = container.get<IGetFoodsByAircraftUseCase>(TYPES_FOOD_USECASES.GetFoodsByAircraftUseCase);
export const getFoodsByProviderUseCase = container.get<IGetFoodsByProviderUseCase>(TYPES_FOOD_USECASES.GetFoodsByProviderUseCase);
export const foodStatusChangeUseCase = container.get<IFoodStatusChangeUseCase>(TYPES_FOOD_USECASES.FoodStatusChangeUseCase);
export const deleteFoodUseCase = container.get<IDeleteFoodUseCase>(TYPES_FOOD_USECASES.DeleteFoodUseCase);

