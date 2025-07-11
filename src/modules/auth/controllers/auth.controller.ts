import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../users/services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { OnboardingDto, InitiateAuthDto, OtpVerificationDto, OtpResendDto } from '../dto/auth.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiExtraModels } from '@nestjs/swagger';
import {
  BaseResponseDto,
  BaseUnauthorizedErrorDto as UnauthorizedErrorDto,
  BaseInternalServerErrorDto as InternalServerErrorDto,
} from '../../../common/dto';
import { UserProfileDto } from '../../users/dto/user-response.dto';
import { MinimalUserDto } from '../dto/auth-response.dto';
import { CloudinaryService } from 'src/common/utils/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
@ApiExtraModels(MinimalUserDto, UserProfileDto)
@ApiBearerAuth()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService, // Add CloudinaryService injection
  ) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Initiate authentication',
    description: 'Start the authentication process by sending a verification token to email',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification email sent',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification email sent' },
        data: { type: 'object', example: { status: 'Verification email sent' } },
      },
    },
  })
  async initiateAuth(@Body() dto: InitiateAuthDto): Promise<BaseResponseDto<{ status: string }>> {
    const data = await this.authService.initiateAuth(dto);
    return new BaseResponseDto(HttpStatus.OK, data.status, data);
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify email token',
    description:
      'Verify the token sent to email. New users get a status message, existing users get a JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token verified',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Authenticated' },
        data: {
          oneOf: [
            { type: 'object', properties: { status: { type: 'string' } } },
            {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                user: { $ref: '#/components/schemas/UserProfileDto' },
              },
            },
          ],
        },
      },
    },
  })
  async verifyToken(
    @Body() dto: OtpVerificationDto,
  ): Promise<
    BaseResponseDto<
      { status: string } | { accessToken: string; refreshToken: string; user: UserProfileDto }
    >
  > {
    const data = await this.authService.verifyOtp(dto);
    let message = 'Authenticated';
    if ('status' in data) message = data.status;
    return new BaseResponseDto(HttpStatus.OK, message, data);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Complete user onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Onboarding complete' },
        data: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            user: { $ref: '#/components/schemas/UserProfileDto' },
          },
        },
      },
    },
  })
  async completeOnboarding(
    @Body() dto: OnboardingDto,
  ): Promise<BaseResponseDto<{ accessToken: string; refreshToken: string; user: UserProfileDto }>> {
    const data = await this.authService.completeOnboarding(dto);
    return new BaseResponseDto(HttpStatus.OK, 'Onboarding complete', data);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({
    status: 200,
    description: 'Verification email resent',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Verification email resent' },
        data: { type: 'object', example: { status: 'Verification email resent' } },
      },
    },
  })
  async resendVerification(
    @Body() dto: OtpResendDto,
  ): Promise<BaseResponseDto<{ status: string }>> {
    const data = await this.authService.resendOtp(dto);
    return new BaseResponseDto(HttpStatus.OK, data.status, data);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: "Invalidate the user's token and log them out",
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Logged out successfully' },
        data: { type: 'object', example: { status: 'Logged out' } },
      },
    },
  })
  async logout(
    @CurrentUser('userId') userId: string,
    @Body('token') token: string,
  ): Promise<BaseResponseDto<{ status: string }>> {
    const data = await this.authService.logout(token);
    return new BaseResponseDto(HttpStatus.OK, data.status, data);
  }

  @Post('deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate account' })
  @ApiResponse({
    status: 200,
    description: 'Account deactivated',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Account deactivated' },
        data: { type: 'object', example: { status: 'Account deactivated' } },
      },
    },
  })
  async deactivateAccount(
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<{ status: string }>> {
    const data = await this.authService.deactivateAccount(userId);
    return new BaseResponseDto(HttpStatus.OK, data.status, data);
  }

  @Post('upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a profile picture for onboarding (no auth required)' })
  @ApiResponse({
    status: 200,
    description: 'Photo uploaded',
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Photo uploaded' },
        data: {
          type: 'object',
          example: { url: 'https://cloudinary.com/image/upload/v1234567890/photo.jpg' },
        },
      },
    },
  })
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const uploadResult = await this.cloudinaryService.uploadFile(file);
    return new BaseResponseDto(HttpStatus.OK, 'Photo uploaded', { url: uploadResult.secure_url });
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user profile',
    description: "Retrieve the authenticated user's profile information.",
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: BaseResponseDto,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Profile retrieved successfully' },
        data: { $ref: '#/components/schemas/UserProfileDto' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async getProfile(
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<UserProfileDto>> {
    const profile = await this.userService.findById(userId);
    return new BaseResponseDto(HttpStatus.OK, 'Profile retrieved successfully', profile);
  }
}
