// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface UserWalletTransactionResponseDTO {
  transactionId: string;
  type: "credit";
  amount: number;
  description: string;
  bookingId?: string;
  passengerId?: string;
  createdAt: string;
}

export interface UserWalletResponseDTO {
  id: string;
  userId: string;
  balance: number;
  transactions: UserWalletTransactionResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface ProviderWalletTransactionResponseDTO {
  transactionId: string;
  type: "credit";
  amount: number;
  description: string;
  bookingId?: string;
  flightId?: string;
  createdAt: string;
}

export interface ProviderWalletResponseDTO {
  id: string;
  providerId: string;
  balance: number;
  transactions: ProviderWalletTransactionResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardStatsDTO {
  totalConfirmedBookings: number;
  totalRevenue: number;
  totalCommission: number;
  totalUsers: number;
  totalProviders: number;
  monthlyStats: {
    month: string;
    year: number;
    bookings: number;
    revenue: number;
  }[];
}
export interface AdminWalletTransactionResponseDTO {
  transactionId: string;
  type: "credit";
  amount: number;
  description: string;
  bookingId?: string;
  providerId?: string;
  commissionRate: number;
  createdAt: string;
}

export interface AdminWalletResponseDTO {
  id: string;
  balance: number;
  transactions: AdminWalletTransactionResponseDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminDashboardResponseDTO {
  totalConfirmedBookings: number;
  totalRevenue: number;
  totalCommission: number;
  totalUsers: number;
  totalProviders: number;
  monthlyStats: {
    month: string;
    year: number;
    bookings: number;
    revenue: number;
  }[];
}

export interface CancelPassengerResponseDTO {
  bookingId: string;
  passengerId: string;
  refundAmount: number;
  walletBalance: number;
}