import { Request,Response,NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";
import { AUTH_MESSAGES,JWT_MESSAGES } from "@shared/constants/index.constants";
import { ForbiddenError, UnauthorizedError } from "./error.middleware";
import { checkUserBlockStatusUseCase,tokenUseCase } from "@di/container-resolver";


export const authenticate = async (
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
    (req as any).user = decoded as JwtPayload;
    const { _id } = (req as any).user;
    

    const isActive = await checkUserBlockStatusUseCase.execute(_id);
    
    if (!isActive){
      next(new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BLOCKED));
      return;
    }
    next();
  } catch (error: any) {
    console.log(`Error in authentication middleware${error} `);
    next(new UnauthorizedError(JWT_MESSAGES.NO_ACCESS_TOKEN));
    return;
  }
};
