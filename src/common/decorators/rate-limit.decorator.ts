import { applyDecorators, UseGuards, SetMetadata } from '@nestjs/common';
import { RateLimitGuard } from '../guards/rate-limit.guard';

export interface RateLimitOptions {
  ttl: number;
  limit: number;
}

export const RATE_LIMIT_KEY = 'rateLimit';

export function RateLimit(options: RateLimitOptions) {
  return applyDecorators(
    SetMetadata(RATE_LIMIT_KEY, options),
    UseGuards(RateLimitGuard),
  );
}
