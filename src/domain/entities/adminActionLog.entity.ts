export interface IAdminActionLog {
  _id: string;
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  changes: string;
  actionTime: Date;
  createdAt: Date;
}
