

import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IPasswordResetRepository 
extends IBaseRepository<IPasswordResetToken> {
  createToken(email: string, resetToken: string): Promise<IPasswordResetToken>;
  deleteToken(resetToken: string): Promise<IPasswordResetToken | null>;
}