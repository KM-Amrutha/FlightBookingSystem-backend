import { AdminDashboardResponseDTO } from "@application/dtos/wallet-dtos";
import { DashboardStatsInput } from "@domain/entities/admin.entity";

export class DashboardMapper {
  static toAdminDashboardResponseDTO(
    data: DashboardStatsInput
  ): AdminDashboardResponseDTO {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      totalConfirmedBookings: data.totalConfirmedBookings,
      totalRevenue: data.totalRevenue,
      totalCommission: data.totalCommission,
      totalUsers: data.totalUsers,
      totalProviders: data.totalProviders,

     monthlyStats: data.monthlyStats.map((s) => ({
  month: monthNames[s.month - 1] ?? "Unknown",
  year: s.year,
  bookings: s.bookings,
  revenue: s.revenue,
}))
    };
  }
}