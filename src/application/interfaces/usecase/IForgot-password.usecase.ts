import { PasswordResetDTO } from "@application/dtos/auth-dtos";

export interface IForgotPasswordUseCase {
    execute (dto:PasswordResetDTO): Promise<void>;

}