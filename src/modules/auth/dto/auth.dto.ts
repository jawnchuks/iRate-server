import {
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
  IsNumber,
  MinLength,
  MaxLength,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class OnboardingDto {
  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  @IsString()
  lastName!: string;

  @ApiProperty({
    description: "User's age",
    example: 25,
    minimum: 18,
  })
  @IsNumber()
  age!: number;

  @ApiProperty({
    description: "User's gender",
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty({
    description: 'Array of strings describing the user',
    example: ['Adventurous', 'Creative', 'Friendly'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  selfDescription!: string[];

  @ApiProperty({
    description: 'Array of values the user looks for in others',
    example: ['Honesty', 'Intelligence', 'Kindness'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  valuesInOthers!: string[];

  @ApiProperty({
    description: "User's profile visibility setting",
    example: 'public',
    enum: ['public', 'private', 'friends'],
  })
  @IsString()
  visibility!: string;

  @ApiPropertyOptional({
    description: "Array of photo URLs for the user's profile",
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}

export class UploadPhotoDto {
  @ApiProperty({
    description: 'URL of the uploaded photo',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  photoUrl!: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token for obtaining a new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @ApiProperty({
    description: 'Refresh token to invalidate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken!: string;
}
