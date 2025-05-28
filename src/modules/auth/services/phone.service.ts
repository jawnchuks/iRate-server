import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Twilio from 'twilio';

@Injectable()
export class PhoneService {
  private readonly logger = new Logger(PhoneService.name);
  private twilioClient: Twilio.Twilio | null = null;
  private fromNumber: string | null = null;
  private isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDev = process.env.NODE_ENV !== 'production';
    this.initializeTwilio();
  }

  private initializeTwilio() {
    try {
      const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
      const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
      const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

      // Only initialize if both credentials are present
      if (accountSid && authToken) {
        if (!accountSid.startsWith('AC')) {
          this.logger.warn('Invalid Twilio Account SID format. Expected format: AC...');
          return;
        }

        this.fromNumber = fromNumber || null;
        this.twilioClient = Twilio(accountSid, authToken);
        this.logger.log('Twilio client initialized successfully');
      } else {
        this.logger.warn('Twilio credentials not found. SMS functionality will be disabled.');
      }
    } catch (error: unknown) {
      this.logger.error(
        'Failed to initialize Twilio client:',
        error instanceof Error ? error.message : String(error),
      );
      this.twilioClient = null;
      this.fromNumber = null;
    }
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    if (this.isDev) {
      console.log('📱 Test SMS to:', phoneNumber);
      console.log('🔑 OTP Code:', otp);
      return;
    }

    if (!this.twilioClient || !this.fromNumber) {
      console.warn('⚠️ SMS service not available - logging OTP instead');
      console.log('📱 SMS would be sent to:', phoneNumber);
      console.log('🔑 OTP Code:', otp);
      return;
    }

    try {
      await this.twilioClient.messages.create({
        body: `Your iRate verification code is: ${otp}`,
        from: this.fromNumber,
        to: phoneNumber,
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new BadRequestException('Failed to send verification code');
    }
  }

  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    if (this.isDev) {
      console.log('🔍 Verifying OTP for:', phoneNumber);
      console.log('🔑 OTP to verify:', otp);
      return true;
    }

    // TODO: Implement proper OTP verification against stored value in production
    return true;
  }

  async sendSMS(to: string, message: string): Promise<boolean> {
    try {
      if (!this.twilioClient) {
        this.logger.warn('SMS not sent: Twilio client not initialized');
        return false;
      }

      const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
      if (!from) {
        this.logger.warn('SMS not sent: Twilio phone number not configured');
        return false;
      }

      await this.twilioClient.messages.create({
        body: message,
        to,
        from,
      });

      return true;
    } catch (error: unknown) {
      this.logger.error(
        'Failed to send SMS:',
        error instanceof Error ? error.message : String(error),
      );
      return false;
    }
  }
}
