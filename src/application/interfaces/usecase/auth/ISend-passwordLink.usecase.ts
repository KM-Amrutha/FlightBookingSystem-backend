import { CreatePassResetTokenDTO } from "@application/dtos/auth-dtos"

export interface ISendPasswordRestLinkUseCase {
    execute(dto: CreatePassResetTokenDTO): Promise<void>;
}
