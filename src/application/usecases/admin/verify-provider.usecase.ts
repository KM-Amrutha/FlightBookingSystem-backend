import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IEmailService } from "@application/interfaces/service/communication/IEmail.service";
import { IVerifyProviderUseCase } from "@application/interfaces/usecase/IVerifyProviderUsecase";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class VerifyProviderUseCase implements IVerifyProviderUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.EmailService)
    private _emailService: IEmailService
  ) {}

  async execute(providerId: string): Promise<void> {
    const provider = await this._providerRepository.findById(providerId);
    
    if (!provider) {
      throw new validationError("Provider not found");
    }

    if (provider.adminApproval) {
      throw new validationError("Provider already approved");
    }

    await this._providerRepository.update(providerId, { adminApproval: true });

    await this._emailService.sendEmail({
      to: provider.email,
      subject: "Your Skylife Provider Account Has Been Approved!",
      text: `Dear ${provider.companyName},\n\nCongratulations! Your provider account has been approved. You can now add aircraft, offers, and manage bookings.\n\nBest regards,\nSkylife Team`
    });
  }
}
