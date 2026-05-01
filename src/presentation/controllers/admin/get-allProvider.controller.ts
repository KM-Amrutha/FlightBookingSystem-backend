import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/http.status.codes";

import { GetAllProvidersUseCase } from "@di/file-imports-index";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";

import {BaseQueryDTO} from "@application/dtos/query-dtos";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetAllProvidersController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.GetAllProvidersUseCase)
    private _getAllProvidersUseCase: GetAllProvidersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const parsed = parseQueryParams(req.query);
      const queryDto: BaseQueryDTO = {
        page: parsed.page,
        limit: parsed.limit,
        search: parsed.search,
        filters: parsed.filters,
      }
      const {providersList,paginationData} = await this._getAllProvidersUseCase.execute(queryDto);

      sendResponse(
        res,
        "All providers fetched successfully",
        { success:true,
          data:providersList,
          pagination: paginationData 
        },
        StatusCodes.OK,
      );
    } catch (error: any) {
      sendResponse(
        res,
        "Failed to fetch users",
        { success: false, message: error.message  },
         error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}