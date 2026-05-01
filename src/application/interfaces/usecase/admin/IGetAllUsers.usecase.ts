import { userListDTO } from "@application/dtos/user-dtos";
import { GetUsersQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";
export interface IGetAllUsersUseCase {
    execute({ page, limit, search, filters }: GetUsersQueryDTO): Promise<
    {usersList:userListDTO[];
    paginationData:PaginationDTO}>;
}