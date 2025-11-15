import { INotification } from "@domain/entities/notification.entity";
import mongoose, { Schema } from "mongoose";

const notificationSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User"
    },
    providerId: {
      type: String,
      required: true,
      ref: "Provider"
    },
    segmentId: {
      type: String,
      required: true,
      ref: "BookingSegment"
    },
    bookingDetailId: {
      type: String,
      required: true,
      ref: "BookingDetail"
    },
    notificationType: {
      type: String,
      required: true,
      enum: ["email", "sms", "push"]
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "sent", "failed"],
      default: "pending"
    },
    isSent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    }
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1 });
notificationSchema.index({ segmentId: 1 });
notificationSchema.index({ status: 1 });
notificationSchema.index({ isSent: 1 });
notificationSchema.index({ createdAt: -1 });

const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);
export default NotificationModel;
