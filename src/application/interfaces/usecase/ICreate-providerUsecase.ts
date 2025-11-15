import { CreateProviderDTO, Provider } from "@application/dtos/provider-dtos";
import { IUser } from "@domain/entities/user.entity";

export interface ICreateProviderUseCase {
    execute(dto: CreateProviderDTO): Promise<Provider | IUser>;
}
