import { IOffer } from "@domain/entities/offer.entity";
import {
  OfferResponseDTO,
  EligibleOfferResponseDTO,
} from "@application/dtos/offer-dtos";

export class OfferMapper {

  static toOfferResponseDTO(offer: IOffer): OfferResponseDTO {
    return {
      id: offer.id,
      aircraftId: offer.aircraftId,
      ...(offer.aircraftName && {
  aircraftName: offer.aircraftName,
}),
      providerId: offer.providerId,
      offerCode: offer.offerCode,
      description: offer.description,
      discountPercentage: offer.discountPercentage,
      minimumAmount: offer.minimumAmount,
      validFrom: offer.validFrom.toISOString(),
      validTo: offer.validTo.toISOString(),
      isActive: offer.isActive,
      usageCount: offer.usageCount,
      ...(offer.usageLimit !== undefined && { usageLimit: offer.usageLimit }),
      isEditable: offer.usageCount === 0,
      createdAt: offer.createdAt.toISOString(),
      updatedAt: offer.updatedAt.toISOString(),
    };
  }

  static toOfferResponseDTOs(offers: IOffer[]): OfferResponseDTO[] {
    return offers.map((offer) => this.toOfferResponseDTO(offer));
  }

  static toEligibleOfferResponseDTO(
    offer: IOffer,
    grandTotal: number
  ): EligibleOfferResponseDTO {
    const discountAmount = parseFloat(
      ((grandTotal * offer.discountPercentage) / 100).toFixed(2)
    );
    const finalAmount = parseFloat((grandTotal - discountAmount).toFixed(2));

    return {
      id: offer.id,
      offerCode: offer.offerCode,
      description: offer.description,
      discountPercentage: offer.discountPercentage,
      minimumAmount: offer.minimumAmount,
      validFrom: offer.validFrom.toISOString(),
      validTo: offer.validTo.toISOString(),
      discountAmount,
      finalAmount,
    };
  }

  static toEligibleOfferResponseDTOs(
    offers: IOffer[],
    grandTotal: number
  ): EligibleOfferResponseDTO[] {
    return offers.map((offer) =>
      this.toEligibleOfferResponseDTO(offer, grandTotal)
    );
  }
}