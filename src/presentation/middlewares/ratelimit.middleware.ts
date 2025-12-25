import rateLimit from "express-rate-limit";
import { Request, Response } from "express";
import {
  StatusCodes,
  APPLICATION_MESSAGES,
} from "@shared/constants/index.constants";
import { sendResponse } from "@shared/utils/http.response";

const handleRateLimitExceeded = (req: Request, res: Response) => {
  sendResponse(res, APPLICATION_MESSAGES.LIMIT_EXCEEDED, null, StatusCodes.RateLimit);
};

const createRateLimiter = (windowMs: number, maxRequests: number) =>
  rateLimit({
    windowMs,
    max: maxRequests,
    message: APPLICATION_MESSAGES.LIMIT_EXCEEDED,
    statusCode: StatusCodes.RateLimit,
    handler: handleRateLimitExceeded,
  });

const rateLimiter = createRateLimiter(1 * 60 * 1000, 150);

export default rateLimiter;
