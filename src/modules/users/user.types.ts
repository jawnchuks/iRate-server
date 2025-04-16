import { Gender, UserPhoto, Rating } from '@prisma/client';

export type UserPreferences = {
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
};

export type UserSettings = {
  theme?: 'light' | 'dark' | 'system';
  fontSize?: 'small' | 'medium' | 'large';
  notifications?: {
    sound?: boolean;
    vibration?: boolean;
  };
};

export type UserPrivacy = {
  isProfilePublic?: boolean;
  areRatingsPublic?: boolean;
  isLocationPublic?: boolean;
  isContactPublic?: boolean;
};

export type UserVisibility = {
  isVisibleInSearch?: boolean;
  isVisibleToNearby?: boolean;
  isVisibleToRecommended?: boolean;
};

export type UserProfile = {
  id: string;
  email: string;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  dob: Date | null;
  gender: Gender | null;
  selfDescription: string[];
  preferences: UserPreferences | null;
  settings: UserSettings | null;
  privacy: UserPrivacy | null;
  visibility: UserVisibility | null;
  profilePhotos: UserPhoto[];
  profilePicture: UserPhoto | null;
  givenRatings: Rating[];
  receivedRatings: Rating[];
  isActive: boolean;
  deactivatedAt: Date | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileCompletion = {
  basicInfo: number;
  preferences: number;
  privacy: number;
  visibility: number;
  total: number;
};

export type ProfileRequirements = {
  basicInfo: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
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
};
