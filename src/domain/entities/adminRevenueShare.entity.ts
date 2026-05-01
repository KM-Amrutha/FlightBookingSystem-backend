export interface IAdminRevenueShare {
  _id: string;
  adminId: string;
  bookingDetailId: string;
  paymentId: string;
  shareAmount: number;
  payoutDate: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
