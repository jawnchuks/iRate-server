import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  OnboardingDto,
  InitiateAuthDto,
  VerifyOtpDto,
  UploadPhotoDto,
  RefreshTokenDto,
  LogoutDto,
} from '../dto/auth.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../guards/roles.guard';
import { Roles, UserRole } from '../decorators/roles.decorator';
import { CurrentUser } from '../../../common/types/user.types';

interface RequestWithUser extends Request {
  user: CurrentUser;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Initiate authentication',
    description:
      'Start the authentication process using email, phone number, or Google OAuth token. This will send an OTP if using email or phone.',
  })
  @ApiBody({ type: InitiateAuthDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication initiated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'OTP sent to email',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async initiateAuth(@Body() dto: InitiateAuthDto) {
    return this.authService.initiateAuth(dto);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify OTP',
    description:
      'Verify the OTP received via email or phone to complete the authentication process.',
  })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'OTP verified successfully',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
          },
        },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid OTP',
  })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboarding')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete user onboarding',
    description: 'Complete the user onboarding process by providing required profile information.',
  })
  @ApiBody({ type: OnboardingDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Onboarding completed successfully',
    type: OnboardingDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async completeOnboarding(@Req() req: RequestWithUser, @Body() dto: OnboardingDto) {
    return this.authService.completeOnboarding(req.user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-photo')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({
    summary: 'Upload user photo',
    description: "Upload a photo for the user's profile. The photo will be processed and stored.",
  })
  @ApiBody({ type: UploadPhotoDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Photo uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        url: { type: 'string' },
        userId: { type: 'string' },
        isProfilePicture: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async uploadPhoto(@Req() req: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    const dto: UploadPhotoDto = {
      photoUrl: file.path,
    };
    return this.authService.uploadPhoto(req?.user?.sub, dto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Get a new access token using a valid refresh token.',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refreshed successfully',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid refresh token',
  })
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout user',
    description: "Invalidate the user's refresh token and log them out.",
  })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logged out successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logged out successfully' },
      },
    },
  })
  async logout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @Post('become-creator')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Become a creator',
    description: 'Upgrade user account to creator status. Only available to regular users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully upgraded to creator',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        roles: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User already has creator role or is an affiliate',
  })
  async becomeCreator(@Req() req: RequestWithUser) {
    return this.authService.becomeCreator(req.user.sub);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: "Retrieve the authenticated user's profile information.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            bio: { type: 'string' },
            profilePicture: { type: 'string' },
            interests: { type: 'array', items: { type: 'string' } },
            location: {
              type: 'object',
              properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
              },
            },
            averageRating: { type: 'number' },
            totalRatings: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
  })
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user.sub);
  }
}
