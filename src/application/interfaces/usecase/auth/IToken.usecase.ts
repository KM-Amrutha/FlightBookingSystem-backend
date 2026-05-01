import { JwtPayload } from "jsonwebtoken";

export interface ITokenUseCase {
    refreshAccessToken(refreshToken: string): Promise<string>;
    authAccessToken(accessToken: string): Promise<JwtPayload>;
}
