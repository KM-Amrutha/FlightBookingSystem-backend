import { IOtp } from "@domain/entities/otp.entity";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import OtpModel from "../models/otp.model";
import {BaseRepository} from "@infrastructure/databases/repositories/base.repository";
// import { OtpDTO } from "@application/dtos/auth-dtos";

export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
  constructor() {
    super(OtpModel);
  }
  async createOtp( email:string, otp:string): Promise<IOtp> {
    const otpData = await OtpModel.findOneAndUpdate(
      { email },
      { otp },
      {
        new: true,
        upsert: true,
      }
    );
    return otpData.toObject();
  }
}
