import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_AIRCRAFT_USECASES } from "@di/types-usecases";
import { IApproveFlightUseCase } from "@di/file-imports-index";
import { ApproveFlightDTO } from "@application/dtos/flight-dtos";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";

@injectable()
export class ApproveFlightController {
  constructor(
    @inject(TYPES_AIRCRAFT_USECASES.ApproveFlightUseCase)
    private _approveFlightUseCase: IApproveFlightUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    console.log("=== FLIGHT APPROVAL REQUEST RECEIVED ===");
  console.log("req.params:", req.params);           // Should show { flightId: '694c...' }
  console.log("req.body:", req.body);               // Should show { status: 'approved' } or with reason
  console.log("Authenticated user:", (req as any).admin); // From authenticateAdmin
  console.log("==========================================");
    try {
      const flightIdParam = req.params.flightId;

      if (!flightIdParam) {
        sendResponse(res, FLIGHT_MESSAGES.ID_REQUIRED, null, StatusCodes.BadRequest);
        return;
      }

      const rawStatus = req.body.status as string | undefined;

      if (rawStatus !== "approved" && rawStatus !== "rejected") {
        sendResponse(res, "Invalid status", null, StatusCodes.BadRequest);
        return;
      }

      let approvalData: ApproveFlightDTO;

      if (rawStatus === "approved") {
        approvalData = { status: "approved" };
      } else {
        const reason = req.body.reason as string | undefined;
        if (!reason) {
          sendResponse(
            res,
            FLIGHT_MESSAGES.APPROVAL_REASON_REQUIRED,
            null,
            StatusCodes.BadRequest
          );
          return;
        }
        approvalData = { status: "rejected", reason };
      }

      const flight = await this._approveFlightUseCase.execute(
        flightIdParam,
        approvalData
      );

      sendResponse(
        res,
        `Flight ${approvalData.status} successfully`,
        flight,
        StatusCodes.OK
      );
    } catch (error: any) {
      sendResponse(
        res,
        error.message,
        null,
        StatusCodes.BadRequest
      );
    }
  }
}
