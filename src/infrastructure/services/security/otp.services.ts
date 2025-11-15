import otpGenerator from "otp-generator";
import { IOtpService } from "@application/interfaces/service/security/IGenerate-otp.service";
import { injectable } from "inversify";

@injectable()
export class OtpService implements IOtpService {
  generateOtp(length: number): string {
    return otpGenerator.generate(length, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
  }
}
