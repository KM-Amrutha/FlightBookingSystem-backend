import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { injectable } from "inversify";
import{
    APPLICATION_MESSAGES
} from "@shared/constants/index.constants";
import { validationError } from "@presentation/middlewares/error.middleware";
import { IEmailService } from "@application/interfaces/service/communication/IEmail.service";
import { SendEmail } from "@application/dtos/service/email.service";

@injectable()
export class EmailService implements IEmailService {
  private readonly _emailUser = process.env.EMAIL_USER!;
  private readonly _emailPass = process.env.EMAIL_PASS!;
  private _transporter: Transporter;
  constructor() {
    this.validateEnv();
    this._transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    return nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: this._emailUser,
        pass: this._emailPass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });
  }
  private validateEnv(): void {
    if (!this._emailUser || !this._emailPass) {
      throw new validationError(
        APPLICATION_MESSAGES.MISSING_EMAIL_ENVIRONMENT_VARIABLES
      );
    }
  }
  async sendEmail({ to, subject, text }: SendEmail): Promise<void> {
  try {
    await this._transporter.sendMail({
      from: this._emailUser,
      to,
      subject,
      text,
    });

    console.log("✅ Email sent successfully to:", to);
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message || error);
    throw new validationError("Failed to send email. Please try again later.");
  }
}
}