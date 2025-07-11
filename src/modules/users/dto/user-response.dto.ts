import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '@prisma/client';

export class UserPhotoDto {
  @ApiProperty({
    description: 'Photo ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Photo URL',
    example: 'https://example.com/photo.jpg',
  })
  url!: string;

  @ApiProperty({
    description: 'Whether this is the profile picture',
    example: true,
  })
  isProfilePicture!: boolean;

  @ApiProperty({
    description: 'When the photo was created',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt!: Date;
}

export class MediaDto {
  @ApiProperty({ description: 'Media URL', example: 'https://example.com/media.jpg' })
  url!: string;

  @ApiProperty({ description: 'Media type', example: 'IMAGE', enum: ['IMAGE', 'VIDEO', 'AUDIO'] })
  type!: string;

  @ApiProperty({ description: 'Media caption', example: 'Profile Picture', required: false })
  caption?: string;
}

export class PublicUserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  firstName!: string | null;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  lastName!: string | null;

  @ApiProperty({
    description: "User's bio",
    example: 'Software engineer and photography enthusiast',
  })
  bio!: string | null;

  @ApiProperty({
    description: "User's gender",
    enum: Gender,
    example: Gender.MALE,
  })
  gender!: Gender | null;

  @ApiProperty({
    description: "User's age",
    example: 33,
  })
  age!: number;

  @ApiProperty({
    description: "User's self-description words",
    example: ['creative', 'ambitious', 'friendly'],
    type: [String],
  })
  selfDescription!: string[];

  @ApiProperty({
    description: "User's values in others",
    example: ['honesty', 'loyalty', 'kindness'],
    type: [String],
  })
  valuesInOthers!: string[];

  @ApiProperty({
    description: "User's interests",
    example: ['photography', 'hiking', 'coding'],
    type: [String],
  })
  interests!: string[];

  @ApiProperty({
    description: "User's shared interests with the requesting user",
    example: ['photography', 'hiking'],
    type: [String],
  })
  sharedInterests!: string[];

  @ApiProperty({
    description: "User's profile photos",
    type: [UserPhotoDto],
  })
  profilePhotos!: UserPhotoDto[];

  @ApiProperty({
    description: "User's average rating",
    example: 4.5,
    minimum: 0,
    maximum: 10,
  })
  averageRating!: number;

  @ApiProperty({
    description: 'Total number of ratings received',
    example: 25,
  })
  totalRatings!: number;

  @ApiProperty({
    description: 'Profile completion percentage',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  profileCompletionPercentage!: number;

  @ApiProperty({
    description: 'Whether the user is verified',
    example: true,
  })
  isVerified!: boolean;

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the user was last active',
    example: '2024-01-01T00:00:00Z',
  })
  lastActive!: Date;

  @ApiProperty({
    description: "User's media files (images, videos, etc.)",
    type: [MediaDto],
    required: false,
  })
  media?: MediaDto[];
}

export class UserProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: "User's email address",
    example: 'john.doe@example.com',
  })
  email!: string | null;

  @ApiProperty({
    description: "User's phone number",
    example: '+1234567890',
  })
  phoneNumber!: string | null;

  @ApiProperty({
    description: "User's first name",
    example: 'John',
  })
  firstName!: string | null;

  @ApiProperty({
    description: "User's last name",
    example: 'Doe',
  })
  lastName!: string | null;

  @ApiProperty({
    description: "User's bio",
    example: 'Software engineer and photography enthusiast',
  })
  bio!: string | null;

  @ApiProperty({
    description: "User's gender",
    enum: Gender,
    example: Gender.MALE,
  })
  gender!: Gender | null;

  @ApiProperty({
    description: "User's date of birth",
    example: '1990-01-01',
  })
  dob!: Date | null;

  @ApiProperty({
    description: "User's age",
    example: 33,
  })
  age!: number;

  @ApiProperty({
    description: "User's self-description words",
    example: ['creative', 'ambitious', 'friendly'],
    type: [String],
  })
  selfDescription!: string[];

  @ApiProperty({
    description: "User's values in others",
    example: ['honesty', 'loyalty', 'kindness'],
    type: [String],
  })
  valuesInOthers!: string[];

  @ApiProperty({
    description: "User's interests",
    example: ['photography', 'hiking', 'coding'],
    type: [String],
  })
  interests!: string[];

  @ApiProperty({
    description: "User's shared interests with the requesting user",
    example: ['photography', 'hiking'],
    type: [String],
  })
  sharedInterests!: string[];

  @ApiProperty({
    description: "User's spoken languages",
    example: ['English', 'Spanish', 'French'],
    type: [String],
  })
  languages!: string[];

  @ApiProperty({
    description: "User's zodiac sign",
    example: 'Leo',
    enum: [
      'Aries',
      'Taurus',
      'Gemini',
      'Cancer',
      'Leo',
      'Virgo',
      'Libra',
      'Scorpio',
      'Sagittarius',
      'Capricorn',
      'Aquarius',
      'Pisces',
    ],
  })
  zodiacSign!: string;

  @ApiProperty({
    description: "User's relationship status",
    example: 'Single',
    enum: ['Single', 'In a Relationship', 'Married', 'Divorced', 'Widowed', 'Complicated'],
  })
  relationshipStatus!: string;

  @ApiProperty({
    description: "User's relationship preferences",
    example: ['Friendship', 'Casual Dating', 'Serious Relationship'],
    type: [String],
  })
  lookingFor!: string[];

  @ApiProperty({ description: "User's vibe check answer", required: false })
  vibeCheckAnswers?: string;

  @ApiProperty({ description: "User's height", required: false })
  height?: string;

  @ApiProperty({
    description: "User's media files (images, videos, etc.)",
    type: [MediaDto],
    required: false,
  })
  media?: MediaDto[];

  @ApiProperty({
    description: "User's profile photos",
    type: [UserPhotoDto],
  })
  profilePhotos!: UserPhotoDto[];

  @ApiProperty({
    description: "User's average rating",
    example: 4.5,
    minimum: 0,
    maximum: 10,
  })
  averageRating!: number;

  @ApiProperty({
    description: 'Total number of ratings received',
    example: 25,
  })
  totalRatings!: number;

  @ApiProperty({
    description: "User's roles",
    enum: UserRole,
    isArray: true,
    example: [UserRole.USER],
  })
  roles!: UserRole[];

  @ApiProperty({
    description: "User's notification preferences",
    example: {
      email: true,
      push: true,
      sms: true,
    },
  })
  notificationPreferences!: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  @ApiProperty({
    description: "User's preferences",
    example: {
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        sms: true,
      },
    },
  })
  preferences!: {
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };

  @ApiProperty({
    description: "User's privacy settings",
    example: {
      isProfilePublic: true,
      areRatingsPublic: true,
      isLocationPublic: false,
      isContactPublic: false,
    },
  })
  privacy!: {
    isProfilePublic: boolean;
    areRatingsPublic: boolean;
    isLocationPublic: boolean;
    isContactPublic: boolean;
  };

  @ApiProperty({
    description: "User's visibility settings",
    example: {
      isVisibleInSearch: true,
      isVisibleToNearby: true,
      isVisibleToRecommended: true,
    },
  })
  visibility!: {
    isVisibleInSearch: boolean;
    isVisibleToNearby: boolean;
    isVisibleToRecommended: boolean;
  };

  @ApiProperty({
    description: "User's settings",
    example: {
      theme: 'system',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
    },
  })
  settings!: {
    theme: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };

  @ApiProperty({
    description: 'Whether onboarding is complete',
    example: true,
  })
  onboardingComplete!: boolean;

  @ApiProperty({
    description: 'Profile completion percentage',
    example: 85,
    minimum: 0,
    maximum: 100,
  })
  profileCompletionPercentage!: number;

  @ApiProperty({
    description: 'Whether email is verified',
    example: true,
  })
  emailVerified!: boolean;

  @ApiProperty({
    description: 'Whether phone is verified',
    example: true,
  })
  phoneVerified!: boolean;

  @ApiProperty({
    description: 'Whether the user is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'When the user was deactivated',
    example: '2024-01-01T00:00:00Z',
    nullable: true,
  })
  deactivatedAt!: Date | null;

  @ApiProperty({
    description: 'When the user was deleted',
    example: '2024-01-01T00:00:00Z',
    nullable: true,
  })
  deletedAt!: Date | null;

  @ApiProperty({
    description: 'When the user was created',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the user was last updated',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt!: Date;

  @ApiProperty({
    description: 'When the user was last active',
    example: '2024-01-01T00:00:00Z',
  })
  lastActive!: Date;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    type: [UserProfileDto],
  })
  items!: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages!: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true,
  })
  hasNextPage!: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage!: boolean;
}
