import { Request,Response,NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";
import { JWT_MESSAGES } from "@shared/constants/index.constants";
import {  UnauthorizedError } from "./error.middleware";
import { tokenUseCase } from "@di/container-resolver";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(new UnauthorizedError(JWT_MESSAGES.AUTH_HEADER_MISSING));
    return;
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    next(new UnauthorizedError(JWT_MESSAGES.NO_ACCESS_TOKEN));
    return;
  }
  try {
    const decoded = await tokenUseCase.authAccessToken(accessToken);
    req.user = decoded as JwtPayload & { _id: string; role: string; email: string };
    next();
  } catch (error: any) {
    console.log(`Error in admin authentication middleware: ${error}`);
    next(new UnauthorizedError(JWT_MESSAGES.NO_ACCESS_TOKEN));
    return;
  }
};
