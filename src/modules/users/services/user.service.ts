import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UserFilterDto } from '../dto/user-filter.dto';
import { UserProfileDto, PaginatedResponseDto } from '../dto/user-response.dto';
import { Prisma, User, UserRole } from '@prisma/client';
import { UpdatePreferencesDto } from '../dto/user-preferences.dto';
import { UpdatePrivacyDto } from '../dto/user-privacy.dto';

interface UserWithPhotos extends User {
  profilePhotos: { id: string; url: string; isProfilePicture: boolean; createdAt: Date }[];
  profilePicture: { id: string; url: string; isProfilePicture: boolean; createdAt: Date } | null;
  profession?: string;
}

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
          { username: { contains: filter.search, mode: 'insensitive' } },
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

  async findAll(filter: UserFilterDto): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getTrendingUsers(filter: UserFilterDto): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        updatedAt: { gte: sevenDaysAgo },
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getTopRatedUsers(filter: UserFilterDto): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        totalRatings: { gt: 0 },
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getFreshFaces(filter: UserFilterDto): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        createdAt: { gte: sevenDaysAgo },
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getUnratedUsers(filter: UserFilterDto): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        totalRatings: 0,
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getRatedUsers(filter: UserFilterDto): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        totalRatings: { gt: 0 },
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  async getSuggestedUsers(
    userId: string,
    filter: UserFilterDto,
  ): Promise<PaginatedResponseDto<UserProfileDto>> {
    const { page = 1, limit = 10 } = filter;
    const skip = (page - 1) * limit;

    // Get user's preferences and interests
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        interests: true,
        gender: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let query: Prisma.UserFindManyArgs = {
      where: {
        isActive: true,
        deletedAt: null,
        id: { not: userId },
        interests: {
          hasSome: user.interests,
        },
      },
      skip,
      take: limit,
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    };

    query = await this.applyFilters(query, filter);
    query = await this.applySorting(query, filter);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany(query),
      this.prisma.user.count({ where: query.where }),
    ]);

    const userDtos = users.map((user) => this.mapUserToDto(user as UserWithPhotos));
    return this.getPaginatedResponse(userDtos, total, page, limit);
  }

  private mapUserToDto(user: UserWithPhotos): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
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
      lookingFor: '', // To be populated from preferences
      vibeCheck: [], // To be populated from preferences
      profilePhotos: user.profilePhotos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        isProfilePicture: photo.isProfilePicture,
        createdAt: photo.createdAt,
      })),
      profilePicture: user.profilePicture
        ? {
            id: user.profilePicture.id,
            url: user.profilePicture.url,
            isProfilePicture: user.profilePicture.isProfilePicture,
            createdAt: user.profilePicture.createdAt,
          }
        : null,
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

  async findById(id: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapUserToDto(user as UserWithPhotos);
  }

  async findByUsername(username: string): Promise<UserProfileDto> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        profilePhotos: true,
        profilePicture: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return this.mapUserToDto(user as UserWithPhotos);
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
