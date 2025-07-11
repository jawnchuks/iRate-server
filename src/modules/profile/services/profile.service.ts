import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { Prisma, User, Gender } from '@prisma/client';
import { BaseService } from '../../../common/base/base.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CloudinaryService } from '../../../common/utils/cloudinary';
import { calculateProfileCompletionPercentage } from '../../../common/utils';

@Injectable()
export class ProfileService extends BaseService<User, UpdateProfileDto, UpdateProfileDto> {
  protected readonly model = 'user' as Prisma.ModelName;
  protected readonly cacheKey = 'user_profile';
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly redis: RedisService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    super(prisma, redis);
  }

  async getProfile(userId: string) {
    const cacheKey = `profile:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        media: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.redis.set(cacheKey, JSON.stringify(user));
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Map string fields to enums where necessary
    let gender: Gender | undefined = undefined;
    if (dto.gender && Object.values(Gender).includes(dto.gender as Gender)) {
      gender = dto.gender as Gender;
    }

    const updateData: Prisma.UserUpdateInput = {
      bio: dto.bio,
      interests: dto.interests,
      languages: dto.languages, // <-- Add this line
      lookingFor: dto.lookingFor, // <-- Add this line
      vibeCheckAnswers: dto.vibeCheckAnswers, // <-- Add this line
      height: dto.height, // <-- Add this line
      location: dto.location,
      selfDescription: dto.selfDescription ? [dto.selfDescription] : undefined,
      valuesInOthers: dto.valuesInOthers ? [dto.valuesInOthers] : undefined,
      profilePicture: dto.profilePicture,
      gender,
      nationality: dto.nationality,
      religion: dto.religion,
      ethnicity: dto.ethnicity,
      zodiacSign: dto.zodiacSign,
      relationshipStatus: dto.relationshipStatus,
      school: dto.school,
      work: dto.work,
      privacy: dto.privacy,
      preferences: dto.preferences,
      notificationPreferences: dto.notificationPreferences,
      visibility: dto.visibility,
      // Do NOT include media, displayName, biggestWin, mission, energyEmoji, passions, settings
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    // Fetch user with media for profile completion calculation
    const updatedUserWithMedia = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { media: true },
    });

    // Calculate and update profile completion percentage using the new utility
    let profileCompletionPercentage = 0;
    if (updatedUserWithMedia) {
      profileCompletionPercentage = calculateProfileCompletionPercentage(updatedUserWithMedia);
    }

    // If profile is sufficiently complete, set isVerified and verificationStatus
    let verificationFields: Prisma.UserUpdateInput = {};
    if (profileCompletionPercentage >= 80) {
      verificationFields = {
        isVerified: true,
        verificationStatus: 'VERIFIED',
      };
    }
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        profileCompletionPercentage,
        ...verificationFields,
      },
    });

    await this.invalidateProfileCache(userId);
    return updatedUser;
  }

  async uploadUserMedia(userId: string, file: Express.Multer.File): Promise<string> {
    // Upload to Cloudinary
    const result = await this.cloudinaryService.uploadFile(file);
    // Save to user's media
    await this.prisma.media.create({
      data: {
        url: result.secure_url,
        userId,
        type: file.mimetype.startsWith('video/') ? 'VIDEO' : 'IMAGE',
      },
    });
    // Invalidate cache
    await this.invalidateProfileCache(userId);
    return result.secure_url;
  }

  async getUserMediaCount(userId: string): Promise<number> {
    return this.prisma.media.count({ where: { userId } });
  }

  async deleteUserMedia(userId: string, mediaId: string): Promise<void> {
    // Find the media
    const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
    if (!media || media.userId !== userId) {
      throw new Error('Media not found or does not belong to user');
    }
    // Delete from DB
    await this.prisma.media.delete({ where: { id: mediaId } });
    await this.invalidateProfileCache(userId);
  }

  private async invalidateProfileCache(userId: string): Promise<void> {
    await this.redis.del(`profile:${userId}`);
  }
}
