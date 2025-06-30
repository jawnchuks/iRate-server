import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { RedisService } from '../../../modules/redis/redis.service';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { RatingResponseDto, RatingStatsDto } from '../dto/rating-response.dto';
import { Rating } from '@prisma/client';

@Injectable()
export class RatingService {
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly RATING_COOLDOWN = 24 * 60 * 60; // 24 hours in seconds
  private readonly MIN_RATINGS_FOR_TRENDS = 5;
  private readonly MAX_DAILY_RATINGS = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async createRating(raterId: string, dto: CreateRatingDto): Promise<RatingResponseDto> {
    // Check if rater is verified
    const rater = await this.prisma.user.findUnique({ where: { id: raterId } });
    if (!rater || !rater.isVerified) {
      throw new BadRequestException('You must be verified to rate a user');
    }

    // Check if user has already rated
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        raterId,
        targetId: dto.targetId,
      },
    });
    if (existingRating) {
      throw new BadRequestException('You have already rated this user');
    }

    // Check if ratee exists
    const ratee = await this.prisma.user.findUnique({
      where: { id: dto.targetId },
    });
    if (!ratee) {
      throw new NotFoundException('User to rate not found');
    }

    // Check daily rating limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyRatings = await this.prisma.rating.count({
      where: {
        raterId,
        createdAt: {
          gte: today,
        },
      },
    });
    if (dailyRatings >= this.MAX_DAILY_RATINGS) {
      throw new BadRequestException('Daily rating limit reached');
    }

    // Create the rating (no review)
    const rating = await this.prisma.rating.create({
      data: {
        raterId,
        targetId: dto.targetId,
        score: dto.score,
      },
    });

    // Update user's average rating and total ratings
    await this.updateUserRatingStats(dto.targetId);

    // Invalidate cache
    await this.invalidateUserRatingCache(dto.targetId);

    return this.mapRatingToDto(rating);
  }

  async getUserRatings(userId: string): Promise<RatingResponseDto[]> {
    const ratings = await this.prisma.rating.findMany({
      where: {
        targetId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return ratings.map(this.mapRatingToDto);
  }

  async getUserRatingStats(userId: string): Promise<RatingStatsDto> {
    const cacheKey = `user:${userId}:rating-stats`;

    // Try to get from cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Get all ratings for user
    const ratings = await this.prisma.rating.findMany({
      where: {
        targetId: userId,
      },
    });

    // Calculate stats
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings : 0;

    // Calculate distribution
    const distribution: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      distribution[i] = ratings.filter((r) => r.score === i).length;
    }

    // Calculate recent trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRatings = ratings.filter((r) => r.createdAt >= thirtyDaysAgo);
    const recentTrends = this.calculateRecentTrends(recentRatings);

    const stats: RatingStatsDto = {
      averageRating,
      totalRatings,
      ratingDistribution: distribution,
      recentTrends,
    };

    // Cache the results
    await this.redis.set(cacheKey, JSON.stringify(stats));

    return stats;
  }

  async canRateUser(raterId: string, rateeId: string): Promise<boolean> {
    // Check if user has already rated
    const existingRating = await this.prisma.rating.findFirst({
      where: {
        raterId,
        targetId: rateeId,
      },
    });

    if (existingRating) {
      return false;
    }

    // Check cooldown period
    const lastRating = await this.prisma.rating.findFirst({
      where: {
        raterId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (lastRating) {
      const timeSinceLastRating = (Date.now() - lastRating.createdAt.getTime()) / 1000;
      if (timeSinceLastRating < this.RATING_COOLDOWN) {
        return false;
      }
    }

    // Check daily rating limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyRatings = await this.prisma.rating.count({
      where: {
        raterId,
        createdAt: {
          gte: today,
        },
      },
    });

    return dailyRatings < this.MAX_DAILY_RATINGS;
  }

  private async updateUserRatingStats(userId: string): Promise<void> {
    const ratings = await this.prisma.rating.findMany({
      where: {
        targetId: userId,
      },
    });
    const totalRatings = ratings.length;
    const averageRating =
      totalRatings > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings : 0;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        averageRating,
        totalRatings,
      },
    });
  }

  private async invalidateUserRatingCache(userId: string): Promise<void> {
    const keys = [`user:${userId}:rating-stats`, `user:${userId}:ratings`];
    await Promise.all(keys.map((key) => this.redis.del(key)));
  }

  private calculateRecentTrends(
    ratings: Rating[],
  ): Array<{ date: Date; averageRating: number; totalRatings: number }> {
    const trends: Array<{ date: Date; averageRating: number; totalRatings: number }> = [];
    const today = new Date();

    // Group ratings by day
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayRatings = ratings.filter((r) => {
        const ratingDate = new Date(r.createdAt);
        ratingDate.setHours(0, 0, 0, 0);
        return ratingDate.getTime() === date.getTime();
      });

      const totalRatings = dayRatings.length;
      const averageRating =
        totalRatings > 0 ? dayRatings.reduce((sum, r) => sum + r.score, 0) / totalRatings : 0;

      trends.push({
        date,
        averageRating,
        totalRatings,
      });
    }

    return trends.reverse();
  }

  private mapRatingToDto(rating: Rating): RatingResponseDto {
    return {
      id: rating.id,
      raterId: rating.raterId,
      rateeId: rating.targetId,
      score: rating.score,
      createdAt: rating.createdAt,
      updatedAt: rating.updatedAt,
    };
  }
}
