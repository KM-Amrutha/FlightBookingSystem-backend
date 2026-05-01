import { OtpDTO } from "@application/dtos/auth-dtos";


export interface IOtpUseCase {
    createOtp(dto: OtpDTO): Promise<void>;
    verifyOtp(dto: OtpDTO): Promise<void>;
    resendOtp(data: { email: string }): Promise<void>;
}
