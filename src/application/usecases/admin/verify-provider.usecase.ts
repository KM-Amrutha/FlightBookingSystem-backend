import { injectable, inject } from "inversify";
import { TYPES_REPOSITORIES } from "@di/types-repositories";
import { TYPES_SERVICES } from "@di/types-services";
import { IProviderRepository } from "@domain/interfaces/IProviderRepository";
import { IEmailService } from "@application/interfaces/service/communication/IEmail.service";
import { IVerifyProviderUseCase } from "@application/interfaces/usecase/IVerifyProviderUsecase";
import { validationError } from "@presentation/middlewares/error.middleware";
import { UpdateProviderDTO } from "@application/dtos/provider-dtos";

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

    if (provider.profileStatus === 'approved') {
      throw new validationError("Provider already approved");
    }
 
    const updateData:Partial<UpdateProviderDTO> = {
      profileStatus: 'approved',
      rejectionReason: null,
      rejectionDate: null
    }

    await this._providerRepository.update(providerId,updateData);

    await this._emailService.sendEmail({
      to: provider.email,
      subject: "Congratulations! Your Skylife Provider Account Has Been Approved",
      text: `Dear ${provider.companyName},

Great news! Your provider profile has been reviewed and approved.

You can now:
• Add aircraft
• Create flights
• Manage bookings and offers

Welcome to the Skylife network!

Best regards,
Skylife Team`
    });
  }
}