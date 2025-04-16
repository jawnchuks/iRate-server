import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import {
  UserProfile,
  UserPreferences,
  UserPrivacy,
  UserVisibility,
  UserSettings,
  ProfileCompletion,
  ProfileRequirements,
} from '../../common/types/user.types';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profilePhotos: true,
        profilePicture: true,
        givenRatings: true,
        receivedRatings: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      preferences: this.parseJsonField<UserPreferences>(user.preferences),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy),
      visibility: this.parseJsonField<UserVisibility>(user.visibility),
      settings: this.parseJsonField<UserSettings>(user.settings),
    };
  }

  async getPublicProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profilePhotos: true,
        profilePicture: true,
        givenRatings: {
          where: {
            target: {
              whoCanSeeRatings: 'everyone',
            },
          },
        },
        receivedRatings: {
          where: {
            target: {
              whoCanSeeRatings: 'everyone',
            },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      preferences: this.parseJsonField<UserPreferences>(user.preferences),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy),
      visibility: this.parseJsonField<UserVisibility>(user.visibility),
      settings: this.parseJsonField<UserSettings>(user.settings),
    };
  }

  async isUserBlocked(userId: string, otherUserId: string): Promise<boolean> {
    const blocked = await this.prisma.blockedUser.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedId: otherUserId },
          { blockerId: otherUserId, blockedId: userId },
        ],
      },
    });
    return !!blocked;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
        preferences: dto.preferences ? JSON.stringify(dto.preferences) : undefined,
        privacy: dto.privacy ? JSON.stringify(dto.privacy) : undefined,
        visibility: dto.visibility ? JSON.stringify(dto.visibility) : undefined,
        settings: dto.settings ? JSON.stringify(dto.settings) : undefined,
      },
      include: {
        profilePhotos: true,
        profilePicture: true,
        givenRatings: true,
        receivedRatings: true,
      },
    });

    return {
      ...user,
      preferences: this.parseJsonField<UserPreferences>(user.preferences),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy),
      visibility: this.parseJsonField<UserVisibility>(user.visibility),
      settings: this.parseJsonField<UserSettings>(user.settings),
    };
  }

  async updatePreferences(userId: string, dto: UserPreferencesDto): Promise<UserProfile> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: {
          pushNotifications: dto.pushNotifications,
          emailNotifications: dto.emailNotifications,
          profileVisibility: dto.profileVisibility,
          hideRating: dto.hideRating,
          whoCanMessage: dto.whoCanMessage,
        },
      },
      include: {
        profilePhotos: true,
        profilePicture: true,
        givenRatings: true,
        receivedRatings: true,
      },
    });

    return {
      ...user,
      preferences: this.parseJsonField<UserPreferences>(user.preferences),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy),
      visibility: this.parseJsonField<UserVisibility>(user.visibility),
      settings: this.parseJsonField<UserSettings>(user.settings),
    };
  }

  async uploadPhoto(userId: string, file: Express.Multer.File): Promise<UserProfile> {
    const photo = await this.prisma.userPhoto.create({
      data: {
        url: file.path,
        userId,
        isProfilePicture: true,
      },
    });

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profilePictureId: photo.id },
      include: {
        profilePhotos: true,
        profilePicture: true,
        givenRatings: true,
        receivedRatings: true,
      },
    });

    return {
      ...user,
      preferences: this.parseJsonField<UserPreferences>(user.preferences),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy),
      visibility: this.parseJsonField<UserVisibility>(user.visibility),
      settings: this.parseJsonField<UserSettings>(user.settings),
    };
  }

  async deletePhoto(userId: string, photoId: string) {
    await this.prisma.userPhoto.delete({
      where: { id: photoId, userId },
    });
    return { deleted: true };
  }

  async blockUser(userId: string, dto: BlockUserDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Check if user to block exists
    const userToBlock = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!userToBlock) throw new NotFoundException('User to block not found');

    // Create block relationship
    await this.prisma.blockedUser.create({
      data: {
        blockerId: userId,
        blockedId: dto.userId,
        reason: dto.reason,
      },
    });

    // Delete any existing conversations
    await this.prisma.conversation.deleteMany({
      where: {
        OR: [
          { participant1Id: userId, participant2Id: dto.userId },
          { participant1Id: dto.userId, participant2Id: userId },
        ],
      },
    });

    return { blocked: true };
  }

  async reportUser(userId: string, dto: ReportUserDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Check if user to report exists
    const userToReport = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!userToReport) throw new NotFoundException('User to report not found');

    // Create report
    await this.prisma.userReport.create({
      data: {
        reporterId: userId,
        reportedId: dto.userId,
        reason: dto.reason,
        details: dto.details,
        reportType: 'user_report', // Default report type
      },
    });

    return { reported: true };
  }

  async deleteAccount(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Soft delete the user by updating fields
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        email: `deleted_${user.email}`,
        phoneNumber: user.phoneNumber ? `deleted_${user.phoneNumber}` : null,
        username: user.username ? `deleted_${user.username}` : null,
      },
    });

    // Delete all user photos
    await this.prisma.userPhoto.deleteMany({
      where: { userId },
    });

    // Delete all conversations
    await this.prisma.conversation.deleteMany({
      where: {
        OR: [{ participant1Id: userId }, { participant2Id: userId }],
      },
    });

    return { deleted: true };
  }

  async deactivateAccount(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update user status to deactivated
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: false,
      },
    });

    return { deactivated: true };
  }

  async reactivateAccount(userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Reactivate the account
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: true,
      },
    });

    return { reactivated: true };
  }

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return JSON.parse(user.preferences as string) as UserPreferences;
  }

  async getUserSettings(userId: string): Promise<UserSettings> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { settings: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return JSON.parse(user.settings as string) as UserSettings;
  }

  async getUserPrivacy(userId: string): Promise<UserPrivacy> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { privacy: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return JSON.parse(user.privacy as string) as UserPrivacy;
  }

  async updateUserPrivacy(
    userId: string,
    updatePrivacyDto: UpdatePrivacyDto,
  ): Promise<UserPrivacy> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { privacy: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPrivacy = JSON.parse(user.privacy as string) as UserPrivacy;
    const updatedPrivacy = { ...currentPrivacy, ...updatePrivacyDto };

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        privacy: JSON.stringify(updatedPrivacy),
      },
    });

    return updatedPrivacy;
  }

  async getUserVisibility(userId: string): Promise<UserVisibility> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { visibility: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return JSON.parse(user.visibility as string) as UserVisibility;
  }

  async updateUserVisibility(
    userId: string,
    updateVisibilityDto: UpdateVisibilityDto,
  ): Promise<UserVisibility> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { visibility: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentVisibility = JSON.parse(user.visibility as string) as UserVisibility;
    const updatedVisibility = { ...currentVisibility, ...updateVisibilityDto };

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        visibility: JSON.stringify(updatedVisibility),
      },
    });

    return updatedVisibility;
  }

  async getUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        isActive: true,
        deactivatedAt: true,
        deletedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      isActive: user.isActive,
      isDeactivated: !!user.deactivatedAt,
      isDeleted: !!user.deletedAt,
      deactivatedAt: user.deactivatedAt,
      deletedAt: user.deletedAt,
    };
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      language: '',
      timezone: '',
      notifications: {
        email: false,
        push: false,
        sms: false,
      },
    };
  }

  private getDefaultPrivacy(): UserPrivacy {
    return {
      isProfilePublic: false,
      areRatingsPublic: false,
      isLocationPublic: false,
      isContactPublic: false,
    };
  }

  private getDefaultVisibility(): UserVisibility {
    return {
      isVisibleInSearch: false,
      isVisibleToNearby: false,
      isVisibleToRecommended: false,
    };
  }

  async getProfileCompletion(userId: string): Promise<ProfileCompletion> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        preferences: true,
        privacy: true,
        visibility: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userProfile: Partial<UserProfile> = {
      ...user,
      preferences:
        this.parseJsonField<UserPreferences>(user.preferences) ?? this.getDefaultPreferences(),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy) ?? this.getDefaultPrivacy(),
      visibility:
        this.parseJsonField<UserVisibility>(user.visibility) ?? this.getDefaultVisibility(),
    };

    const completion = {
      basicInfo: this.calculateBasicInfoCompletion(userProfile),
      preferences: this.calculatePreferencesCompletion(
        userProfile.preferences ?? this.getDefaultPreferences(),
      ),
      privacy: this.calculatePrivacyCompletion(userProfile.privacy ?? this.getDefaultPrivacy()),
      visibility: this.calculateVisibilityCompletion(
        userProfile.visibility ?? this.getDefaultVisibility(),
      ),
    };

    return {
      ...completion,
      total: this.calculateTotalCompletion(completion),
    };
  }

  async getProfileRequirements(userId: string): Promise<ProfileRequirements> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        preferences: true,
        privacy: true,
        visibility: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userProfile: Partial<UserProfile> = {
      ...user,
      preferences:
        this.parseJsonField<UserPreferences>(user.preferences) ?? this.getDefaultPreferences(),
      privacy: this.parseJsonField<UserPrivacy>(user.privacy) ?? this.getDefaultPrivacy(),
      visibility:
        this.parseJsonField<UserVisibility>(user.visibility) ?? this.getDefaultVisibility(),
    };

    return {
      basicInfo: this.getBasicInfoRequirements(userProfile),
      preferences: this.getPreferencesRequirements(
        userProfile.preferences ?? this.getDefaultPreferences(),
      ),
      privacy: this.getPrivacyRequirements(userProfile.privacy ?? this.getDefaultPrivacy()),
      visibility: this.getVisibilityRequirements(
        userProfile.visibility ?? this.getDefaultVisibility(),
      ),
    };
  }

  private calculateBasicInfoCompletion(user: Partial<UserProfile>): number {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const completedFields = requiredFields.filter((field) => user[field as keyof UserProfile]);
    return (completedFields.length / requiredFields.length) * 100;
  }

  private calculatePreferencesCompletion(preferences: UserPreferences): number {
    const requiredFields = ['language', 'timezone', 'notifications'];
    const completedFields = requiredFields.filter(
      (field) => preferences[field as keyof UserPreferences],
    );
    return (completedFields.length / requiredFields.length) * 100;
  }

  private calculatePrivacyCompletion(privacy: UserPrivacy): number {
    const requiredFields = [
      'isProfilePublic',
      'areRatingsPublic',
      'isLocationPublic',
      'isContactPublic',
    ];
    const completedFields = requiredFields.filter(
      (field) => privacy[field as keyof UserPrivacy] !== undefined,
    );
    return (completedFields.length / requiredFields.length) * 100;
  }

  private calculateVisibilityCompletion(visibility: UserVisibility): number {
    const requiredFields = ['isVisibleInSearch', 'isVisibleToNearby', 'isVisibleToRecommended'];
    const completedFields = requiredFields.filter(
      (field) => visibility[field as keyof UserVisibility] !== undefined,
    );
    return (completedFields.length / requiredFields.length) * 100;
  }

  private calculateTotalCompletion(completion: Omit<ProfileCompletion, 'total'>): number {
    const weights = {
      basicInfo: 0.4,
      preferences: 0.2,
      privacy: 0.2,
      visibility: 0.2,
    };

    return Object.entries(completion).reduce(
      (total, [key, value]) => total + value * (weights[key as keyof typeof weights] || 0),
      0,
    );
  }

  private getBasicInfoRequirements(user: Partial<UserProfile>): ProfileRequirements['basicInfo'] {
    return {
      firstName: !user.firstName ? 'First name is required' : null,
      lastName: !user.lastName ? 'Last name is required' : null,
      email: !user.email ? 'Email is required' : null,
      phone: !user.phoneNumber ? 'Phone number is required' : null,
    };
  }

  private getPreferencesRequirements(
    preferences: UserPreferences,
  ): ProfileRequirements['preferences'] {
    return {
      language: !preferences.language ? 'Language preference is required' : null,
      timezone: !preferences.timezone ? 'Timezone is required' : null,
      notifications: !preferences.notifications ? 'Notification preferences are required' : null,
    };
  }

  private getPrivacyRequirements(privacy: UserPrivacy): ProfileRequirements['privacy'] {
    return {
      isProfilePublic:
        privacy.isProfilePublic === undefined ? 'Profile visibility setting is required' : null,
      areRatingsPublic:
        privacy.areRatingsPublic === undefined ? 'Ratings visibility setting is required' : null,
      isLocationPublic:
        privacy.isLocationPublic === undefined ? 'Location visibility setting is required' : null,
      isContactPublic:
        privacy.isContactPublic === undefined ? 'Contact visibility setting is required' : null,
    };
  }

  private getVisibilityRequirements(visibility: UserVisibility): ProfileRequirements['visibility'] {
    return {
      isVisibleInSearch:
        visibility.isVisibleInSearch === undefined ? 'Search visibility setting is required' : null,
      isVisibleToNearby:
        visibility.isVisibleToNearby === undefined ? 'Nearby visibility setting is required' : null,
      isVisibleToRecommended:
        visibility.isVisibleToRecommended === undefined
          ? 'Recommended visibility setting is required'
          : null,
    };
  }

  private parseJsonField<T>(value: Prisma.JsonValue): T | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return value as T;
  }
}
