import { Module, forwardRef } from '@nestjs/common';
import { RatingController } from './controllers/rating.controller';
import { RatingService } from './services/rating.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [PrismaModule, RedisModule, forwardRef(() => SubscriptionsModule)],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule {}
