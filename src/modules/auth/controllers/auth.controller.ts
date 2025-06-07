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
import { OnboardingDto, InitiateAuthDto, VerifyOtpDto } from '../dto/auth.dto';
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
  async verifyOtp(@Body() dto: VerifyOtpDto): Promise<BaseResponseDto<AuthResponseDto>> {
    const data = await this.authService.verifyOtp(dto);
    return new BaseResponseDto(HttpStatus.OK, 'OTP verified successfully', data);
  }

  @Post('onboarding')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Complete user onboarding',
    description: 'Complete the user onboarding process with additional information',
  })
  @ApiResponse({
    status: 200,
    description: 'Onboarding completed successfully',
    schema: {
      allOf: [
        { $ref: '#/components/schemas/BaseResponseDto' },
        {
          properties: {
            data: {
              $ref: '#/components/schemas/AuthResponseDto',
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
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
  async completeOnboarding(
    @CurrentUser() user: { sub: string },
    @Body() dto: OnboardingDto,
  ): Promise<BaseResponseDto<AuthResponseDto>> {
    const data = await this.authService.completeOnboarding(user.sub, dto);
    return new BaseResponseDto(HttpStatus.OK, 'Onboarding completed successfully', data);
  }

  @Post('upload-photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload profile photo',
    description: 'Upload a profile photo for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Photo uploaded successfully',
    type: BaseResponseDto,
    schema: {
      properties: {
        statusCode: { type: 'number', example: 200 },
        message: { type: 'string', example: 'Photo uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            photoUrl: { type: 'string', example: 'https://example.com/photo.jpg' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid file format or size',
    type: ValidationErrorDto,
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
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @CurrentUser() user: { sub: string },
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BaseResponseDto<{ photoUrl: string }>> {
    const data = await this.authService.uploadPhoto(user.sub, file);
    return new BaseResponseDto(HttpStatus.OK, 'Photo uploaded successfully', {
      photoUrl: data.url,
    });
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
