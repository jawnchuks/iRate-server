import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../../modules/redis/redis.service';
import {
  RateLimitOptions,
  RATE_LIMIT_KEY,
} from '../decorators/rate-limit.decorator';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly redis: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );

    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const key = `rate-limit:${request.ip}`;
    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.expire(key, options.ttl);
    }

    return current <= options.limit;
  }
}
