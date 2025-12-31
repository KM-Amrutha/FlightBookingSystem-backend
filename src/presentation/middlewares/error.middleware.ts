import { Request,Response, NextFunction } from "express";
import {
    StatusCodes,
    APPLICATION_MESSAGES
} from "@shared/constants/index.constants"
import { sendResponse } from "@shared/utils/http.response";
import { loggerUseCase } from "@di/container-resolver";

class AppError extends Error {
     statusCode: number;
     constructor(message: string, statusCode: number) {
super(message);
this.statusCode = statusCode;
     }
}

export class validationError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}



export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
  }
}
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT); 
  }
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  loggerUseCase.LogError(err, req.originalUrl, err.message);
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || APPLICATION_MESSAGES.INTERNAL_SERVER_ERROR;
  sendResponse(res, message, null,statusCode,);
};
