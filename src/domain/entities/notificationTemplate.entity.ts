
export interface INotificationTemplate {
  _id: string;
  providerId: string;
  notificationType: string;
  subject: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  createdByProvider: string;
}
