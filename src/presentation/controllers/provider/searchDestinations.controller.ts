import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_ARICRAFT_USECASES } from "@di/types-usecases";
import { ISearchDestinationsUseCase } from "@di/file-imports-index";

@injectable()
export class SearchDestinationsController {
  constructor(
    @inject(TYPES_ARICRAFT_USECASES.SearchDestinationsUseCase)
    private _searchDestinationsUseCase: ISearchDestinationsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;

      if (!query || query.trim() === "") {
        const destinations = await this._searchDestinationsUseCase.execute("");
       sendResponse(res,
         "Destinations retrieved successfully",
          destinations,
           StatusCodes.OK
          );
        
        return;
      }

      const destinations = await this._searchDestinationsUseCase.execute(query);

      sendResponse(
        res,
        "Destinations retrieved successfully",
        destinations,
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
