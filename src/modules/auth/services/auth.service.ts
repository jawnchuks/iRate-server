import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import {
  OnboardingDto,
  InitiateAuthDto,
  VerifyOtpDto,
  UploadPhotoDto,
  RefreshTokenDto,
  LogoutDto,
} from '../dto';
import { GoogleOAuthService } from './google-oauth.service';
import { EmailService } from './email.service';
import { PhoneService } from './phone.service';
import { CloudinaryService } from 'src/common/utils/cloudinary';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly emailService: EmailService,
    private readonly phoneService: PhoneService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async initiateAuth(dto: InitiateAuthDto) {
    const { email, phoneNumber, googleToken } = dto;

    if (googleToken) {
      const googleUser = await this.googleOAuthService.verifyToken(googleToken);
      if (!googleUser || !googleUser.email) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const user = await this.prisma.user.upsert({
        where: { email: googleUser.email },
        update: {},
        create: {
          email: googleUser.email,
          roles: [UserRole.USER],
          emailVerified: true,
        },
      });

      const tokens = await this.generateTokens(user);
      return { user, ...tokens };
    }

    if (email) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      await this.emailService.sendVerificationEmail(email, otp);
      return { message: 'OTP sent to email' };
    }

    if (phoneNumber) {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      await this.phoneService.sendOtp(phoneNumber, otp);
      return { message: 'OTP sent to phone' };
    }

    throw new BadRequestException('Either email, phoneNumber, or googleToken must be provided');
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { email, phoneNumber, otp } = dto;

    if (email) {
      const isValid = await this.emailService.verifyOtp(email, otp);
      if (!isValid) {
        throw new UnauthorizedException('Invalid OTP');
      }

      const user = await this.prisma.user.upsert({
        where: { email },
        update: { emailVerified: true },
        create: {
          email,
          roles: [UserRole.USER],
          emailVerified: true,
        },
      });

      const tokens = await this.generateTokens(user);
      return { user, ...tokens };
    }

    if (phoneNumber) {
      const isValid = await this.phoneService.verifyOtp(phoneNumber, otp);
      if (!isValid) {
        throw new UnauthorizedException('Invalid OTP');
      }

      const user = await this.prisma.user.upsert({
        where: { phoneNumber },
        update: { phoneVerified: true },
        create: {
          phoneNumber,
          roles: [UserRole.USER],
          phoneVerified: true,
        },
      });

      const tokens = await this.generateTokens(user);
      return { user, ...tokens };
    }

    throw new BadRequestException('Either email or phoneNumber must be provided');
  }

  async completeOnboarding(userId: string, dto: OnboardingDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        onboardingComplete: true,
        // profileCompletionPercentage: 100, // TODO: Add this back in by calculating what fields needs to be completed in user model
      },
    });

    return user;
  }

  async uploadPhoto(userId: string, dto: UploadPhotoDto) {
    const { photoUrl } = dto;
    const uploadResult = await this.cloudinaryService.uploadImage(photoUrl);

    const photo = await this.prisma.userPhoto.create({
      data: {
        url: uploadResult.secure_url,
        userId,
        isProfilePicture: true,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { profilePictureId: photo.id },
    });

    return photo;
  }

  async refreshToken(dto: RefreshTokenDto) {
    const { refreshToken } = dto;
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(dto: LogoutDto) {
    // In a real application, you might want to blacklist the refresh token
    return { message: 'Logged out successfully' };
  }

  async becomeCreator(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.roles.includes(UserRole.AFFILIATE)) {
      throw new BadRequestException('Affiliates cannot become creators');
    }

    if (user.roles.includes(UserRole.CREATOR)) {
      throw new BadRequestException('User is already a creator');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: [...user.roles, UserRole.CREATOR],
      },
    });

    return updatedUser;
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profilePicture: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture?.url,
        interests: user.interests,
        location: user.location,
        averageRating: user.averageRating,
        totalRatings: user.totalRatings,
      },
    };
  }

  private async generateTokens(user: { id: string; email: string | null; roles: UserRole[] }) {
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
