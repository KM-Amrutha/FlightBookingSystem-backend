import { INotificationTemplate } from "@domain/entities/notificationTemplate.entity";
import mongoose, { Schema } from "mongoose";

const notificationTemplateSchema: Schema = new Schema(
  {
    providerId: {
      type: String,
      required: true,
      ref: "Provider"
    },
    notificationType: {
      type: String,
      required: true,
      enum: ["booking_confirmation", "booking_cancellation", "flight_reminder", "payment_success", "payment_failed"]
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      required: true
    },
    createdByProvider: {
      type: String,
      required: true,
      ref: "Provider"
    }
  },
  { timestamps: true }
);

notificationTemplateSchema.index({ providerId: 1 });
notificationTemplateSchema.index({ notificationType: 1 });

const NotificationTemplateModel = mongoose.model<INotificationTemplate>(
  "NotificationTemplate",
  notificationTemplateSchema
);
export default NotificationTemplateModel;
