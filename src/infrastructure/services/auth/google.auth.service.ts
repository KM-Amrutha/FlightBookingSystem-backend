import { OAuth2Client } from "google-auth-library";
import { TokenPayload } from "google-auth-library";
import { AUTH_MESSAGES } from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IGoogleAuthService } from "@application/interfaces/service/auth/IGoogle.auth.service";
import { injectable } from "inversify";

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private googleClient: OAuth2Client;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error("GOOGLE_CLIENT_ID is missing in environment variables");
    }
    this.googleClient = new OAuth2Client(clientId);
  }

  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      // Explicitly type the ticket to fix TS complaints
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      const payload: TokenPayload | undefined = ticket.getPayload();

      if (!payload) {
        throw new validationError(AUTH_MESSAGES.GOOGLE_AUTH_FAILED);
      }

      // Optional: extra safety checks
      if (!payload.email || !payload.email_verified) {
        throw new validationError("Invalid Google account: email not verified");
      }

      return payload;
    } catch (error: any) {
      console.error("Google token verification failed:", error.message || error);
      throw new validationError(AUTH_MESSAGES.GOOGLE_AUTH_FAILED);
    }
  }
}