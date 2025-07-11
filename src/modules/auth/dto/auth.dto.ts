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
  @ApiProperty({
    description: 'Email address for authentication',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
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
    description: 'Email address used for verification',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'One-time password received via email',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(6)
  otp!: string;
}

export class OtpResendDto {
  @ApiProperty({
    description: 'Email to resend OTP to',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class OnboardingDto {
  @ApiProperty({
    description: 'Email address used for authentication',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Array of uploaded photo URLs for onboarding',
    example: ['https://cloudinary.com/image/upload/v1234567890/photo.jpg'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  photoUrls!: string[];

  @ApiProperty({
    description: "User's profile picture URL",
    example: 'https://cloudinary.com/image/upload/v1234567890/photo.jpg',
  })
  @IsNotEmpty()
  @IsString()
  profilePicture!: string;

  @ApiProperty({
    description: 'Array of uploaded media URLs (images, videos, etc.)',
    example: ['https://cloudinary.com/image/upload/v1234567890/photo.jpg'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  media!: string[];

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: "User's age",
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age!: number;

  @ApiProperty({
    description: "User's gender",
    enum: ['MALE', 'FEMALE', 'NON_BINARY', 'OTHER', 'PREFER_NOT_TO_SAY'],
    example: 'MALE',
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({
    description: 'Array of self-description tags',
    example: ['Friendly', 'Outgoing', 'Creative'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  selfDescription!: string[];

  @ApiProperty({
    description: 'Array of values user looks for in others',
    example: ['Honesty', 'Kindness', 'Intelligence'],
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  valuesInOthers!: string[];

  @ApiProperty({
    description: 'User visibility preferences',
    example: {
      isVisibleInSearch: true,
      isVisibleToNearby: true,
      isVisibleToRecommended: true,
    },
  })
  @IsNotEmpty()
  visibility!: {
    isVisibleInSearch: boolean;
    isVisibleToNearby: boolean;
    isVisibleToRecommended: boolean;
  };

  @ApiProperty({
    description: 'User location object',
    example: { lat: 6.5244, lng: 3.3792, state: 'Lagos', city: 'Lagos' },
  })
  @IsNotEmpty()
  location!: {
    lat: number;
    lng: number;
    state: string;
    city: string;
    [key: string]: string | number;
  };
}
