import { validationError } from "@presentation/middlewares/error.middleware";
import { AuthStatus } from "@shared/constants/index.constants";
import { IProviderRepository,
    IUserRepository,
    ICheckUserBlockStatusUseCase,
 } from "@di/file-imports-index";

import { inject,injectable } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";

@injectable()
export class CheckUserBlockStatusUseCase implements ICheckUserBlockStatusUseCase  {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository
  ) {}

  async execute(_id: string): Promise<boolean> {
    if (!_id) {
      throw new validationError(AuthStatus.IdRequired);
    }
    const [userData, providerData] = await Promise.all([
      this._userRepository.findById(_id),
      this._providerRepository.getProviderDetailsById(_id.toString()),
    ]);

    if (!userData && !providerData) {
      throw new validationError(AuthStatus.InvalidId);
    }

    if (userData) return userData.isActive;
    if (providerData) return providerData.isActive;
    return false;
  }
  }