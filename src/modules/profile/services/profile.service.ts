import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UpdateBasicInfoDto } from '../dto/update-basic-info.dto';
import { UpdatePersonalDetailsDto } from '../dto/update-personal-details.dto';
import { UpdateProfessionalInfoDto } from '../dto/update-professional-info.dto';
import { UpdateInterestsPreferencesDto } from '../dto/update-interests-preferences.dto';
import { UpdatePrivacySettingsDto } from '../dto/update-privacy-settings.dto';
import { UpdateNotificationPreferencesDto } from '../dto/update-notification-preferences.dto';
import {
  Prisma,
  User,
  VerificationType,
  VerificationStatus,
  VerificationDocumentType,
} from '@prisma/client';
import { BaseService } from '../../../common/base/base.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { VerificationDocumentDto } from '../dto/verification-document.dto';
import { VerificationSessionDto } from '../dto/verification-session.dto';
import { RiskAssessmentService } from './risk-assessment.service';
import { FaceRecognitionService } from './face-recognition.service';
import { DocumentVerificationService } from './document-verification.service';
import { ProfileCompletionDto } from '../dto/profile-completion.dto';

interface VerificationDocument {
  id: string;
  type: VerificationDocumentType;
  verificationStatus: VerificationStatus;
  metadata: Prisma.JsonValue;
}

interface VerificationSession {
  id: string;
  type: VerificationType;
  status: VerificationStatus;
  metadata: Prisma.JsonValue;
}

@Injectable()
export class ProfileService extends BaseService<User, UpdateBasicInfoDto, UpdateBasicInfoDto> {
  protected readonly model = 'user' as Prisma.ModelName;
  protected readonly cacheKey = 'user_profile';
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly MAX_VERIFICATION_ATTEMPTS = 3;
  private readonly VERIFICATION_EXPIRY_DAYS = 30;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly redis: RedisService,
    private readonly riskAssessment: RiskAssessmentService,
    private readonly faceRecognition: FaceRecognitionService,
    private readonly documentVerification: DocumentVerificationService,
  ) {
    super(prisma, redis);
  }

  async getProfile(userId: string) {
    const cacheKey = `profile:${userId}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profilePicture: true,
        profilePhotos: true,
        verificationDocuments: {
          where: { verificationStatus: VerificationStatus.VERIFIED },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.redis.set(cacheKey, JSON.stringify(user));
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    if (!user.isVerified && this.requiresVerification(dto)) {
      throw new BadRequestException('Account verification required for this update');
    }

    const updateData: Prisma.UserUpdateInput = {
      ...dto,
      selfDescription: dto.selfDescription ? [dto.selfDescription] : undefined,
      valuesInOthers: dto.valuesInOthers ? [dto.valuesInOthers] : undefined,
      profilePhotos: dto.profilePhotos
        ? {
            create: dto.profilePhotos.map((url) => ({ url })),
          }
        : undefined,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await this.invalidateProfileCache(userId);
    return updatedUser;
  }

  async updateBasicInfo(userId: string, updateBasicInfoDto: UpdateBasicInfoDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateBasicInfoDto.firstName,
        lastName: updateBasicInfoDto.lastName,
        username: updateBasicInfoDto.username,
        bio: updateBasicInfoDto.bio,
        selfDescription: updateBasicInfoDto.selfDescription
          ? [updateBasicInfoDto.selfDescription]
          : undefined,
        valuesInOthers: updateBasicInfoDto.valuesInOthers
          ? [updateBasicInfoDto.valuesInOthers]
          : undefined,
      },
    });

    await this.invalidateCache(`${this.cacheKey}:${userId}`);
    return user;
  }

  async updatePersonalDetails(userId: string, updatePersonalDetailsDto: UpdatePersonalDetailsDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        gender: updatePersonalDetailsDto.gender,
        dob: updatePersonalDetailsDto.dob,
        preferences: {
          update: {
            nationality: updatePersonalDetailsDto.nationality,
            zodiacSign: updatePersonalDetailsDto.zodiacSign,
            relationshipStatus: updatePersonalDetailsDto.relationshipStatus,
            lookingFor: updatePersonalDetailsDto.lookingFor,
          },
        },
      },
    });

    await this.invalidateCache(`${this.cacheKey}:${userId}`);
    return user;
  }

  async updateProfessionalInfo(
    userId: string,
    updateProfessionalInfoDto: UpdateProfessionalInfoDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          update: {
            education: updateProfessionalInfoDto.education as unknown as Prisma.InputJsonValue,
            workExperience:
              updateProfessionalInfoDto.workExperience as unknown as Prisma.InputJsonValue,
            skills: updateProfessionalInfoDto.skills as unknown as Prisma.InputJsonValue,
          },
        },
      },
    });

    await this.invalidateCache(`${this.cacheKey}:${userId}`);
    return user;
  }

  async updateInterestsPreferences(
    userId: string,
    updateInterestsPreferencesDto: UpdateInterestsPreferencesDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        interests: updateInterestsPreferencesDto.interests,
        preferences: {
          update: {
            languages: updateInterestsPreferencesDto.languages as unknown as Prisma.InputJsonValue,
            matchPreferences:
              updateInterestsPreferencesDto.matchPreferences as unknown as Prisma.InputJsonValue,
            vibeCheck: updateInterestsPreferencesDto.vibeCheck as unknown as Prisma.InputJsonValue,
          },
        },
      },
    });

    await this.invalidateCache(`${this.cacheKey}:${userId}`);
    return user;
  }

  async updatePrivacySettings(userId: string, updatePrivacySettingsDto: UpdatePrivacySettingsDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        privacy: updatePrivacySettingsDto as unknown as Prisma.InputJsonValue,
      },
    });

    await this.invalidateCache(`${this.cacheKey}:${userId}`);
    return user;
  }

  async updateNotificationPreferences(
    userId: string,
    updateNotificationPreferencesDto: UpdateNotificationPreferencesDto,
  ) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences:
          updateNotificationPreferencesDto as unknown as Prisma.InputJsonValue,
      },
    });

    await this.invalidateCache(`${this.cacheKey}:${userId}`);
    return user;
  }

  async getProfileCompletion(userId: string): Promise<ProfileCompletionDto> {
    const profile = await this.getProfile(userId);
    const completion = new ProfileCompletionDto();

    // Calculate completion details
    completion.details = {
      basicInfo: {
        firstName: !!profile.firstName,
        lastName: !!profile.lastName,
        username: !!profile.username,
        bio: !!profile.bio,
      },
      personalDetails: {
        dateOfBirth: !!profile.dateOfBirth,
        gender: !!profile.gender,
        nationality: profile.nationality,
        location: !!profile.location,
        interests: !!profile.interests?.length,
      },
      professionalInfo: {
        occupation: !!profile.occupation,
        education: !!profile.education,
        skills: !!profile.skills?.length,
        languages: !!profile.languages?.length,
      },
      photos: {
        profilePhoto: !!profile.profilePicture,
        coverPhoto: !!profile.coverPhoto,
        gallery: !!profile.gallery?.length,
      },
      settings: {
        privacy: !!profile.privacySettings,
        notifications: !!profile.notificationPreferences,
        preferences: !!profile.preferences,
      },
    };

    // Calculate completion stats
    const allFields = Object.values(completion.details).flatMap((section) =>
      Object.values(section).filter((value) => typeof value === 'boolean'),
    );
    completion.totalFields = allFields.length;
    completion.completedFields = allFields.filter(Boolean).length;
    completion.completionPercentage = Math.round(
      (completion.completedFields / completion.totalFields) * 100,
    );

    return completion;
  }

  async initiateVerification(userId: string, type: VerificationType) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Check verification attempts
    if (user.verificationAttempts >= this.MAX_VERIFICATION_ATTEMPTS) {
      throw new BadRequestException('Maximum verification attempts reached');
    }

    // Create verification session
    const session = await this.prisma.verificationSession.create({
      data: {
        userId,
        type,
        sessionToken: this.generateSessionToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    return session;
  }

  async submitVerificationDocument(userId: string, dto: VerificationDocumentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Verify document authenticity
    const verificationResult = await this.documentVerification.verifyDocument(dto);

    // Create verification document record
    const document = await this.prisma.verificationDocument.create({
      data: {
        userId,
        type: dto.type,
        documentNumber: dto.documentNumber,
        countryOfIssue: dto.countryOfIssue,
        expiryDate: dto.expiryDate,
        documentUrl: dto.documentUrl,
        selfieUrl: dto.selfieUrl,
        verificationStatus: verificationResult.isValid
          ? VerificationStatus.VERIFIED
          : VerificationStatus.REJECTED,
        metadata: (verificationResult.metadata || {}) as Prisma.InputJsonValue,
        verifiedAt: verificationResult.isValid ? new Date() : null,
        rejectedAt: !verificationResult.isValid ? new Date() : null,
        rejectionReason: !verificationResult.isValid ? verificationResult.reason : null,
      },
    });

    // Update user verification status
    if (verificationResult.isValid) {
      await this.updateUserVerificationStatus(userId);
    }

    return document;
  }

  async completeVerificationSession(
    userId: string,
    sessionId: string,
    dto: VerificationSessionDto,
  ) {
    const session = await this.prisma.verificationSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Verification session not found');
    }

    if (session.status !== VerificationStatus.PENDING) {
      throw new BadRequestException('Invalid session status');
    }

    if (new Date() > session.expiresAt) {
      throw new BadRequestException('Session expired');
    }

    let verificationResult;
    switch (session.type) {
      case VerificationType.FACE_RECOGNITION:
        if (!dto.faceData) throw new BadRequestException('Face data is required');
        verificationResult = await this.faceRecognition.verifyFace(dto.faceData);
        break;
      case VerificationType.PHOTO:
        if (!dto.photoUrl) throw new BadRequestException('Photo URL is required');
        verificationResult = await this.faceRecognition.verifyPhoto(dto.photoUrl);
        break;
      case VerificationType.VIDEO:
        if (!dto.videoUrl) throw new BadRequestException('Video URL is required');
        verificationResult = await this.faceRecognition.verifyVideo(dto.videoUrl);
        break;
      default:
        throw new BadRequestException('Unsupported verification type');
    }

    const updatedSession = await this.prisma.verificationSession.update({
      where: { id: sessionId },
      data: {
        status: verificationResult.isValid
          ? VerificationStatus.VERIFIED
          : VerificationStatus.REJECTED,
        completedAt: new Date(),
        metadata: verificationResult.metadata as Prisma.InputJsonValue,
      },
    });

    if (verificationResult.isValid) {
      await this.updateUserVerificationStatus(userId);
    }

    return updatedSession;
  }

  private async updateUserVerificationStatus(userId: string) {
    const verificationDocuments = await this.prisma.verificationDocument.findMany({
      where: {
        userId,
        verificationStatus: VerificationStatus.VERIFIED,
      },
    });

    const verificationSessions = await this.prisma.verificationSession.findMany({
      where: {
        userId,
        status: VerificationStatus.VERIFIED,
      },
    });

    // Calculate verification score based on verified documents and sessions
    const verificationScore = this.calculateVerificationScore(
      verificationDocuments,
      verificationSessions,
    );

    // Update user verification status
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus:
          verificationScore >= 80 ? VerificationStatus.VERIFIED : VerificationStatus.IN_PROGRESS,
        isVerified: verificationScore >= 80,
        verificationScore,
        lastVerificationAt: new Date(),
        verificationExpiresAt: new Date(
          Date.now() + this.VERIFICATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
        ),
      },
    });

    // Perform risk assessment
    await this.riskAssessment.assessUserRisk(userId);
  }

  private calculateVerificationScore(
    documents: VerificationDocument[],
    sessions: VerificationSession[],
  ): number {
    let score = 0;

    // Document verification points
    const documentPoints: Record<VerificationDocumentType, number> = {
      [VerificationDocumentType.ID_CARD]: 30,
      [VerificationDocumentType.PASSPORT]: 40,
      [VerificationDocumentType.DRIVERS_LICENSE]: 25,
      [VerificationDocumentType.RESIDENCE_PERMIT]: 20,
    };

    // Session verification points
    const sessionPoints: Record<VerificationType, number> = {
      [VerificationType.FACE_RECOGNITION]: 30,
      [VerificationType.PHOTO]: 20,
      [VerificationType.VIDEO]: 25,
      [VerificationType.PHONE]: 15,
      [VerificationType.EMAIL]: 10,
      [VerificationType.DOCUMENT]: 35,
    };

    // Calculate document score
    documents.forEach((doc) => {
      score += documentPoints[doc.type] || 0;
    });

    // Calculate session score
    sessions.forEach((session) => {
      score += sessionPoints[session.type] || 0;
    });

    return Math.min(score, 100);
  }

  private requiresVerification(dto: UpdateProfileDto): boolean {
    // Define which profile updates require verification
    const verifiedFields = [
      'username',
      'bio',
      'interests',
      'location',
      'selfDescription',
      'valuesInOthers',
    ];

    return Object.keys(dto).some((key) => !verifiedFields.includes(key));
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private async invalidateProfileCache(userId: string): Promise<void> {
    await this.redis.del(`profile:${userId}`);
  }
}
