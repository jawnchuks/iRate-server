import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { InitiateAuthDto, OtpVerificationDto, OtpResendDto, OnboardingDto } from '../dto/auth.dto';
import { CloudinaryService } from 'src/common/utils/cloudinary';
import { PhotoUploadResponseDto } from '../dto/auth-response.dto';
import { UserProfileDto } from '../../users/dto/user-response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../notifications/services/notification.service';
import { RedisService } from '../../redis/redis.service';
import crypto from 'crypto';
import { ProfileService } from '../../profile/services/profile.service';
import { UserService } from '../../users/services/user.service';
import { calculateProfileCompletionPercentage } from '../../../common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly redisService: RedisService,
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  async initiateAuth(dto: InitiateAuthDto): Promise<{ status: string }> {
    const { email } = dto;
    if (!email) throw new BadRequestException('Email is required');
    // Always generate a verification token and send via email
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.storeOTP(email, token);
    await this.notificationService.sendVerificationEmail(email, { name: 'User', otp: token });
    return { status: 'Verification email sent' };
  }

  async verifyOtp(
    dto: OtpVerificationDto,
  ): Promise<
    { status: string } | { accessToken: string; refreshToken: string; user: UserProfileDto }
  > {
    const { email, otp } = dto;
    const isValid = await this.redisService.verifyOTP(email, otp);
    if (!isValid) throw new UnauthorizedException('Invalid or expired token');
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // New user: create and mark email as verified, no JWT yet
      await this.prisma.user.create({
        data: {
          email,
          emailVerified: true,
          onboardingComplete: false,
          roles: [UserRole.USER],
          isVerified: true,
          verificationStatus: 'VERIFIED',
        },
      });
      return { status: 'Email verified. Please complete onboarding.' };
    } else {
      // Existing user: mark email as verified if not already
      if (!user.emailVerified) {
        await this.prisma.user.update({
          where: { email },
          data: {
            emailVerified: true,
            isVerified: true,
            verificationStatus: 'VERIFIED',
          },
        });
      }
      if (user.onboardingComplete) {
        const payload = { userId: user.id, email: user.email, roles: user.roles };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        const userProfile = await this.userService.findById(user.id);
        return {
          accessToken,
          refreshToken,
          user: userProfile,
        };
      } else {
        return { status: 'Email verified. Please complete onboarding.' };
      }
    }
  }

  async completeOnboarding(
    dto: OnboardingDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserProfileDto }> {
    const {
      email,
      photoUrls,
      firstName,
      lastName,
      age,
      gender,
      selfDescription,
      valuesInOthers,
      visibility,
      location,
    } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    // Set profilePicture to the first photo, if available
    const profilePicture = photoUrls && photoUrls.length > 0 ? photoUrls[0] : null;
    // Save user fields
    await this.prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        dob: new Date(Date.now() - age * 365 * 24 * 60 * 60 * 1000),
        gender,
        selfDescription,
        valuesInOthers,
        visibility,
        onboardingComplete: true,
        profilePicture,
        isVerified: true,
        verificationStatus: 'VERIFIED',
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
          city: location.city,
          state: location.state,
          country: location.country,
        },
      },
    });
    // Save media (profile photos)
    if (photoUrls && photoUrls.length > 0) {
      await this.prisma.media.createMany({
        data: photoUrls.map((url) => ({ url, userId: user.id, type: 'IMAGE' })),
        skipDuplicates: true,
      });
    }
    // Fetch updated user with media for profile completion calculation
    const updatedUserWithMedia = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { media: true },
    });
    if (updatedUserWithMedia) {
      const profileCompletionPercentage =
        calculateProfileCompletionPercentage(updatedUserWithMedia);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { profileCompletionPercentage },
      });
    }
    // After onboarding, return accessToken, refreshToken, and user
    const payload = { userId: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
    const userProfile = await this.userService.findById(user.id);
    return {
      accessToken,
      refreshToken,
      user: userProfile,
    };
  }

  async logout(token: string): Promise<{ status: string }> {
    await this.redisService.blacklistToken(token);
    return { status: 'Logged out' };
  }

  async deactivateAccount(userId: string): Promise<{ status: string }> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false, deactivatedAt: new Date() },
    });
    return { status: 'Account deactivated' };
  }

  async uploadPhoto(file: Express.Multer.File): Promise<PhotoUploadResponseDto> {
    try {
      // Upload to Cloudinary
      const uploadResult = await this.cloudinaryService.uploadFile(file);

      // Generate a unique upload ID
      const uploadId = crypto.randomUUID();

      // Store the upload data in Redis
      await this.redisService.storeUploadId(uploadId, {
        url: uploadResult.secure_url,
        timestamp: new Date().toISOString(),
      });

      return new PhotoUploadResponseDto(uploadId, uploadResult.secure_url);
    } catch (error) {
      console.error('Photo upload error:', error);
      throw new InternalServerErrorException({
        message: 'Failed to upload photo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    // Validate the refresh token and check blacklist
    const isBlacklisted = await this.redisService.isTokenBlacklisted(token);
    if (isBlacklisted) throw new UnauthorizedException('Token is blacklisted');
    let payload: { userId: string };
    try {
      payload = (await this.jwtService.verifyAsync(token)) as { userId: string };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) throw new UnauthorizedException('User not found');
    const newToken = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      roles: user.roles,
    });
    return { accessToken: newToken };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      // Optionally include media: true if you want to return media
      // include: { media: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async resendOtp(dto: OtpResendDto): Promise<{ status: string }> {
    const { email } = dto;
    if (!email) throw new BadRequestException('Email is required');
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.storeOTP(email, token);
    await this.notificationService.sendVerificationEmail(email, { name: 'User', otp: token });
    return { status: 'Verification email resent' };
  }
}
