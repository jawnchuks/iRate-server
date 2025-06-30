import { ApiProperty } from '@nestjs/swagger';
import { UserProfileDto } from '../../users/dto/user-response.dto';

type MinimalUserFields = {
  id: string;
  email: string | null;
  onboardingComplete: boolean;
  roles: string[];
};

export class MinimalUserDto {
  @ApiProperty({ description: 'User ID', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@example.com', nullable: true })
  email: string | null;

  @ApiProperty({ description: 'Onboarding complete', example: false })
  onboardingComplete: boolean;

  @ApiProperty({ description: 'User roles', example: ['USER'], isArray: true })
  roles: string[];

  constructor(user: MinimalUserFields) {
    this.id = user.id;
    this.email = user.email;
    this.onboardingComplete = user.onboardingComplete;
    this.roles = user.roles;
  }
}

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
    description: 'User information (minimal for onboarding, full for onboarded users)',
    oneOf: [
      { $ref: '#/components/schemas/MinimalUserDto' },
      { $ref: '#/components/schemas/UserProfileDto' },
    ],
  })
  user: MinimalUserDto | UserProfileDto;

  constructor(accessToken: string, refreshToken: string, user: MinimalUserDto | UserProfileDto) {
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
