import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RatingModule } from '../rating/rating.module';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../users/user.module';
import { ProfileModule } from '../profile/profile.module';
import databaseConfig from '../../config/database.config';
import { ChatModule } from '../chat/chat.module';
import { NotificationModule } from '../notifications/notification.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    AuthModule,
    PrismaModule,
    RatingModule,
    RedisModule,
    UserModule,
    ProfileModule,
    ChatModule,
    NotificationModule,
    SubscriptionsModule,
    PaymentModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
