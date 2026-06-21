import { OfferResponseDTO } from "@application/dtos/offer-dtos";

export interface IOfferStatusChangeUseCase {
  execute(providerId: string, offerId: string): Promise<OfferResponseDTO>;
}