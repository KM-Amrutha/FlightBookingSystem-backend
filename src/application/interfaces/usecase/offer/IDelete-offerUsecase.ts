import { OfferResponseDTO } from "@application/dtos/offer-dtos";

export interface IDeleteOfferUseCase {
  execute(providerId: string, offerId: string): Promise<OfferResponseDTO>;
}