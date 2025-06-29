import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { NotificationService } from './services/notification.service';

@Module({
  imports: [ConfigModule, PrismaModule, RedisModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
