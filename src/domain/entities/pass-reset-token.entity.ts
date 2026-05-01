export interface IPasswordResetToken {
  id:string,
  email: string;
  resetToken: string;
  resetTokenCreatedAt: Date;
}
