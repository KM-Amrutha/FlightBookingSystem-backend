import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IEmailService } from "@application/interfaces/service/communication/IEmail.service";
import { IRejectProviderUseCase } from "@application/interfaces/usecase/IRejectedProviderUsecase";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class RejectProviderUseCase implements IRejectProviderUseCase {
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

    await this._providerRepository.update(providerId, { 
      isActive: false,
      adminApproval: false 
    });

    await this._emailService.sendEmail({
      to: provider.email,
      subject: "Update on Your Skylife Provider Application",
      text: `Dear ${provider.companyName},\n\nWe are unable to approve your application at this time. Please contact support for more information.\n\nBest regards,\nSkylife Team`
    });
  }
}
