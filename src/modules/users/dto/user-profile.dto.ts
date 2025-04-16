import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  UserPreferences,
  UserPrivacy,
  UserVisibility,
  UserSettings,
} from '../../../common/types/user.types';

export class UserProfileDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false, nullable: true })
  phoneNumber: string | null = null;

  @ApiProperty({ required: false, nullable: true })
  firstName: string | null = null;

  @ApiProperty({ required: false, nullable: true })
  lastName: string | null = null;

  @ApiProperty({ required: false, nullable: true })
  dob: Date | null = null;

  @ApiProperty({ required: false, nullable: true, enum: Gender })
  gender: Gender | null = null;

  @ApiProperty({ type: [String], required: false })
  selfDescription: string[] = [];

  @ApiProperty({ type: [String], required: false })
  valuesInOthers: string[] = [];

  @ApiProperty({ required: false, nullable: true })
  whoCanSeeRatings: string | null = null;

  @ApiProperty({ required: false })
  notificationPreferences: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  } = {};

  @ApiProperty({ required: false })
  preferences: UserPreferences | null = null;

  @ApiProperty({ required: false })
  privacy: UserPrivacy | null = null;

  @ApiProperty({ required: false })
  visibility: UserVisibility | null = null;

  @ApiProperty({ required: false })
  settings: UserSettings | null = null;

  @ApiProperty()
  onboardingComplete: boolean = false;

  @ApiProperty()
  profileCompletionPercentage: number = 0;

  @ApiProperty({ type: [String], required: false })
  profilePhotos: string[] = [];

  @ApiProperty({ required: false, nullable: true })
  profilePictureId: string | null = null;

  @ApiProperty({ required: false, nullable: true })
  profilePicture: string | null = null;

  @ApiProperty({ required: false, nullable: true })
  username: string | null = null;

  @ApiProperty({ required: false, nullable: true })
  bio: string | null = null;

  @ApiProperty({ type: [String], required: false })
  interests: string[] = [];

  @ApiProperty({ required: false, nullable: true })
  location: {
    latitude: number;
    longitude: number;
  } | null = null;

  @ApiProperty()
  averageRating: number = 0;

  @ApiProperty()
  totalRatings: number = 0;

  @ApiProperty()
  emailVerified: boolean = false;

  @ApiProperty()
  phoneVerified: boolean = false;

  @ApiProperty()
  role: string = 'user';

  @ApiProperty()
  isActive: boolean = true;
}
