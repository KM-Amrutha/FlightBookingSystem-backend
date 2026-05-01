import { SignInDTO } from "@application/dtos/auth-dtos";
import { userListDTO } from "@application/dtos/user-dtos";
import { Provider } from "@application/dtos/provider-dtos";

export interface ISignInUseCase {
  execute(dto: SignInDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    userData: userListDTO;
  } | {
    accessToken: string;
    refreshToken: string;
    providerData: Provider;
  }>;
}