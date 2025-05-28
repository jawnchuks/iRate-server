import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import databaseConfig from '../../config/database.config';

// Import other modules as needed

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    EmailModule,
    AuthModule,
    ChatModule,
    DiscoveryModule,
    PrismaModule,
    UsersModule,

    // Add other modules here
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
