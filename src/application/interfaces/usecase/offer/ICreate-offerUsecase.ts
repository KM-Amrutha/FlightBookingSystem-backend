import { CreateOfferDTO } from "@application/dtos/offer-dtos";
import { OfferResponseDTO } from "@application/dtos/offer-dtos";

export interface ICreateOfferUseCase {
  execute(providerId: string, data: CreateOfferDTO): Promise<OfferResponseDTO>;
}