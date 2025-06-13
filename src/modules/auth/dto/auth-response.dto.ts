import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string', nullable: true },
      phoneNumber: { type: 'string', nullable: true },
      firstName: { type: 'string', nullable: true },
      lastName: { type: 'string', nullable: true },
      username: { type: 'string', nullable: true },
      bio: { type: 'string', nullable: true },
      gender: { type: 'string', enum: ['MALE', 'FEMALE', 'OTHER'] },
      dob: { type: 'string', format: 'date-time', nullable: true },
      age: { type: 'number' },
      selfDescription: { type: 'array', items: { type: 'string' } },
      valuesInOthers: { type: 'array', items: { type: 'string' } },
      interests: { type: 'array', items: { type: 'string' } },
      location: {
        type: 'object',
        properties: {
          latitude: { type: 'number' },
          longitude: { type: 'number' },
        },
        nullable: true,
      },
      averageRating: { type: 'number' },
      totalRatings: { type: 'number' },
      roles: { type: 'array', items: { type: 'string', enum: ['USER', 'CREATOR', 'AFFILIATE'] } },
      notificationPreferences: {
        type: 'object',
        properties: {
          email: { type: 'boolean' },
          push: { type: 'boolean' },
          sms: { type: 'boolean' },
        },
      },
      preferences: {
        type: 'object',
        properties: {
          language: { type: 'string' },
          timezone: { type: 'string' },
          notifications: {
            type: 'object',
            properties: {
              email: { type: 'boolean' },
              push: { type: 'boolean' },
              sms: { type: 'boolean' },
            },
          },
        },
      },
      privacy: {
        type: 'object',
        properties: {
          isProfilePublic: { type: 'boolean' },
          areRatingsPublic: { type: 'boolean' },
          isLocationPublic: { type: 'boolean' },
          isContactPublic: { type: 'boolean' },
        },
      },
      visibility: {
        type: 'object',
        properties: {
          isVisibleInSearch: { type: 'boolean' },
          isVisibleToNearby: { type: 'boolean' },
          isVisibleToRecommended: { type: 'boolean' },
        },
      },
      settings: {
        type: 'object',
        properties: {
          theme: { type: 'string' },
          emailNotifications: { type: 'boolean' },
          pushNotifications: { type: 'boolean' },
          smsNotifications: { type: 'boolean' },
        },
      },
      onboardingComplete: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      deletedAt: { type: 'string', format: 'date-time', nullable: true },
    },
  })
  user: User;

  constructor(accessToken: string, refreshToken: string, user: User) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}

export class PhotoUploadResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the uploaded photo',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  uploadId: string;

  @ApiProperty({
    description: 'URL of the uploaded photo',
    example: 'https://cloudinary.com/image/upload/v1234567890/photo.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Array of uploaded photo URLs',
    type: [String],
    example: ['https://cloudinary.com/image/upload/v1234567890/photo.jpg'],
  })
  photoUrls: string[];

  constructor(uploadId: string, url: string) {
    this.uploadId = uploadId;
    this.url = url;
    this.photoUrls = [url];
  }
}

export class OtpVerificationResponseDto {
  @ApiProperty({
    description: 'Whether the OTP was verified successfully',
    example: true,
  })
  verified: boolean;

  @ApiProperty({
    description: 'Request ID for the verification process',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  requestId: string;

  constructor(verified: boolean, requestId: string) {
    this.verified = verified;
    this.requestId = requestId;
  }
}

export class OtpResendResponseDto {
  @ApiProperty({
    description: 'Request ID for the verification process',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  requestId: string;

  @ApiProperty({
    description: 'Time remaining before OTP expires (in seconds)',
    example: 300,
  })
  expiresIn: number;

  constructor(requestId: string, expiresIn: number) {
    this.requestId = requestId;
    this.expiresIn = expiresIn;
  }
}
