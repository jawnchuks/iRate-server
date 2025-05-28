import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

@Injectable()
export class PhoneService {
  private twilioClient: twilio.Twilio | null = null;
  private fromNumber: string | null = null;
  private isDev: boolean;

  constructor(private configService: ConfigService) {
    this.isDev = process.env.NODE_ENV !== 'production';
    this.initializeTwilio();
  }

  private initializeTwilio() {
    if (this.isDev) {
      console.log('📱 Running in development mode - SMS will be logged to console');
      return;
    }

    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const fromNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      console.warn('⚠️ Twilio credentials not configured. SMS functionality will be disabled.');
      return;
    }

    this.fromNumber = fromNumber;
    this.twilioClient = twilio(accountSid, authToken);
  }

  async sendOtp(phoneNumber: string, otp: string): Promise<void> {
    if (this.isDev) {
      console.log('📱 Test SMS to:', phoneNumber);
      console.log('🔑 OTP Code:', otp);
      return;
    }

    if (!this.twilioClient || !this.fromNumber) {
      throw new BadRequestException('SMS service is not configured');
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
}
