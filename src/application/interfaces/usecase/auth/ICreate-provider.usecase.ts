import { CreateProviderDTO, Provider } from "@application/dtos/provider-dtos";
import { userListDTO } from "@application/dtos/user-dtos";

export interface ICreateProviderUseCase {
  execute(dto: CreateProviderDTO): Promise<Provider | userListDTO>;
}