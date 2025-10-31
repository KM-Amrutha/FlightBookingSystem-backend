import { SignInDTO } from "@application/dtos/auth-dtos";
import { Provider } from "@application/dtos/provider-dtos";
import { IUser } from "@domain/entities/user.entity";

export interface ISignInUseCase {
    execute(dto: SignInDTO): Promise<{
        accessToken: string;
        refreshToken: string;
        userData: IUser | Provider;
    }>;
}
