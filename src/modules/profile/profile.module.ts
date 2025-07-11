import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { CloudinaryService } from '../../common/utils/cloudinary';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ProfileController],
  providers: [ProfileService, CloudinaryService],
  exports: [ProfileService],
})
export class ProfileModule {}
