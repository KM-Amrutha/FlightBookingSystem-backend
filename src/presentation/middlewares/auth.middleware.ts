import { Request,Response,NextFunction } from "express";
import {JwtPayload} from "jsonwebtoken";
import { AuthStatus,JWTStatus } from "@shared/constants/index.constants";
import { ForbiddenError, UnauthorizedError } from "./error.middleware";
import { checkUserBlockStatusUseCase,tokenUseCase } from "@di/container-resolver";


export const authenticate = async (
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
    (req as any).user = decoded as JwtPayload;
    const { _id } = (req as any).user;
    

    const isActive = await checkUserBlockStatusUseCase.execute(_id);
    
    if (!isActive){
      next(new ForbiddenError(AuthStatus.AccountBlocked));
      return;
    }
    next();
  } catch (error: any) {
    console.log(`Error in authentication middleware${error} `);
    next(new UnauthorizedError(JWTStatus.NoAccessToken));
    return;
  }
};
