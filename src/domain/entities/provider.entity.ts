import mongoose, { Document } from "mongoose"
    

export interface IProvider extends Document {
  _id: string;
  companyName: string;
  email: string;
  mobile: string;
  password: string;
  airlineCode: string;
  logo_url?: string;
  registration_certificate_url?: string;
  insurance_proof_url?: string;
  establishment_year?: number;
  license_expiry_date?: Date;
  headquarters_address?: string;
  country_of_operation?: string;
  type_of_operation?: string;
  website_url?: string;
  ceo_name?: string;
  office_contact_number?: string;
  created_at: Date;
  updated_at: Date;
  isActive: boolean;
  isVerified: boolean;
  adminApproval: boolean; 
}
