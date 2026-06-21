import { UpdateOfferDTO, OfferResponseDTO } from "@application/dtos/offer-dtos";

export interface IUpdateOfferUseCase {
  execute(providerId: string, offerId: string, data: UpdateOfferDTO): Promise<OfferResponseDTO>;
}