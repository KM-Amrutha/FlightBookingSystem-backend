import { inject, injectable } from "inversify";
import { IBookingRepository } from "@domain/interfaces/IBookingRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IGetAdminDashboardUseCase } from "@application/interfaces/usecase/admin/IGetAdminDashboard.usecase";
import { AdminDashboardResponseDTO } from "@application/dtos/wallet-dtos";
import { DashboardMapper } from "@application/mappers/adminMapper";
import {
  TYPES_BOOKING_REPOSITORIES,
  TYPES_REPOSITORIES,
} from "@di/types-repositories";

@injectable()
export class GetAdminDashboardUseCase implements IGetAdminDashboardUseCase {
  constructor(
    @inject(TYPES_BOOKING_REPOSITORIES.BookingRepository)
    private readonly _bookingRepository: IBookingRepository,
    @inject(TYPES_REPOSITORIES.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private readonly _providerRepository: IProviderRepository
  ) {}

  async execute(): Promise<AdminDashboardResponseDTO> {
    const [bookingStats, totalUsers, totalProviders] = await Promise.all([
      this._bookingRepository.getAdminDashboardStats(),
      this._userRepository.countDocs("user"),
      this._providerRepository.countDocs("provider"),
    ]);

    return DashboardMapper.toAdminDashboardResponseDTO({
      totalConfirmedBookings: bookingStats.totalConfirmedBookings,
      totalRevenue: bookingStats.totalRevenue,
      totalCommission: bookingStats.totalCommission,
      totalUsers,
      totalProviders,
      monthlyStats: bookingStats.monthlyStats,
    });
  }
}