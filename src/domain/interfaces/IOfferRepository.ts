import { IOffer } from "@domain/entities/offer.entity";
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IOfferRepository extends IBaseRepository<IOffer> {
  // Provider creates an offer for their aircraft
  createOffer(data: Partial<IOffer>): Promise<IOffer>;

  // Get single offer by ID
  getOfferById(offerId: string): Promise<IOffer | null>;

  // Get offer by code — used when user selects an offer
  getOfferByCode(offerCode: string): Promise<IOffer | null>;

  // Get all offers for a provider (provider dashboard — paginated)
  getOffersByProviderId(
    providerId: string,
    page: number,
    limit: number
  ): Promise<{
    offers: IOffer[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>;

  // Get all active eligible offers for a list of aircraftIds
  // Used on summary page — fetch offers for all aircrafts in booking
  getEligibleOffersByAircraftIds(
    aircraftIds: string[],
    grandTotal: number,
    currentDate: Date
  ): Promise<IOffer[]>;

  // Provider updates an offer
  updateOffer(offerId: string, data: Partial<IOffer>): Promise<IOffer | null>;

  // Provider deletes an offer
  deleteOfferById(offerId: string): Promise<IOffer | null>;

  // Toggle active status
  toggleOfferStatus(offerId: string, isActive: boolean): Promise<IOffer | null>;
  
  incrementUsageCount(offerId: string): Promise<IOffer | null>;
}