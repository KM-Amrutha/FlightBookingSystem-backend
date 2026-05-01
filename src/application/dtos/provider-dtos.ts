export interface Provider {
  _id: string;
  role: "user" | "provider";
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

  // New fields for approval workflow
  profileStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string |null;
  rejectionDate?: Date|null;
}

export interface CreateProviderDTO {
  companyName: string;
  email: string;
  mobile: string;
  password: string;
  airlineCode: string;
  // These are set by backend on creation
  isActive?: true;
  isVerified?: true;
}

export interface CompleteProviderProfileDTO {
  companyName?: string;
  email?: string;
  mobile?: string;
  airlineCode?: string;
  logoUrl?: string;                    // Can be base64 or existing URL
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

export interface UpdateProviderDTO {
  companyName?: string;
  email?: string;
  mobile?: string;
  airlineCode?: string;
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

  // Admin-only fields (used in approval/rejection)
  profileStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string|null;
  rejectionDate?: Date |null;
}


