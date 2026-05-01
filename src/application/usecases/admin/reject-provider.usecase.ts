
import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IEmailService } from "@application/interfaces/service/communication/IEmail.service";
import { IRejectProviderUseCase } from "@application/interfaces/usecase/admin/IRejectedProvider.usecase";
import { validationError } from "@presentation/middlewares/error.middleware";

@injectable()
export class RejectProviderUseCase implements IRejectProviderUseCase {
  constructor(
    @inject(TYPES_REPOSITORIES.ProviderRepository)
    private _providerRepository: IProviderRepository,
    @inject(TYPES_SERVICES.EmailService)
    private _emailService: IEmailService
  ) {}

  async execute(providerId: string, reason: string): Promise<void> {
    if (!reason || reason.trim().length < 10) {
      throw new validationError("Rejection reason must be at least 10 characters long");
    }

    const provider = await this._providerRepository.findById(providerId);
    
    if (!provider) {
      throw new validationError("Provider not found");
    }

    // Update status to rejected, save reason, keep isActive: true so they can reapply
    await this._providerRepository.update(providerId, { 
      profileStatus: 'rejected',
      rejectionReason: reason.trim(),
      rejectionDate: new Date()
    });

    // Send detailed email with actual reason
    await this._emailService.sendEmail({
      to: provider.email,
      subject: "Action Required: Your Skylife Provider Application Needs Updates",
      text: `Dear ${provider.companyName},

Thank you for submitting your provider profile.

After review, we are unable to approve your application at this time.

Reason:
${reason.trim()}

Please log in to your dashboard, make the necessary updates, and click "Reapply" to resubmit.

We look forward to approving your account soon!

Best regards,
Skylife Admin Team`
    });
  }
}