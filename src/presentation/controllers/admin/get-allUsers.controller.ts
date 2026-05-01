import { Request, Response } from "express";
import { injectable, inject } from "inversify";

import { sendResponse } from "@shared/utils/http.response";
import { StatusCodes } from "@shared/constants/http.status.codes";

import { GetAllUsersUseCase } from "@di/file-imports-index";
import { TYPES_ADMIN_USECASES } from "@di/types-usecases";

import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { parseQueryParams } from "@shared/utils/parse-queryParams";

@injectable()
export class GetAllUsersController {
  constructor(
    @inject(TYPES_ADMIN_USECASES.GetAllUsersUseCase)
    private _getAllUsersUseCase: GetAllUsersUseCase
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const parsed = parseQueryParams(req.query);
      // ── Only these two are required for pagination ──
      const queryDto: GetUsersQueryDTO = {
        page: parsed.page,
        limit: parsed.limit,
        search: parsed.search,
        filters: parsed.filters,
        // You can ignore / not pass: fromDate, toDate, specialization, etc.
      };

      const { usersList, paginationData } = await this._getAllUsersUseCase.execute(queryDto);

      sendResponse(
        res,
       "Users fetched successfully",
        {
          success: true,
          data: usersList,
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