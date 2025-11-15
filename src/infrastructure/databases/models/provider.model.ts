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
     role: {
      type: String,
      enum: ['provider'],
      default: 'provider'
    },
    logoUrl: {
      type: String,
      default: null
    },
    registrationCertificateUrl: {
      type: String,
      default: null
    },
    insuranceProofUrl: {
      type: String,
      default: null
    },
    establishmentYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    },
    licenseExpiryDate: {
      type: Date
    },
    headquartersAddress: {
      type: String,
      trim: true
    },
    countryOfOperation: {
      type: String,
      trim: true
    },
    typeOfOperation: {
      type: String,
      enum: ['domestic', 'international', 'both'],
      default: 'both'
    },
    websiteUrl: {
      type: String,
      trim: true
    },
    ceoName: {
      type: String,
      trim: true
    },
    officeContactNumber: {
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
},
 isProfileComplete: {
    type: Boolean,
    default: false 
  }
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
);

// Indexes
providerSchema.index({ email: 1 });
providerSchema.index({ airlineCode: 1 });
providerSchema.index({ isActive: 1, isVerified: 1 });

const ProviderModel = mongoose.model<IProvider>("Provider",providerSchema);
export default ProviderModel;
