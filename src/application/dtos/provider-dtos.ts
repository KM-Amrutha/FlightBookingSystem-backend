export interface Provider {
  _id: string;
  role: "user"|"provider" ;
  companyName: string;
  email: string;
  mobile: string;
  airlineCode: string;
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
}

export interface CreateProviderDTO {
  companyName: string;
  email: string;
  mobile: string;
  password: string;
  airlineCode: string;
  isActive: true, 
  isVerified: true 
}

export interface CompleteProviderProfileDTO {
  companyName?: string;
  email?: string;
  mobile?: string;
  airlineCode?: string;
  logoUrl: string;
  registrationCertificateUrl: string;
  insuranceProofUrl: string;
  establishmentYear: number;
  licenseExpiryDate: Date;
  headquartersAddress: string;
  countryOfOperation: string;
  typeOfOperation: string;
  websiteUrl: string;
  ceoName: string;
  officeContactNumber: string;
}

export interface UpdateProviderDTO {
  companyName?: string;
  email?:string;
  mobile?: string;
  airlineCode?:string;
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
}
