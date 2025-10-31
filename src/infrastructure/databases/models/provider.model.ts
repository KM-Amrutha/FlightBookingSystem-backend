import { IProvider } from "@domain/entities/provider.entity";

import mongoose, {Schema} from "mongoose";

const providerSchema = new Schema<IProvider>(
    {

    companyName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    airlineCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    logo_url: {
      type: String,
      default: null
    },
    registration_certificate_url: {
      type: String,
      default: null
    },
    insurance_proof_url: {
      type: String,
      default: null
    },
    establishment_year: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    },
    license_expiry_date: {
      type: Date
    },
    headquarters_address: {
      type: String,
      trim: true
    },
    country_of_operation: {
      type: String,
      trim: true
    },
    type_of_operation: {
      type: String,
      enum: ['domestic', 'international', 'both'],
      default: 'both'
    },
    website_url: {
      type: String,
      trim: true
    },
    ceo_name: {
      type: String,
      trim: true
    },
    office_contact_number: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    adminApproval: {
  type: Boolean,
  default: false
}
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

// Indexes
providerSchema.index({ email: 1 });
providerSchema.index({ airlineCode: 1 });
providerSchema.index({ isActive: 1, isVerified: 1 });

const ProviderModel = mongoose.model<IProvider>("Provider",providerSchema);
export default ProviderModel;
