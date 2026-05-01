import { ChangePasswordDTO } from "@application/dtos/auth-dtos";

export interface IChangePasswordUseCase {
  execute(data: ChangePasswordDTO): Promise<void>;
}