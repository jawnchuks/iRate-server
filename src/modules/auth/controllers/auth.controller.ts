import { Controller, Post, Body, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { AuthService } from '../services';
import { JwtAuthGuard } from '../../../common/guards';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
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
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/email')
  @ApiOperation({ summary: 'Register with email' })
  @ApiBody({ type: RegisterEmailDto })
  async registerEmail(@Body() dto: RegisterEmailDto) {
    return this.authService.registerEmail(dto);
  }

  @Post('register/phone')
  @ApiOperation({ summary: 'Register with phone number' })
  @ApiBody({ type: RegisterPhoneDto })
  async registerPhone(@Body() dto: RegisterPhoneDto) {
    return this.authService.registerPhone(dto);
  }

  @Post('register/google')
  @ApiOperation({ summary: 'Register with Google' })
  @ApiBody({ type: RegisterGoogleDto })
  async registerGoogle(@Body() dto: RegisterGoogleDto) {
    return this.authService.registerGoogle(dto);
  }

  @Post('login/email')
  @ApiOperation({ summary: 'Login with email' })
  @ApiBody({ type: LoginEmailDto })
  async loginEmail(@Body() dto: LoginEmailDto) {
    return this.authService.loginEmail(dto);
  }

  @Post('login/phone')
  @ApiOperation({ summary: 'Login with phone number and OTP' })
  @ApiBody({ type: LoginPhoneDto })
  async loginPhone(@Body() dto: LoginPhoneDto) {
    return this.authService.loginPhone(dto);
  }

  @Post('login/google')
  @ApiOperation({ summary: 'Login with Google' })
  @ApiBody({ type: LoginGoogleDto })
  async loginGoogle(@Body() dto: LoginGoogleDto) {
    return this.authService.loginGoogle(dto);
  }

  @Post('verify/email')
  @ApiOperation({ summary: 'Verify email with code' })
  @ApiBody({ type: VerifyEmailDto })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('verify/phone')
  @ApiOperation({ summary: 'Verify phone with OTP' })
  @ApiBody({ type: VerifyPhoneDto })
  async verifyPhone(@Body() dto: VerifyPhoneDto) {
    return this.authService.verifyPhone(dto);
  }

  @Post('onboarding')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Complete user onboarding' })
  @ApiBody({ type: OnboardingDto })
  async completeOnboarding(@Req() req: Request, @Body() dto: OnboardingDto) {
    return this.authService.completeOnboarding((req.user as { userId: string }).userId, dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Profile retrieved successfully',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
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
    description: 'Unauthorized',
    schema: {
      properties: {
        success: { type: 'boolean', example: false },
        error: { type: 'string' },
      },
    },
  })
  async getProfile(@Req() req: Request) {
    return this.authService.getProfile((req.user as { userId: string }).userId);
  }
}
