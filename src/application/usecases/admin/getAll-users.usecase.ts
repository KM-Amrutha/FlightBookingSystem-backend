import { inject,injectable } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { userListDTO } from "@application/dtos/user-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
import { IGetAllUsersUseCase } from "@application/interfaces/usecase/admin/IGetAllUsers.usecase";
import { validationError } from "@presentation/middlewares/error.middleware";
import { USER_MESSAGES } from "@shared/constants/userMessages/user.messages";
import { UserMapper } from "@application/mappers/userMapper";


import { GetUsersQueryDTO } from "@application/dtos/query-dtos";


@injectable()
export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.UserRepository)
    private _userRepository: IUserRepository
  ) {}

  async execute({ page, limit, search, filters }: GetUsersQueryDTO): Promise<{
  usersList: userListDTO[];
  paginationData: PaginationDTO;
}> {
  
  
    const { users, totalPages,currentPage } = await this._userRepository.getAllUsers(page, limit, search, filters);

    if (!users || users.length === 0) {  
      throw new validationError(USER_MESSAGES.FAILED_TO_RETRIEVE_USERS_LIST );
    }

    

return {
      usersList: UserMapper.toUserListDTOs(users),
      paginationData: { totalPages, currentPage }, 
}
}



}