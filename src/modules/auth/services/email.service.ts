import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { emailTemplates } from '../templates/email-templates';
import { EmailTemplateData } from '../interfaces/email.interface';

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;
  private isDev: boolean;

  constructor(private configService: ConfigService) {
    this.isDev = process.env.NODE_ENV !== 'production';
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    if (this.isDev) {
      // Create test account for development
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Ethereal test account created:', testAccount.user);
      console.log('Preview URL:', `https://ethereal.email/login?email=${testAccount.user}`);
    } else {
      // Use real SMTP for production
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        secure: true,
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    }
  }

  async sendEmail(
    to: string,
    templateName: keyof typeof emailTemplates,
    data: EmailTemplateData,
  ): Promise<void> {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template '${templateName}' not found`);
    }

    const info = await this.transporter.sendMail({
      from: this.configService.get('SMTP_FROM'),
      to,
      subject: template.subject,
      html: template.html(data),
      text: template.text(data),
    });

    if (this.isDev) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  }

  async sendVerificationEmail(email: string, otp: string, name?: string): Promise<void> {
    await this.sendEmail(email, 'verification', { otp, name });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendEmail(email, 'welcome', { name });
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    // TODO: Implement proper OTP verification against stored value
    // For now, return true for testing
    return true;
  }
}
