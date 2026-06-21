import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_BOOKING_USECASES } from "@di/types-usecases";
import {BOOKING_MESSAGES} from "@shared/constants/bookingMessages/booking.messages";
import { IGetProviderBookingByIdUseCase } from "@di/file-imports-index";

@injectable()
export class GetProviderBookingByIdController {
  constructor(
    @inject(TYPES_BOOKING_USECASES.GetProviderBookingByIdUseCase)
    private readonly _getProviderBookingByIdUseCase: IGetProviderBookingByIdUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const providerId = req.user!.id;
    const { bookingId } = req.params;
    
    if(!bookingId){
        throw new Error(BOOKING_MESSAGES.BOOKING_ID_REQUIRED);
    }

    const result = await this._getProviderBookingByIdUseCase.execute(
      providerId,
      bookingId
    );

    sendResponse(res,
         BOOKING_MESSAGES.BOOKING_RETRIEVED_SUCCESSFULLY,
          result, 
          StatusCodes.OK);
  }
}