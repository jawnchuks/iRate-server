import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsNumber,
  MinLength,
  MaxLength,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class InitiateAuthDto {
  @ApiPropertyOptional({
    description: 'Email address for authentication',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number for authentication (international format)',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description: 'Google OAuth token for authentication',
    example: 'ya29.a0AfB_byC...',
  })
  @IsOptional()
  @IsString()
  googleToken?: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    description: 'One-time password (OTP) received via email or phone',
    example: '1234',
    minLength: 4,
    maxLength: 4,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  otp!: string;

  @ApiPropertyOptional({
    description: 'Email address used for authentication',
    example: 'user@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number used for authentication',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}

export class OtpVerificationDto {
  @ApiProperty({
    description: 'Email or phone number used for verification',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string = '';

  @ApiProperty({
    description: 'One-time password received via email or SMS',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  otp: string = '';
}

export class OtpResendDto {
  @ApiProperty({
    description: 'Email or phone number to resend OTP to',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string = '';
}

export class OnboardingDto {
  @ApiProperty({
    description: 'Request ID from the verification process',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  requestId: string = '';

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string = '';

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string = '';

  @ApiProperty({
    description: "User's age",
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age: number = 0;

  @ApiProperty({
    description: "User's gender",
    enum: ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY'],
    example: 'MALE',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender = Gender.OTHER;

  @ApiProperty({
    description: 'Array of self-description tags',
    example: ['Friendly', 'Outgoing', 'Creative'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  selfDescription: string[] = [];

  @ApiProperty({
    description: 'Array of values user looks for in others',
    example: ['Honesty', 'Kindness', 'Intelligence'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  valuesInOthers: string[] = [];

  @ApiProperty({
    description: 'User visibility preferences',
    example: {
      isVisibleInSearch: true,
      isVisibleToNearby: true,
      isVisibleToRecommended: true,
    },
  })
  @IsNotEmpty()
  visibility: {
    isVisibleInSearch: boolean;
    isVisibleToNearby: boolean;
    isVisibleToRecommended: boolean;
  } = {
    isVisibleInSearch: true,
    isVisibleToNearby: true,
    isVisibleToRecommended: true,
  };
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token for obtaining a new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken!: string;
}
