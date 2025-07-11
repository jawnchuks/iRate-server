import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UserFilterDto } from '../dto/user-filter.dto';
import {
  UserProfileDto,
  PaginatedResponseDto,
  PublicUserProfileDto,
} from '../dto/user-response.dto';
import { Prisma, User, UserRole } from '@prisma/client';
import { UpdatePreferencesDto } from '../dto/user-preferences.dto';
import { UpdatePrivacyDto } from '../dto/user-privacy.dto';

interface UserPreferences {
  language?: string;
  timezone?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
}

interface UserPrivacy {
  isProfilePublic?: boolean;
  areRatingsPublic?: boolean;
  isLocationPublic?: boolean;
  isContactPublic?: boolean;
}

interface UserVisibility {
  isVisibleInSearch: boolean;
  isVisibleToNearby: boolean;
  isVisibleToRecommended: boolean;
}

interface UserSettings {
  theme: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
}

@Injectable()
export class UserService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly TRENDING_CACHE_KEY = 'trending_users';
  private readonly TOP_RATED_CACHE_KEY = 'top_rated_users';
  private readonly FRESH_FACES_CACHE_KEY = 'fresh_faces';
  private readonly UNRATED_CACHE_KEY = 'unrated_users';
  private readonly RATED_CACHE_KEY = 'rated_users';

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private async getCachedUsers(key: string): Promise<UserProfileDto[] | null> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  private async setCachedUsers(key: string, users: UserProfileDto[]): Promise<void> {
    await this.redis.set(key, JSON.stringify(users));
  }

  private async getPaginatedResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): Promise<PaginatedResponseDto<T>> {
    const totalPages = Math.ceil(total / limit);
    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  private async applyFilters(
    query: Prisma.UserFindManyArgs,
    filter: UserFilterDto,
  ): Promise<Prisma.UserFindManyArgs> {
    if (filter.gender) {
      query.where = { ...query.where, gender: filter.gender };
    }
    if (filter.minAge || filter.maxAge) {
      query.where = {
        ...query.where,
        dob: {
          ...(filter.minAge && {
            lte: new Date(Date.now() - filter.minAge * 365 * 24 * 60 * 60 * 1000),
          }),
          ...(filter.maxAge && {
            gte: new Date(Date.now() - filter.maxAge * 365 * 24 * 60 * 60 * 1000),
          }),
        },
      };
    }
    if (filter.profession) {
      query.where = {
        ...query.where,
        preferences: {
          path: ['profession'],
          string_contains: filter.profession,
        },
      };
    }
    if (filter.interest) {
      query.where = { ...query.where, interests: { has: filter.interest } };
    }
    if (filter.nationality) {
      query.where = {
        ...query.where,
        preferences: {
          path: ['nationality'],
          string_contains: filter.nationality,
        },
      };
    }
    if (filter.search) {
      query.where = {
        ...query.where,
        OR: [
          { firstName: { contains: filter.search, mode: 'insensitive' } },
          { lastName: { contains: filter.search, mode: 'insensitive' } },
          { email: { contains: filter.search, mode: 'insensitive' } },
        ],
      };
    }
    return query;
  }

  private async applySorting(
    query: Prisma.UserFindManyArgs,
    filter: UserFilterDto,
  ): Promise<Prisma.UserFindManyArgs> {
    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (filter.sortBy) {
      if (filter.sortBy === 'lastActive') {
        orderBy.updatedAt = filter.sortOrder || 'desc';
      } else {
        orderBy[filter.sortBy] = filter.sortOrder || 'desc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }
    return { ...query, orderBy };
  }

  async findAll(
    currentUserId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        id: { not: currentUserId },
      },
      skip,
      take: limit,
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getTrendingUsers(
    currentUserId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Optionally, sort by most ratings in the last 7 days for a more trending effect
    // For now, keep as updatedAt, but exclude current user
    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        updatedAt: { gte: sevenDaysAgo },
        id: { not: currentUserId },
      },
      skip,
      take: limit,
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getTopRatedUsers(
    currentUserId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        totalRatings: { gt: 0 },
        id: { not: currentUserId },
      },
      skip,
      take: limit,
      orderBy: {
        averageRating: 'desc',
      },
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    // Don't override orderBy if already set for top rated

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getFreshFaces(
    currentUserId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        createdAt: { gte: sevenDaysAgo },
        id: { not: currentUserId },
      },
      skip,
      take: limit,
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getUnratedUsers(
    currentUserId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    // Find users the current user has NOT rated, excluding self
    const ratedByMe = await this.prisma.rating.findMany({
      where: { raterId: currentUserId },
      select: { targetId: true },
    });
    const ratedByMeIds = ratedByMe.map((rating) => rating.targetId);

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        id: { not: currentUserId, notIn: ratedByMeIds.length > 0 ? ratedByMeIds : undefined },
      },
      skip,
      take: limit,
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getRatedUsers(
    currentUserId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    // Find users the current user HAS rated, excluding self
    const ratedByMe = await this.prisma.rating.findMany({
      where: { raterId: currentUserId },
      select: { targetId: true },
    });
    const ratedByMeIds = ratedByMe.map((rating) => rating.targetId);

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        id: {
          in:
            ratedByMeIds.length > 0 ? ratedByMeIds.filter((id) => id !== currentUserId) : undefined,
        },
      },
      skip,
      take: limit,
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getSuggestedUsers(
    userId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<PublicUserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    // Get users that the current user has rated
    const ratedByMe = await this.prisma.rating.findMany({
      where: { raterId: userId },
      select: { targetId: true },
    });
    const ratedByMeIds = ratedByMe.map((rating) => rating.targetId);

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        id: { not: userId }, // Exclude current user
        totalRatings: { gt: 0 }, // Has been rated by others
        ...(ratedByMeIds.length > 0 && {
          id: { notIn: ratedByMeIds }, // Exclude users I've already rated
        }),
      },
      skip,
      take: limit,
      include: { media: true }, // <-- Ensure media is included
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToPublicDto(user));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  private mapUserToDto(
    user: User & { media?: { url: string; type: string; caption?: string | null }[] },
  ): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      gender: user.gender,
      dob: user.dob,
      age: user.dob ? this.calculateAge(user.dob) : 0,
      selfDescription: (user.selfDescription as string[]) || [],
      valuesInOthers: (user.valuesInOthers as string[]) || [],
      interests: (user.interests as string[]) || [],
      sharedInterests: [], // To be populated based on requesting user
      languages: [], // To be populated from preferences
      zodiacSign: '', // To be populated from preferences
      relationshipStatus: '', // To be populated from preferences
      lookingFor: (user.lookingFor as string[]) || [], // To be populated from preferences
      vibeCheckAnswers: user.vibeCheckAnswers as string,
      height: user.height ?? undefined,
      media: Array.isArray(user.media)
        ? user.media.map((m) => ({ url: m.url, type: m.type, caption: m.caption ?? undefined }))
        : [],
      profilePhotos: [], // Keep for DTO compatibility
      averageRating: user.averageRating || 0,
      totalRatings: user.totalRatings || 0,
      roles: (user.roles as UserRole[]) || [],
      notificationPreferences: {
        email: (user.notificationPreferences as unknown as NotificationPreferences)?.email || false,
        push: (user.notificationPreferences as unknown as NotificationPreferences)?.push || false,
        sms: (user.notificationPreferences as unknown as NotificationPreferences)?.sms || false,
      },
      preferences: {
        language: (user.preferences as UserPreferences)?.language || 'en',
        timezone: (user.preferences as UserPreferences)?.timezone || 'UTC',
        notifications: {
          email: (user.preferences as UserPreferences)?.notifications?.email || false,
          push: (user.preferences as UserPreferences)?.notifications?.push || false,
          sms: (user.preferences as UserPreferences)?.notifications?.sms || false,
        },
      },
      privacy: {
        isProfilePublic: (user.privacy as UserPrivacy)?.isProfilePublic || false,
        areRatingsPublic: (user.privacy as UserPrivacy)?.areRatingsPublic || false,
        isLocationPublic: (user.privacy as UserPrivacy)?.isLocationPublic || false,
        isContactPublic: (user.privacy as UserPrivacy)?.isContactPublic || false,
      },
      visibility: {
        isVisibleInSearch:
          (user.visibility as unknown as UserVisibility)?.isVisibleInSearch || false,
        isVisibleToNearby:
          (user.visibility as unknown as UserVisibility)?.isVisibleToNearby || false,
        isVisibleToRecommended:
          (user.visibility as unknown as UserVisibility)?.isVisibleToRecommended || false,
      },
      settings: {
        theme: (user.settings as unknown as UserSettings)?.theme || 'system',
        emailNotifications: (user.settings as unknown as UserSettings)?.emailNotifications || false,
        pushNotifications: (user.settings as unknown as UserSettings)?.pushNotifications || false,
        smsNotifications: (user.settings as unknown as UserSettings)?.smsNotifications || false,
      },
      onboardingComplete: user.onboardingComplete || false,
      profileCompletionPercentage: user.profileCompletionPercentage || 0,
      emailVerified: user.emailVerified || false,
      phoneVerified: user.phoneVerified || false,
      isActive: user.isActive,
      deactivatedAt: user.deactivatedAt,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastActive: user.updatedAt,
    };
  }

  private mapUserToPublicDto(
    user: User & { media?: { url: string; type: string; caption?: string | null }[] },
  ): PublicUserProfileDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      gender: user.gender,
      age: user.dob ? this.calculateAge(user.dob) : 0,
      selfDescription: (user.selfDescription as string[]) || [],
      valuesInOthers: (user.valuesInOthers as string[]) || [],
      interests: (user.interests as string[]) || [],
      sharedInterests: [], // To be populated based on requesting user
      profilePhotos: [], // No longer used, but required by DTO
      averageRating: user.averageRating || 0,
      totalRatings: user.totalRatings || 0,
      profileCompletionPercentage: user.profileCompletionPercentage || 0,
      isVerified: user.isVerified || false,
      createdAt: user.createdAt,
      lastActive: user.updatedAt,
      media: Array.isArray(user.media)
        ? user.media.map((m) => ({ url: m.url, type: m.type, caption: m.caption ?? undefined }))
        : [],
    };
  }

  async findById(id: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { media: true }, // Ensure media is included
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapUserToDto(user);
  }

  async blockUser(userId: string, targetId: string): Promise<void> {
    await this.prisma.blockedUser.create({
      data: {
        blockerId: userId,
        blockedId: targetId,
      },
    });
  }

  async unblockUser(userId: string, targetId: string): Promise<void> {
    await this.prisma.blockedUser.delete({
      where: {
        blockerId_blockedId: {
          blockerId: userId,
          blockedId: targetId,
        },
      },
    });
  }

  async reportUser(
    userId: string,
    targetId: string,
    reason: string,
    details?: string,
  ): Promise<void> {
    await this.prisma.userReport.create({
      data: {
        reporterId: userId,
        reportedId: targetId,
        reason,
        details,
        reportType: 'USER',
      },
    });
  }

  async updatePreferences(userId: string, preferences: UpdatePreferencesDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const currentPreferences = (user.preferences as UserPreferences) || {};
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          ...currentPreferences,
          ...preferences,
        } as Prisma.InputJsonValue,
      },
    });

    await this.redis.del(`user:${userId}`);
  }

  async updatePrivacy(userId: string, privacy: UpdatePrivacyDto): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const currentPrivacy = (user.privacy as UserPrivacy) || {};
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        privacy: {
          ...currentPrivacy,
          ...privacy,
        } as Prisma.InputJsonValue,
      },
    });

    await this.redis.del(`user:${userId}`);
  }

  private calculateAge(dob: Date): number {
    const ageDifMs = Date.now() - dob.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}
