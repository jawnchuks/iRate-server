import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../services/auth.service';
import { UserService } from '../../users/services/user.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles, UserRole } from '../decorators/roles.decorator';
import { OnboardingDto, InitiateAuthDto } from '../dto/auth.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import {
  BaseResponseDto,
  BaseValidationErrorDto as ValidationErrorDto,
  BaseUnauthorizedErrorDto as UnauthorizedErrorDto,
  BaseForbiddenErrorDto as ForbiddenErrorDto,
  BaseInternalServerErrorDto as InternalServerErrorDto,
  BaseErrorResponseDto as TooManyRequestsErrorDto,
} from '../../../common/dto';
import { UserProfileDto } from '../../users/dto/user-response.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { PhotoUploadResponseDto, OtpResendResponseDto } from '../dto/auth-response.dto';
import { OtpVerificationDto, OtpResendDto } from '../dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('initiate')
  @ApiOperation({
    summary: 'Initiate authentication',
    description: 'Start the authentication process by sending OTP to email or phone',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP sent successfully',
    type: BaseResponseDto,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OTP sent successfully' },
        data: {
          type: 'object',
          properties: {
            requestId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @ApiResponse({
    status: 429,
    description: 'Too many OTP requests',
    type: TooManyRequestsErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async initiateAuth(
    @Body() dto: InitiateAuthDto,
  ): Promise<BaseResponseDto<{ requestId: string }>> {
    const data = await this.authService.initiateAuth(dto);
    return new BaseResponseDto(HttpStatus.OK, 'OTP sent successfully', {
      requestId: data.requestId,
    });
  }

  @Post('verify')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify the OTP and complete authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'OTP verified successfully',
    type: BaseResponseDto,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'OTP verified successfully' },
        data: { $ref: '#/components/schemas/AuthResponseDto' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP',
    type: ValidationErrorDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async verifyOtp(@Body() dto: OtpVerificationDto): Promise<AuthResponseDto> {
    return this.authService.verifyOtp(dto);
  }

  @Post('onboarding')
  @ApiOperation({ summary: 'Complete user onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data or missing required fields',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async completeOnboarding(@Body() dto: OnboardingDto): Promise<AuthResponseDto> {
    return this.authService.completeOnboarding(dto);
  }

  @Post('upload-photo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a photo during onboarding' })
  @ApiResponse({
    status: 200,
    description: 'Photo uploaded successfully',
    type: PhotoUploadResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file or upload failed',
  })
  async uploadPhoto(@UploadedFile() file: Express.Multer.File): Promise<PhotoUploadResponseDto> {
    return this.authService.uploadPhoto(file);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP for verification' })
  @ApiResponse({
    status: 200,
    description: 'OTP resent successfully',
    type: OtpResendResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or rate limit exceeded',
  })
  async resendOtp(@Body() dto: OtpResendDto): Promise<OtpResendResponseDto> {
    return this.authService.resendOtp(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout user',
    description: "Invalidate the user's refresh token and log them out",
  })
  @ApiResponse({
    status: 200,
    description: 'Logged out successfully',
    type: BaseResponseDto,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Logged out successfully' },
        data: { type: 'null' },
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
  async logout(): Promise<BaseResponseDto<null>> {
    await this.authService.logout();
    return new BaseResponseDto(HttpStatus.OK, 'Logged out successfully', null);
  }

  @Post('become-creator')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Become a creator',
    description: 'Upgrade user account to creator status. Only available to regular users.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully upgraded to creator',
    type: BaseResponseDto,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Successfully upgraded to creator' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            roles: { type: 'array', items: { type: 'string' }, example: ['USER', 'CREATOR'] },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @ApiResponse({
    status: 403,
    description: 'User already has creator role or is an affiliate',
    type: ForbiddenErrorDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async becomeCreator(
    @CurrentUser() user: { sub: string },
  ): Promise<BaseResponseDto<{ id: string; roles: string[] }>> {
    const data = await this.authService.becomeCreator(user.sub);
    return new BaseResponseDto(HttpStatus.OK, 'Successfully upgraded to creator', data);
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
  async getProfile(@CurrentUser() user: { sub: string }): Promise<BaseResponseDto<UserProfileDto>> {
    const profile = await this.userService.findById(user.sub);
    return new BaseResponseDto(HttpStatus.OK, 'Profile retrieved successfully', profile);
  }
}
