import {IOtp} from "@domain/entities/otp.entity"
import { IBaseRepository } from "@domain/interfaces/IBaseRepository";

export interface IOtpRepository extends IBaseRepository <IOtp> {
   createOtp(email:string,otp:string):Promise<IOtp>; 
}