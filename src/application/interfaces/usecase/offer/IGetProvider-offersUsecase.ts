import { PaginatedOffersResponseDTO } from "@application/dtos/offer-dtos";

export interface IGetProviderOffersUseCase {
  execute(providerId: string, page: number, limit: number): Promise<PaginatedOffersResponseDTO>;
}