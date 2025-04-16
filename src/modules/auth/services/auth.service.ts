import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RegisterEmailDto,
  RegisterPhoneDto,
  RegisterGoogleDto,
  LoginEmailDto,
  LoginPhoneDto,
  LoginGoogleDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  OnboardingDto,
} from '../dto';
import * as bcrypt from 'bcrypt';
import { GoogleOAuthService } from './google-oauth.service';
import { EmailService } from './email.service';
import { PhoneService } from './phone.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService,
  ) {}

  // EMAIL REGISTRATION
  async registerEmail(dto: RegisterEmailDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already in use');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: 'user',
        emailVerified: false,
        onboardingComplete: false,
      },
    });
    // Generate and store verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.verificationOTP.create({
      data: {
        phoneNumber: dto.email,
        otp: code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await this.emailService.sendVerificationCode(dto.email, code);
    return { success: true, message: 'Verification code sent to email' };
  }

  // PHONE REGISTRATION
  async registerPhone(dto: RegisterPhoneDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (existingUser) throw new ConflictException('Phone number already in use');
    await this.prisma.user.create({
      data: {
        phoneNumber: dto.phoneNumber,
        email: '',
        password: '',
        role: 'user',
        phoneVerified: false,
        onboardingComplete: false,
      },
    });
    await this.sendPhoneOTP(dto.phoneNumber);
    return { success: true, message: 'OTP sent to phone number' };
  }

  // GOOGLE REGISTRATION/LOGIN
  async registerGoogle(dto: RegisterGoogleDto) {
    const googleUser = await this.googleOAuthService.verifyGoogleToken(dto.token);
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          password: '',
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          role: 'user',
          emailVerified: true,
          onboardingComplete: false,
        },
      });
    }
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  // EMAIL LOGIN
  async loginEmail(dto: LoginEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
    if (!user.emailVerified) throw new UnauthorizedException('Email not verified');
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  // PHONE LOGIN
  async loginPhone(dto: LoginPhoneDto) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: dto.phoneNumber },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.phoneVerified) throw new UnauthorizedException('Phone not verified');
    // OTP verification
    const otpRecord = await this.prisma.verificationOTP.findFirst({
      where: {
        phoneNumber: dto.phoneNumber,
        otp: dto.otp,
        expiresAt: { gt: new Date() },
      },
    });
    if (!otpRecord) throw new UnauthorizedException('Invalid or expired OTP');
    await this.prisma.verificationOTP.delete({ where: { id: otpRecord.id } });
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  // GOOGLE LOGIN
  async loginGoogle(dto: LoginGoogleDto) {
    const googleUser = await this.googleOAuthService.verifyGoogleToken(dto.token);
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          password: '',
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          role: 'user',
          emailVerified: true,
          onboardingComplete: false,
        },
      });
    }
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  // EMAIL VERIFICATION
  async verifyEmail(dto: VerifyEmailDto) {
    const otpRecord = await this.prisma.verificationOTP.findFirst({
      where: {
        phoneNumber: dto.email,
        otp: dto.code,
        expiresAt: { gt: new Date() },
      },
    });
    if (!otpRecord) throw new UnauthorizedException('Invalid or expired code');
    const user = await this.prisma.user.update({
      where: { email: dto.email },
      data: { emailVerified: true },
    });
    await this.prisma.verificationOTP.delete({ where: { id: otpRecord.id } });
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  // PHONE VERIFICATION
  async verifyPhone(dto: VerifyPhoneDto) {
    const otpRecord = await this.prisma.verificationOTP.findFirst({
      where: {
        phoneNumber: dto.phoneNumber,
        otp: dto.otp,
        expiresAt: { gt: new Date() },
      },
    });
    if (!otpRecord) throw new UnauthorizedException('Invalid or expired OTP');
    const user = await this.prisma.user.update({
      where: { phoneNumber: dto.phoneNumber },
      data: { phoneVerified: true },
    });
    await this.prisma.verificationOTP.delete({ where: { id: otpRecord.id } });
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  // SEND PHONE OTP
  async sendPhoneOTP(phoneNumber: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await this.prisma.verificationOTP.create({
      data: { phoneNumber, otp, expiresAt: otpExpiry },
    });
    await this.phoneService.sendOTP(phoneNumber, otp);
    return { success: true, message: 'OTP sent successfully' };
  }

  // ONBOARDING
  async completeOnboarding(userId: string, dto: OnboardingDto) {
    // Save photos and set profile picture
    if (!dto.photos.includes(dto.profilePicture)) {
      throw new BadRequestException('Profile picture must be one of the uploaded photos');
    }
    // Remove old photos
    await this.prisma.userPhoto.deleteMany({ where: { userId } });
    // Add new photos
    const photoRecords = await Promise.all(
      dto.photos.map((url) =>
        this.prisma.userPhoto.create({
          data: {
            url,
            userId,
            isProfilePicture: url === dto.profilePicture,
          },
        }),
      ),
    );
    // Update user onboarding fields
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        dob: new Date(dto.dob),
        gender: dto.gender,
        selfDescription: dto.selfDescription,
        valuesInOthers: dto.valuesInOthers,
        whoCanSeeRatings: dto.whoCanSeeRatings,
        notificationPreferences: dto.notificationPreferences,
        profilePictureId: photoRecords.find((p) => p.isProfilePicture)?.id,
        bio: dto.bio,
        interests: dto.interests,
        location: dto.location
          ? {
              latitude: dto.location.latitude,
              longitude: dto.location.longitude,
            }
          : undefined,
        profileCompletionPercentage: dto.profileCompletion ?? 100,
        onboardingComplete: true,
      },
    });
    return {
      success: true,
      data: { access_token: this.generateToken(user), user },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        firstName: true,
        lastName: true,
        dob: true,
        gender: true,
        selfDescription: true,
        valuesInOthers: true,
        whoCanSeeRatings: true,
        notificationPreferences: true,
        onboardingComplete: true,
        profileCompletionPercentage: true,
        profilePhotos: true,
        profilePicture: true,
        averageRating: true,
        totalRatings: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return { success: true, data: user };
  }

  private generateToken(user: { id: string; email?: string }) {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  }
}
