import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto';
import { Notification } from '../entities/notification.entity';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Twilio } from 'twilio';
import {
  emailTemplates,
  smsTemplates,
  VerificationData,
  WelcomeData,
  PasswordResetData,
  SubscriptionConfirmationData,
  PaymentConfirmationData,
  RatingNotificationData,
  ChatRequestData,
  SMSVerificationData,
  SMSPasswordResetData,
  SMSSubscriptionData,
} from '../templates/notification-templates';

interface NotificationError extends Error {
  code?: string;
}

@Injectable()
export class NotificationService {
  private emailTransporter!: nodemailer.Transporter;
  private twilioClient!: Twilio;
  private isDev: boolean;
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.isDev = this.configService.get('NODE_ENV') === 'development';
    this.initializeEmailTransporter();
    this.initializeTwilioClient();
  }

  private initializeEmailTransporter() {
    try {
      if (this.isDev) {
        // Use Ethereal for development
        this.emailTransporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: this.configService.get('ETHEREAL_USER'),
            pass: this.configService.get('ETHEREAL_PASS'),
          },
        });
      } else {
        // Use Gmail for production
        const gmailUser = this.configService.get('GMAIL_USER');
        const gmailPass = this.configService.get('GMAIL_APP_PASSWORD');

        if (!gmailUser || !gmailPass) {
          throw new Error('Gmail credentials not configured');
        }

        this.emailTransporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });
      }

      // Verify transporter configuration
      this.emailTransporter.verify((error: Error | null) => {
        if (error) {
          this.logger.error('Failed to initialize email transporter:', error);
          throw new Error('Failed to initialize email transporter');
        }
        this.logger.log('Email transporter initialized successfully');
      });
    } catch (error) {
      this.logger.error('Failed to initialize email service:', error);
      throw new InternalServerErrorException('Failed to initialize email service');
    }
  }

  private initializeTwilioClient() {
    try {
      const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
      const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
      const apiKey = this.configService.get('TWILIO_API_KEY');
      const apiSecret = this.configService.get('TWILIO_API_SECRET');

      if (!accountSid) {
        throw new Error('Twilio Account SID not configured');
      }

      // If using API Key/Secret (recommended for production)
      if (apiKey && apiSecret) {
        this.logger.log('Initializing Twilio client with API Key authentication');
        this.twilioClient = new Twilio(apiKey, apiSecret, { accountSid });
      }
      // If using Account SID/Auth Token
      else if (authToken) {
        this.logger.log('Initializing Twilio client with Account SID/Auth Token');
        this.twilioClient = new Twilio(accountSid, authToken);
      } else {
        throw new Error('Neither API Key/Secret nor Auth Token is configured');
      }

      this.logger.log('Twilio client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Twilio client:', error);
      throw new InternalServerErrorException('Failed to initialize SMS service');
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
      const info = await this.emailTransporter.sendMail({
        from: this.configService.get('EMAIL_FROM'),
        to,
        subject,
        html,
        text,
      });

      if (this.isDev) {
        this.logger.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
      } else {
        this.logger.log(`Email sent successfully to ${to}`);
      }
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error('Failed to send email:', notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  private async sendSMS(to: string, message: string): Promise<void> {
    try {
      const twilioNumber = this.configService.get('TWILIO_PHONE_NUMBER');

      if (!twilioNumber) {
        throw new Error('Twilio phone number not configured');
      }

      await this.twilioClient.messages.create({
        body: message,
        to,
        from: twilioNumber,
      });

      this.logger.log(`SMS sent successfully to ${to}`);
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error('Failed to send SMS:', notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async create(
    userId: string,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        ...createNotificationDto,
        read: false,
        data: createNotificationDto.data as Prisma.InputJsonValue,
      },
    });
    return notification as unknown as Notification;
  }

  async findAll(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return notifications as unknown as Notification[];
  }

  async findOne(id: string, userId: string): Promise<Notification> {
    const notification = await this.prisma.notification.findFirstOrThrow({
      where: { id, userId },
    });
    return notification as unknown as Notification;
  }

  async update(
    id: string,
    userId: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.prisma.notification.update({
      where: { id, userId },
      data: {
        ...updateNotificationDto,
        data: updateNotificationDto.data as Prisma.InputJsonValue,
      },
    });
    return notification as unknown as Notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.prisma.notification.update({
      where: { id, userId },
      data: { read: true },
    });
    return notification as unknown as Notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async remove(id: string, userId: string): Promise<void> {
    try {
      await this.prisma.notification.delete({
        where: { id, userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Notification not found');
        }
      }
      throw error;
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  // Email notification methods
  async sendVerificationEmail(email: string, data: VerificationData): Promise<void> {
    try {
      const template = emailTemplates.verification;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send verification email to ${email}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send verification email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendWelcomeEmail(email: string, data: WelcomeData): Promise<void> {
    try {
      const template = emailTemplates.welcome;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send welcome email to ${email}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send welcome email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendPasswordResetEmail(email: string, data: PasswordResetData): Promise<void> {
    try {
      const template = emailTemplates.passwordReset;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send password reset email to ${email}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send password reset email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendSubscriptionConfirmationEmail(
    email: string,
    data: SubscriptionConfirmationData,
  ): Promise<void> {
    try {
      const template = emailTemplates.subscriptionConfirmation;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(
        `Failed to send subscription confirmation email to ${email}:`,
        notificationError,
      );
      throw new InternalServerErrorException({
        message: 'Failed to send subscription confirmation email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendPaymentConfirmationEmail(email: string, data: PaymentConfirmationData): Promise<void> {
    try {
      const template = emailTemplates.paymentConfirmation;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(
        `Failed to send payment confirmation email to ${email}:`,
        notificationError,
      );
      throw new InternalServerErrorException({
        message: 'Failed to send payment confirmation email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendRatingNotificationEmail(email: string, data: RatingNotificationData): Promise<void> {
    try {
      const template = emailTemplates.ratingNotification;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send rating notification email to ${email}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send rating notification email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendChatRequestEmail(email: string, data: ChatRequestData): Promise<void> {
    try {
      const template = emailTemplates.chatRequest;
      if (!template.html || !template.text) {
        throw new Error('Email template methods not found');
      }
      await this.sendEmail({
        to: email,
        subject: template.subject,
        html: template.html(data),
        text: template.text(data),
      });
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send chat request email to ${email}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send chat request email',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  // SMS notification methods
  async sendVerificationSMS(phoneNumber: string, data: SMSVerificationData): Promise<void> {
    try {
      const template = smsTemplates.verification;
      if (!template.text) {
        throw new Error('SMS template method not found');
      }
      await this.sendSMS(phoneNumber, template.text(data));
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send verification SMS to ${phoneNumber}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send verification SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendPasswordResetSMS(phoneNumber: string, data: SMSPasswordResetData): Promise<void> {
    try {
      const template = smsTemplates.passwordReset;
      if (!template.text) {
        throw new Error('SMS template method not found');
      }
      await this.sendSMS(phoneNumber, template.text(data));
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send password reset SMS to ${phoneNumber}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send password reset SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendSubscriptionConfirmationSMS(
    phoneNumber: string,
    data: SMSSubscriptionData,
  ): Promise<void> {
    try {
      const template = smsTemplates.subscriptionConfirmation;
      if (!template.text) {
        throw new Error('SMS template method not found');
      }
      await this.sendSMS(phoneNumber, template.text(data));
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(
        `Failed to send subscription confirmation SMS to ${phoneNumber}:`,
        notificationError,
      );
      throw new InternalServerErrorException({
        message: 'Failed to send subscription confirmation SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendPaymentConfirmationSMS(
    phoneNumber: string,
    data: PaymentConfirmationData,
  ): Promise<void> {
    try {
      const template = smsTemplates.paymentConfirmation;
      if (!template.text) {
        throw new Error('SMS template method not found');
      }
      await this.sendSMS(phoneNumber, template.text(data));
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(
        `Failed to send payment confirmation SMS to ${phoneNumber}:`,
        notificationError,
      );
      throw new InternalServerErrorException({
        message: 'Failed to send payment confirmation SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendRatingNotificationSMS(
    phoneNumber: string,
    data: RatingNotificationData,
  ): Promise<void> {
    try {
      const template = smsTemplates.ratingNotification;
      if (!template.text) {
        throw new Error('SMS template method not found');
      }
      await this.sendSMS(phoneNumber, template.text(data));
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(
        `Failed to send rating notification SMS to ${phoneNumber}:`,
        notificationError,
      );
      throw new InternalServerErrorException({
        message: 'Failed to send rating notification SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }

  async sendChatRequestSMS(phoneNumber: string, data: ChatRequestData): Promise<void> {
    try {
      const template = smsTemplates.chatRequest;
      if (!template.text) {
        throw new Error('SMS template method not found');
      }
      await this.sendSMS(phoneNumber, template.text(data));
    } catch (error) {
      const notificationError = error as NotificationError;
      this.logger.error(`Failed to send chat request SMS to ${phoneNumber}:`, notificationError);
      throw new InternalServerErrorException({
        message: 'Failed to send chat request SMS',
        error: notificationError.message,
        code: notificationError.code,
      });
    }
  }
}
