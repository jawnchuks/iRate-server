import { Gender, UserPhoto, Prisma } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface CurrentUser {
  userId: string;
  email: string;
}

export type UserProfile = {
  id?: string;
  email?: string;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dob?: Date | null;
  gender?: Gender | null;
  selfDescription?: string[];
  valuesInOthers?: string[];
  whoCanSeeRatings?: string | null;
  notificationPreferences?: Prisma.JsonValue | null;
  preferences?: UserPreferences | null;
  privacy?: UserPrivacy | null;
  visibility?: UserVisibility | null;
  settings?: UserSettings | null;
  onboardingComplete?: boolean;
  profileCompletionPercentage?: number;
  profilePhotos?: UserPhoto[];
  profilePictureId?: string | null;
  profilePicture?: UserPhoto | null;
  username?: string | null;
  bio?: string | null;
  interests?: string[];
  location?: Prisma.JsonValue | null;
  averageRating?: number;
  totalRatings?: number;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role?: string;
  isActive?: boolean;
  deactivatedAt?: Date | null;
  deletedAt?: Date | null;
};

export interface UserPreferencesDto {
  interests?: string[];
  preferredGender?: string;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface UserPrivacy {
  isProfilePublic: boolean;
  areRatingsPublic: boolean;
  isLocationPublic: boolean;
  isContactPublic: boolean;
}

export interface UserVisibility {
  isVisibleInSearch: boolean;
  isVisibleToNearby: boolean;
  isVisibleToRecommended: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export interface ProfileCompletion {
  basicInfo: number;
  preferences: number;
  privacy: number;
  visibility: number;
  total: number;
}

export interface ProfileRequirements {
  basicInfo: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  preferences: {
    language: string | null;
    timezone: string | null;
    notifications: string | null;
  };
  privacy: {
    isProfilePublic: string | null;
    areRatingsPublic: string | null;
    isLocationPublic: string | null;
    isContactPublic: string | null;
  };
  visibility: {
    isVisibleInSearch: string | null;
    isVisibleToNearby: string | null;
    isVisibleToRecommended: string | null;
  };
}
