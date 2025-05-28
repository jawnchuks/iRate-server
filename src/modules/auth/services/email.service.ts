import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { emailTemplates } from '../templates/email-templates';
// import { EmailTemplateData } from '../interfaces/email.interface';

interface VerificationEmailData {
  name: string;
  otp: string;
}

@Injectable()
export class EmailService {
  private transporter!: nodemailer.Transporter;
  private isDev: boolean;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.isDev = this.configService.get('NODE_ENV') === 'development';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.isDev) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: this.configService.get('ETHEREAL_USER'),
          pass: this.configService.get('ETHEREAL_PASS'),
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get('GMAIL_USER'),
          pass: this.configService.get('GMAIL_APP_PASSWORD'),
        },
      });
    }
  }

  private async sendEmail({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text: string;
  }): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to,
        subject,
        html,
        text,
      });

      if (this.isDev) {
        this.logger.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      this.logger.error('Failed to send email', error);
      throw new Error('Failed to send email');
    }
  }

  async sendVerificationEmail(email: string, otp: string): Promise<void> {
    try {
      const template = emailTemplates.verification;
      const data: VerificationEmailData = {
        name: 'User', // You might want to get the actual name from the user
        otp,
      };

      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw new Error('Failed to send verification email');
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: emailTemplates.welcome.subject,
      html: emailTemplates.welcome.html({ name }),
      text: emailTemplates.welcome.text({ name }),
    });
  }
}
