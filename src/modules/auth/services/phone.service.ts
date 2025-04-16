import { Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class PhoneService {
  async sendOTP(phoneNumber: string, otp: string): Promise<void> {
    if (process.env.NODE_ENV !== "production") {
      // Dev mode: log OTP to console
      console.log(`DEV OTP for ${phoneNumber}: ${otp}`);
      return;
    }
    // Production: integrate with Twilio or another SMS provider
    // Example Twilio code (commented out):
    // const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // try {
    //   await client.messages.create({
    //     body: `Your OTP is: ${otp}`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: phoneNumber,
    //   });
    // } catch (e) {
    //   throw new InternalServerErrorException('Failed to send OTP SMS');
    // }
    // For now, throw if in production and not implemented
    throw new InternalServerErrorException(
      "SMS sending not implemented in production"
    );
  }
}
