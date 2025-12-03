import { Request,Response,NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";
import { AuthStatus,JWTStatus } from "@shared/constants/index.constants";
import { ForbiddenError, UnauthorizedError } from "./error.middleware";
import { tokenUseCase } from "@di/container-resolver";

export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    next(new UnauthorizedError(JWTStatus.AuthHeaderMissing));
    return;
  }
  const accessToken = authHeader.split(" ")[1];
  if (!accessToken) {
    next(new UnauthorizedError(JWTStatus.NoAccessToken));
    return;
  }
  try {
    const decoded = await tokenUseCase.authAccessToken(accessToken);
    (req as any).admin = decoded as JwtPayload;
    next();
  } catch (error: any) {
    console.log(`Error in admin authentication middleware: ${error}`);
    next(new UnauthorizedError(JWTStatus.NoAccessToken));
    return;
  }
};
