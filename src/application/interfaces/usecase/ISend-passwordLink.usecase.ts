import { CreatePassResetTokenDTO } from "@application/dtos/auth-dtos";
import { IPasswordResetToken } from "@domain/entities/pass-reset-token.entity";

export interface ISendPasswordRestLinkUseCase {
    execute(dto: CreatePassResetTokenDTO): Promise<IPasswordResetToken>;
}
