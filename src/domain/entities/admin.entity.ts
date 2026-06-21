export interface DashboardStatsInput {
  totalConfirmedBookings: number;
  totalRevenue: number;
  totalCommission: number;
  totalUsers: number;
  totalProviders: number;
  monthlyStats: {
    month: number;
    bookings: number;
    year: number;
    revenue: number;
  }[];
}