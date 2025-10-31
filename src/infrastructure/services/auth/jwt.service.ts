import jwt from 'jsonwebtoken';
import ms from 'ms';
import dotenv from 'dotenv';
import { ApplicationStatus } from '@shared/constants/index.constants';
import { validationError } from '@presentation/middlewares/error.middleware';
import { TokenPayload  } from '@application/dtos/service/auth.service';
import { IAuthService } from '@application/interfaces/service/auth/IAuth.service';
import { injectable } from 'inversify';
dotenv.config();


@injectable()

export class JwtService implements IAuthService {
    private readonly _jwtSecret = process.env.JWT_SECRET!;
      private readonly _jwtExpiration = process.env.JWT_EXPIRATION!;
    private readonly _jwtRefreshSecret= process.env.JWT_REFRESH_SECRET!; 
    private readonly _jwtRefreshExpiration= process.env.JWT_REFRESH_EXPIRATION!;

constructor(){
    this.validateEnv();
}

private validateEnv() {
    if(
        !this._jwtSecret ||
        !this._jwtExpiration ||
        !this._jwtRefreshSecret ||
        !this._jwtRefreshExpiration
        
    ) {
        throw new validationError(ApplicationStatus.MissingJwtEnvironmentVariables);
    }
}
   generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._jwtSecret, { 
        expiresIn: this._jwtExpiration as ms.StringValue 
    });
   }
generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this._jwtRefreshSecret, {
        expiresIn: this._jwtRefreshExpiration as ms.StringValue
    });
   }    

   authenticateAccessToken(token: string): TokenPayload {
    return jwt.verify(token, this._jwtSecret) as TokenPayload;
   }

   authenticateRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this._jwtRefreshSecret) as TokenPayload;
     }
}