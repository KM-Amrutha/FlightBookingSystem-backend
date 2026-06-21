import { EligibleOfferResponseDTO } from "@application/dtos/offer-dtos";

export interface IGetEligibleOffersUseCase {
  execute(userId: string, sessionId: string): Promise<EligibleOfferResponseDTO[]>;
}