import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../modules/prisma/prisma.service';
import { RedisService } from '../../../modules/redis/redis.service';
import { User, VerificationDocument, VerificationSession } from '@prisma/client';

interface UserWithVerification extends User {
  verificationDocuments: VerificationDocument[];
  verificationSessions: VerificationSession[];
}

@Injectable()
export class RiskAssessmentService {
  private readonly CACHE_TTL = 3600; // 1 hour

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async assessUserRisk(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        verificationDocuments: true,
        verificationSessions: true,
      },
    });

    if (!user) return;

    const verificationScore = await this.calculateVerificationScore(user);
    const activityScore = await this.calculateActivityScore(user);
    const behaviorScore = await this.calculateBehaviorScore(user);

    const riskLevel = this.calculateRiskLevel(verificationScore, activityScore, behaviorScore);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        riskLevel,
        lastRiskAssessment: new Date(),
      },
    });
  }

  private async calculateVerificationScore(user: UserWithVerification): Promise<number> {
    const verifiedDocs = user.verificationDocuments.filter(
      (doc) => doc.verificationStatus === 'VERIFIED',
    ).length;
    const verifiedSessions = user.verificationSessions.filter(
      (session) => session.status === 'VERIFIED',
    ).length;

    return Math.min(verifiedDocs * 20 + verifiedSessions * 10, 100);
  }

  private async calculateActivityScore(user: UserWithVerification): Promise<number> {
    const accountAge = Date.now() - user.createdAt.getTime();
    const daysOld = Math.floor(accountAge / (1000 * 60 * 60 * 24));
    return Math.min(daysOld * 2, 100);
  }

  private async calculateBehaviorScore(user: UserWithVerification): Promise<number> {
    const reports = await this.prisma.userReport.count({
      where: { reportedId: user.id },
    });
    return Math.max(100 - reports * 20, 0);
  }

  private calculateRiskLevel(
    verificationScore: number,
    activityScore: number,
    behaviorScore: number,
  ): number {
    const totalScore = (verificationScore + activityScore + behaviorScore) / 3;
    return Math.round(totalScore);
  }
}
