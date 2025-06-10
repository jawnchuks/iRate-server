import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;
  private readonly OTP_PREFIX = 'otp:';
  private readonly OTP_EXPIRY = 300; // 5 minutes

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get('REDIS_URL');
    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined in environment variables');
    }
    this.redis = new Redis(redisUrl);
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, expiry?: number): Promise<void> {
    if (expiry) {
      await this.redis.set(key, value, 'EX', expiry);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.redis.ttl(key);
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

  // Add other Redis methods as needed
}
