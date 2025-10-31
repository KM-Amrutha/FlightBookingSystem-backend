import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import { injectable } from "inversify";
import {
    AuthStatus,
    ApplicationStatus
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
        ApplicationStatus.MissingEmailEnvironmentVariables
      );
    }
  }
  async sendEmail({ to, subject, text }: SendEmail) {
    console.log("data for sending email", to, subject, text);

  console.log("EMAIL MOCK SUCCESS - Email 'sent' to:", to);
  console.log(" SUBJECT:", subject);
  console.log(" CONTENT:", text);
  console.log(" EXTRACT OTP FROM TEXT ABOVE ↑");
  
  // Just return success immediately
  return Promise.resolve();
    // try {
    //   await this.transporter.sendMail({
    //     to: to,
    //     from: this.emailUser,
    //     subject: subject,
    //     text: text,
    //   });
    //   console.log("Email sent successfully to", to, subject, text);
    // } catch (error) {
    //   console.log(`Error sending the email:${error}`);
    //   throw new validationError(AuthStatus.EmailSendFailed);
    // }
  }
}