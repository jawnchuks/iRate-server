import { Module, forwardRef } from '@nestjs/common';
import { ChatController, ChatRequestController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './gateways/chat.gateway';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { CloudinaryService } from '../../common/utils/cloudinary';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => SubscriptionsModule),
  ],
  controllers: [ChatController, ChatRequestController],
  providers: [ChatService, ChatGateway, CloudinaryService],
  exports: [ChatService],
})
export class ChatModule {}
