export interface IOffer {
  id: string;
  aircraftId: string;
  aircraftName?: string;
  providerId: string;
  offerCode: string;
  description: string;
  discountPercentage: number;
  minimumAmount: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  createdAt: Date;
  updatedAt: Date;
}