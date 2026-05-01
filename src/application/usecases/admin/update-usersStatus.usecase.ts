import {inject,injectable} from "inversify";
import {TYPES_REPOSITORIES} from "@di/types-repositories";
import {IUserRepository} from "@domain/interfaces/IUserRepository";
import { IUpdateProviderStatusUseCase } from "@application/interfaces/usecase/admin/IUpdate-providerStatus.usecase";

@injectable()
export class UpdateUserStatusUseCase implements IUpdateProviderStatusUseCase {
    constructor(
        @inject(TYPES_REPOSITORIES.UserRepository)
        private _userRepository: IUserRepository
    ) {}

async execute(userId: string, isActive: boolean): Promise<void> {
   
      const success = await this._userRepository.updateUserActiveStatus(userId, isActive);

      if (!success) {
        throw new Error("User not found");
      }
  
  }    

    
}