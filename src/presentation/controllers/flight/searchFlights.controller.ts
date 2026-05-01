import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/index.constants";
import { TYPES_FLIGHT_USECASES } from "@di/types-usecases";
import { ISearchFlightsUseCase } from "@di/file-imports-index";
import { SearchFlightsDTO } from "@application/dtos/flight-dtos";
import { FLIGHT_MESSAGES } from "@shared/constants/flightMessages/flight.messges";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class SearchFlightsController {
  constructor(
    @inject(TYPES_FLIGHT_USECASES.SearchFlightsUseCase)
    private _searchFlightsUseCase: ISearchFlightsUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    const { from, to, departureDate, passengers, tripType, returnDate } = req.query;
    const { page, limit } = parseQueryParams(req.query);

    const searchData: SearchFlightsDTO = {
      from: from as string,
      to: to as string,
      departureDate: departureDate as string,
      passengers: Number(passengers),
      tripType: (tripType as "one-way" | "round-trip") ?? "one-way",
      ...(returnDate && { returnDate: returnDate as string }),
      page,
      limit,
    };

    const results = await this._searchFlightsUseCase.execute(searchData);

    sendResponse(res, FLIGHT_MESSAGES.SEARCH_SUCCESS, results, StatusCodes.OK);
  }
}