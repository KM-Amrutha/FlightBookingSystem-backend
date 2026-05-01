
export interface IOffer {
  _id: string;
  offerCode: string;
  discountAmount: number;
  validFrom: Date;
  validTo: Date;
  createdByProvider: string;
  aircraftId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
