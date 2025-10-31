import { OtpDTO } from "@application/dtos/auth-dtos";
import { IOtp } from "@domain/entities/otp.entity";

export interface IOtpUseCase {
    createOtp(dto: OtpDTO): Promise<IOtp>;
    verifyOtp(dto: OtpDTO): Promise<void>;
    resendOtp(data: { email: string }): Promise<void>;
}
