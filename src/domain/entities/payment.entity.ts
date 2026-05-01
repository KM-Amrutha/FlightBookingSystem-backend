export interface IPayment {
  _id: string;
  segmentId: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  paymentDate: Date;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}
