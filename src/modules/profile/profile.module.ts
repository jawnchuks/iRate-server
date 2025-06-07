import { Module } from '@nestjs/common';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { RiskAssessmentService } from './services/risk-assessment.service';
import { FaceRecognitionService } from './services/face-recognition.service';
import { DocumentVerificationService } from './services/document-verification.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    RiskAssessmentService,
    FaceRecognitionService,
    DocumentVerificationService,
  ],
  exports: [ProfileService],
})
export class ProfileModule {}
