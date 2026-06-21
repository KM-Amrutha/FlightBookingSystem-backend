import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import { IBookingDetailsUseCase } from "@di/file-imports-index";
import { SaveBookingDetailsDTO } from "@application/dtos/booking-dtos";
import { BOOKING_MESSAGES } from "@shared/constants/bookingMessages/booking.messages";


@injectable()
export class BookingDetailsController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.BookingDetailsUseCase)
    private _saveBookingDetailsUseCase: IBookingDetailsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { passengers, flightFoods } = req.body;

    if(!sessionId){
        throw new Error(BOOKING_MESSAGES.SESSION_ID_REQUIRED);
    }

    const data: SaveBookingDetailsDTO = {
      passengers,
      flightFoods: flightFoods ?? [],
    };

    const result = await this._saveBookingDetailsUseCase.execute(
      userId,
      sessionId,
      data
    );

    sendResponse(
      res,
      BOOKING_MESSAGES.DETAILS_SAVED,
      result,
      StatusCodes.OK
    );
  }
}