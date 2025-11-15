import {IOtp} from "@domain/entities/otp.entity"
import { IBaseRepository } from "@domain/interfaces/IBaseRepository"
import { OtpDTO } from "@application/dtos/auth-dtos"

export interface IOtpRepository extends IBaseRepository <IOtp> {
   create(createOTP:OtpDTO):Promise<IOtp>; 
}