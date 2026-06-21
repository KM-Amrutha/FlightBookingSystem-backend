import { AdminDashboardResponseDTO } from "@application/dtos/wallet-dtos";

export interface IGetAdminDashboardUseCase {
  execute(): Promise<AdminDashboardResponseDTO>;
}