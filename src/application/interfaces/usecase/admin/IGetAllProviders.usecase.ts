import { Provider } from "@application/dtos/provider-dtos";
import { BaseQueryDTO } from "@application/dtos/query-dtos";
import { PaginationDTO } from "@application/dtos/utility-dtos";

export interface IGetAllProvidersUseCase {
    execute ({ page,limit,search,filters }:BaseQueryDTO): Promise<{
        providersList: Provider[];
        paginationData: PaginationDTO}>;
}