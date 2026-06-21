// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface CreateOfferDTO {
  aircraftId: string;
  offerCode: string;
  description: string;
  discountPercentage: number;
  minimumAmount: number;
  validFrom: string;  // ISO date string
  validTo: string;    // ISO date string
  usageLimit?: number;
}

export interface UpdateOfferDTO {
  description?: string;
  validFrom?: string;
  validTo?: string;
  isActive?: boolean;
  // only if usageCount === 0
  offerCode?: string;
  discountPercentage?: number;
  minimumAmount?: number;
  usageLimit?: number;
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface OfferResponseDTO {
  id: string;
  aircraftId: string;
  aircraftName?:string;
  providerId: string;
  offerCode: string;
  description: string;
  discountPercentage: number;
  minimumAmount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  isEditable: boolean;  // true if usageCount === 0
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedOffersResponseDTO {
  offers: OfferResponseDTO[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// ─── User Side ────────────────────────────────────────────────────────────────

export interface EligibleOfferResponseDTO {
  id: string;
  offerCode: string;
  description: string;
  discountPercentage: number;
  minimumAmount: number;
  validFrom: string;
  validTo: string;
  discountAmount: number;  // calculated: grandTotal × (discountPercentage / 100)
  finalAmount: number;     // grandTotal - discountAmount
}