import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;
  private isTest: boolean;

  constructor() {
    this.isTest =
      process.env.SMTP_HOST === "test" || process.env.NODE_ENV !== "production";
    if (this.isTest) {
      // Use Ethereal for test/dev
      nodemailer.createTestAccount().then((testAccount) => {
        this.transporter = nodemailer.createTransport({
          host: testAccount.smtp.host,
          port: testAccount.smtp.port,
          secure: testAccount.smtp.secure,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      });
    } else {
      // Use real SMTP for production
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Your Verification Code",
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <b>${code}</b></p>`,
      });
      if (this.isTest) {
        // Log the preview URL for Ethereal
        // eslint-disable-next-line no-console
        console.log(
          "Ethereal test email URL:",
          nodemailer.getTestMessageUrl(info)
        );
      }
    } catch (e) {
      throw new InternalServerErrorException(
        "Failed to send verification email"
      );
    }
  }
}
