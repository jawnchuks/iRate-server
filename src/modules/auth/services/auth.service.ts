import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { OnboardingDto, InitiateAuthDto, VerifyOtpDto, RefreshTokenDto } from '../dto';
import { GoogleOAuthService } from './google-oauth.service';
import { CloudinaryService } from 'src/common/utils/cloudinary';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../notifications/services/notification.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly googleOAuthService: GoogleOAuthService,
    private readonly notificationService: NotificationService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly redisService: RedisService,
  ) {}

  async initiateAuth(
    dto: InitiateAuthDto,
  ): Promise<{ requestId: string; isNewUser: boolean; needsOnboarding: boolean }> {
    try {
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

        return {
          requestId: user.id,
          isNewUser: !user.lastVerificationAt,
          needsOnboarding: !user.onboardingComplete,
        };
      }

      if (email) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
          where: { email },
        });

        // If user exists and has a valid session
        if (existingUser?.lastVerificationAt) {
          const lastVerificationDate = new Date(existingUser.lastVerificationAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          // If session is still valid and user is verified
          if (lastVerificationDate > thirtyDaysAgo && existingUser.emailVerified) {
            return {
              requestId: email,
              isNewUser: false,
              needsOnboarding: !existingUser.onboardingComplete,
            };
          }
        }

        try {
          const otp = Math.floor(1000 + Math.random() * 9000).toString();
          await this.redisService.storeOTP(email, otp);

          await this.notificationService.sendVerificationEmail(email, {
            name: existingUser?.firstName || 'User',
            otp,
          });

          return {
            requestId: email,
            isNewUser: !existingUser,
            needsOnboarding: existingUser ? !existingUser.onboardingComplete : true,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new InternalServerErrorException({
              message: 'Failed to send verification email',
              error: error.message,
              details: 'Please check your email configuration and try again',
            });
          }
          throw error;
        }
      }

      if (phoneNumber) {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
          where: { phoneNumber },
        });

        // If user exists and has a valid session
        if (existingUser?.lastVerificationAt) {
          const lastVerificationDate = new Date(existingUser.lastVerificationAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          // If session is still valid and user is verified
          if (lastVerificationDate > thirtyDaysAgo && existingUser.phoneVerified) {
            return {
              requestId: phoneNumber,
              isNewUser: false,
              needsOnboarding: !existingUser.onboardingComplete,
            };
          }
        }

        try {
          await this.notificationService.sendVerificationSMS(phoneNumber, {});
          return {
            requestId: phoneNumber,
            isNewUser: !existingUser,
            needsOnboarding: existingUser ? !existingUser.onboardingComplete : true,
          };
        } catch (error) {
          if (error instanceof Error) {
            throw new InternalServerErrorException({
              message: 'Failed to send verification SMS',
              error: error.message,
              details: 'Please check your SMS configuration and try again',
            });
          }
          throw error;
        }
      }

      throw new BadRequestException('Either email, phoneNumber, or googleToken must be provided');
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }

      console.error('Auth initiation error:', error);

      throw new InternalServerErrorException({
        message: 'Authentication initiation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: 'Please check the server logs for more information',
      });
    }
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<AuthResponseDto> {
    const { email, phoneNumber, otp } = dto;

    if (email) {
      const isValid = await this.redisService.verifyOTP(email, otp);
      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired OTP');
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
      return new AuthResponseDto(tokens.accessToken, tokens.refreshToken, user);
    }

    if (phoneNumber) {
      const isValid = await this.redisService.verifyOTP(phoneNumber, otp);
      if (!isValid) {
        throw new UnauthorizedException('Invalid or expired OTP');
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
      return new AuthResponseDto(tokens.accessToken, tokens.refreshToken, user);
    }

    throw new BadRequestException('Either email or phoneNumber must be provided');
  }

  async completeOnboarding(userId: string, dto: OnboardingDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        dob: new Date(Date.now() - dto.age * 365 * 24 * 60 * 60 * 1000),
        gender: dto.gender,
        selfDescription: dto.selfDescription,
        valuesInOthers: dto.valuesInOthers,
        visibility: dto.visibility,
        onboardingComplete: true,
      },
    });

    const tokens = await this.generateTokens(user);
    return new AuthResponseDto(tokens.accessToken, tokens.refreshToken, user);
  }

  async uploadPhoto(file: Express.Multer.File): Promise<{ url: string }> {
    const base64String = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${base64String}`;
    const result = await this.cloudinaryService.uploadImage(dataURI);
    return { url: result.url };
  }

  async refreshToken(dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(dto.refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);
      return { accessToken: tokens.accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(): Promise<void> {
    // In a real application, you might want to blacklist the refresh token
    return;
  }

  async becomeCreator(userId: string): Promise<{ id: string; roles: string[] }> {
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

    return {
      id: updatedUser.id,
      roles: updatedUser.roles,
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

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
