import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface UploadData {
  url: string;
  timestamp: string;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly OTP_PREFIX = 'otp:';
  private readonly OTP_EXPIRY = 300; // 5 minutes
  private readonly uploadIdsKey = 'upload_ids';
  private readonly uploadDataPrefix = 'upload_data:';
  private readonly logger = new Logger(RedisService.name);

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get('REDIS_URL');
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in environment variables');
    }

    this.redis = new Redis(redisUrl, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        this.logger.log(`Redis connection attempt ${times}, retrying in ${delay}ms...`);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
    });

    this.redis.on('error', (error) => {
      this.logger.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
    });

    this.redis.on('reconnecting', () => {
      this.logger.log('Reconnecting to Redis...');
    });
  }

  async onModuleDestroy() {
    try {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    } catch (error: unknown) {
      this.logger.error('Error closing Redis connection:', error);
    }
  }

  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      this.logger.error('Redis operation failed:', error);
      throw new Error(
        `Redis operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async get(key: string): Promise<string | null> {
    return this.executeWithRetry(() => this.redis.get(key));
  }

  async set(key: string, value: string, expiry?: number): Promise<void> {
    await this.executeWithRetry(async () => {
      if (expiry) {
        await this.redis.set(key, value, 'EX', expiry);
      } else {
        await this.redis.set(key, value);
      }
    });
  }

  async del(key: string): Promise<void> {
    await this.executeWithRetry(() => this.redis.del(key));
  }

  async incr(key: string): Promise<number> {
    return this.executeWithRetry(() => this.redis.incr(key));
  }

  async decr(key: string): Promise<number> {
    return this.executeWithRetry(() => this.redis.decr(key));
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.executeWithRetry(() => this.redis.expire(key, seconds));
  }

  async ttl(key: string): Promise<number> {
    return this.executeWithRetry(() => this.redis.ttl(key));
  }

  async storeOTP(identifier: string, otp: string): Promise<void> {
    const key = `${this.OTP_PREFIX}${identifier}`;
    await this.set(key, otp, this.OTP_EXPIRY);
  }

  async verifyOTP(identifier: string, otp: string): Promise<boolean> {
    const key = `${this.OTP_PREFIX}${identifier}`;
    const storedOTP = await this.get(key);
    if (!storedOTP) return false;
    const isValid = storedOTP === otp;
    if (isValid) await this.del(key);
    return isValid;
  }

  async storeUploadId(uploadId: string, data: UploadData): Promise<void> {
    // Store the upload ID in a set
    await this.redis.sadd(this.uploadIdsKey, uploadId);
    // Store the upload data with the upload ID as key
    await this.redis.set(
      `${this.uploadDataPrefix}${uploadId}`,
      JSON.stringify(data),
      'EX',
      3600, // 1 hour expiry
    );
  }

  async getUploadIds(): Promise<string[]> {
    return this.redis.smembers(this.uploadIdsKey);
  }

  async getUploadData(uploadId: string): Promise<UploadData | null> {
    const data = await this.redis.get(`${this.uploadDataPrefix}${uploadId}`);
    return data ? JSON.parse(data) : null;
  }

  async clearUploadIds(): Promise<void> {
    const uploadIds = await this.getUploadIds();
    if (uploadIds.length > 0) {
      // Delete all upload data
      await Promise.all(uploadIds.map((id) => this.redis.del(`${this.uploadDataPrefix}${id}`)));
      // Delete the upload IDs set
      await this.redis.del(this.uploadIdsKey);
    }
  }

  async storeRequestId(identifier: string, requestId: string): Promise<void> {
    const key = `request:${identifier}`;
    await this.set(key, requestId, 3600); // 1 hour expiry
  }

  async getRequestId(identifier: string): Promise<string | null> {
    const key = `request:${identifier}`;
    return this.get(key);
  }

  async canResendOTP(identifier: string): Promise<boolean> {
    const key = `otp_resend:${identifier}`;
    const count = await this.get(key);
    return !count || parseInt(count) < 3; // Allow max 3 resends
  }

  async incrementResendCount(identifier: string): Promise<void> {
    const key = `otp_resend:${identifier}`;
    await this.incr(key);
    await this.expire(key, 3600); // 1 hour expiry
  }

  // Add other Redis methods as needed
}
