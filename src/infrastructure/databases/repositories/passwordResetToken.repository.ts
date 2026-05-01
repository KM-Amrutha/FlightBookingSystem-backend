import { IPasswordResetRepository } from "@domain/interfaces/IPasswordResetTokenRepository";
import { BaseRepository } from "@infrastructure/databases/repositories/base.repository";
import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";
import PasswordResetTokenModel from "@infrastructure/databases/models/password.token.model";


export class PasswordResetRepository
  extends BaseRepository<IPasswordResetToken>
  implements IPasswordResetRepository
{
  constructor() {
    super(PasswordResetTokenModel);
  }
  async createToken(
    email:string,
    resetToken:string
  ): Promise<IPasswordResetToken> {
    const PasswordResetTokenData =
      await PasswordResetTokenModel.findOneAndUpdate(
        { email },
        {
          resetToken,
          resetTokenCreatedAt: Date.now(),
        },
        {
          new: true,
          upsert: true,
        }
      );
    return PasswordResetTokenData.toObject();
  }

  async deleteToken(
    resetToken:string,
  ): Promise<IPasswordResetToken | null> {
    return await PasswordResetTokenModel.findOneAndDelete({
      resetToken,
    }).lean();
  }
}
