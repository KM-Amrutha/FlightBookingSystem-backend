import mongoose, { Document } from "mongoose"

export interface IProvider extends Document {
  _id: string;
  companyName: string;
  email: string;
  mobile: string;
  password: string;
  airlineCode: string;
  role: "provider";
  logoUrl?: string;
  registrationCertificateUrl?: string;
  insuranceProofUrl?: string;
  establishmentYear?: number;
  licenseExpiryDate?: Date;
  headquartersAddress?: string;
  countryOfOperation?: string;
  typeOfOperation?: string;
  websiteUrl?: string;
  ceoName?: string;
  officeContactNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isVerified: boolean;
  adminApproval: boolean; 
  isProfileComplete: boolean; 
}
