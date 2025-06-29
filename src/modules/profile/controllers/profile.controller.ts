import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles, UserRole } from '../../auth/decorators/roles.decorator';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateBasicInfoDto } from '../dto/update-basic-info.dto';
import { UpdatePersonalDetailsDto } from '../dto/update-personal-details.dto';
import { UpdateProfessionalInfoDto } from '../dto/update-professional-info.dto';
import { UpdateInterestsPreferencesDto } from '../dto/update-interests-preferences.dto';
import { UpdatePrivacySettingsDto } from '../dto/update-privacy-settings.dto';
import { UpdateNotificationPreferencesDto } from '../dto/update-notification-preferences.dto';
import { VerificationDocumentDto } from '../dto/verification-document.dto';
import { VerificationSessionDto } from '../dto/verification-session.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import {
  BaseResponseDto,
  BaseValidationErrorDto as ValidationErrorDto,
  BaseUnauthorizedErrorDto as UnauthorizedErrorDto,
  BaseForbiddenErrorDto as ForbiddenErrorDto,
  BaseNotFoundErrorDto as NotFoundErrorDto,
  BaseInternalServerErrorDto as InternalServerErrorDto,
} from '../../../common/dto';
import { ApiResponse as SwaggerApiResponse } from '@nestjs/swagger';
import { ApiResponse as CommonApiResponse } from '../../../common/decorators/api-response.decorator';
import { UserProfileDto } from '../../users/dto/user-response.dto';
import { VerificationType } from '@prisma/client';
import { ProfileCompletionDto } from '../dto/profile-completion.dto';

@ApiTags('profile')
@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieve the authenticated user profile information',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async getProfile(@CurrentUser() user: { sub: string }) {
    const profile = await this.profileService.getProfile(user.sub);
    return new BaseResponseDto(HttpStatus.OK, 'Profile retrieved successfully', profile);
  }

  @Put()
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update the authenticated user profile information',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updateProfile(
    @CurrentUser() user: { sub: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedProfile = await this.profileService.updateProfile(user.sub, updateProfileDto);
    return new BaseResponseDto(HttpStatus.OK, 'Profile updated successfully', updatedProfile);
  }

  @Put('basic-info')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Update basic info', description: 'Update the user basic information' })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updateBasicInfo(
    @CurrentUser() user: { sub: string },
    @Body() updateBasicInfoDto: UpdateBasicInfoDto,
  ) {
    const updatedProfile = await this.profileService.updateBasicInfo(user.sub, updateBasicInfoDto);
    return new BaseResponseDto(HttpStatus.OK, 'Basic info updated successfully', updatedProfile);
  }

  @Put('personal-details')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Update personal details',
    description: 'Update the user personal details',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updatePersonalDetails(
    @CurrentUser() user: { sub: string },
    @Body() updatePersonalDetailsDto: UpdatePersonalDetailsDto,
  ) {
    const updatedProfile = await this.profileService.updatePersonalDetails(
      user.sub,
      updatePersonalDetailsDto,
    );
    return new BaseResponseDto(
      HttpStatus.OK,
      'Personal details updated successfully',
      updatedProfile,
    );
  }

  @Put('professional-info')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Update professional info',
    description: 'Update the user professional information',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updateProfessionalInfo(
    @CurrentUser() user: { sub: string },
    @Body() updateProfessionalInfoDto: UpdateProfessionalInfoDto,
  ) {
    const updatedProfile = await this.profileService.updateProfessionalInfo(
      user.sub,
      updateProfessionalInfoDto,
    );
    return new BaseResponseDto(
      HttpStatus.OK,
      'Professional info updated successfully',
      updatedProfile,
    );
  }

  @Put('interests-preferences')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Update interests and preferences',
    description: 'Update the user interests and preferences',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updateInterestsPreferences(
    @CurrentUser() user: { sub: string },
    @Body() updateInterestsPreferencesDto: UpdateInterestsPreferencesDto,
  ) {
    const updatedProfile = await this.profileService.updateInterestsPreferences(
      user.sub,
      updateInterestsPreferencesDto,
    );
    return new BaseResponseDto(
      HttpStatus.OK,
      'Interests and preferences updated successfully',
      updatedProfile,
    );
  }

  @Put('privacy-settings')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Update privacy settings',
    description: 'Update the user privacy settings',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updatePrivacySettings(
    @CurrentUser() user: { sub: string },
    @Body() updatePrivacySettingsDto: UpdatePrivacySettingsDto,
  ) {
    const updatedProfile = await this.profileService.updatePrivacySettings(
      user.sub,
      updatePrivacySettingsDto,
    );
    return new BaseResponseDto(
      HttpStatus.OK,
      'Privacy settings updated successfully',
      updatedProfile,
    );
  }

  @Put('notification-preferences')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Update notification preferences',
    description: 'Update the user notification preferences',
  })
  @CommonApiResponse(UserProfileDto)
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async updateNotificationPreferences(
    @CurrentUser() user: { sub: string },
    @Body() updateNotificationPreferencesDto: UpdateNotificationPreferencesDto,
  ) {
    const updatedProfile = await this.profileService.updateNotificationPreferences(
      user.sub,
      updateNotificationPreferencesDto,
    );
    return new BaseResponseDto(
      HttpStatus.OK,
      'Notification preferences updated successfully',
      updatedProfile,
    );
  }

  @Get('completion')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Get profile completion status',
    description: 'Get the user profile completion status and details',
  })
  @CommonApiResponse(ProfileCompletionDto)
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async getProfileCompletion(
    @CurrentUser() user: { sub: string },
  ): Promise<BaseResponseDto<ProfileCompletionDto>> {
    const completion = await this.profileService.getProfileCompletion(user.sub);
    return new BaseResponseDto<ProfileCompletionDto>(
      HttpStatus.OK,
      'Profile completion status retrieved successfully',
      completion,
    );
  }

  @Post('verification/initiate')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Initiate verification',
    description: 'Start the verification process for the user',
  })
  @CommonApiResponse({ type: 'object' })
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async initiateVerification(@CurrentUser() user: { sub: string }, @Body('type') type: string) {
    const session = await this.profileService.initiateVerification(
      user.sub,
      type as VerificationType,
    );
    return new BaseResponseDto(HttpStatus.OK, 'Verification initiated successfully', session);
  }

  @Post('verification/document')
  @Roles(UserRole.USER)
  @UseInterceptors(FileInterceptor('document'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Submit verification document',
    description: 'Submit a document for verification',
  })
  @CommonApiResponse({ type: 'object' })
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async submitVerificationDocument(
    @CurrentUser() user: { sub: string },
    @Body() dto: VerificationDocumentDto,
  ) {
    const document = await this.profileService.submitVerificationDocument(user.sub, dto);
    return new BaseResponseDto(HttpStatus.OK, 'Document submitted successfully', document);
  }

  @Post('verification/complete')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Complete verification session',
    description: 'Complete a verification session with the provided data',
  })
  @CommonApiResponse({ type: 'object' })
  @SwaggerApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: ValidationErrorDto,
  })
  @SwaggerApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: UnauthorizedErrorDto,
  })
  @SwaggerApiResponse({
    status: 403,
    description: 'User does not have required role',
    type: ForbiddenErrorDto,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Profile not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async completeVerificationSession(
    @CurrentUser() user: { sub: string },
    @Body('sessionId') sessionId: string,
    @Body() dto: VerificationSessionDto,
  ) {
    const session = await this.profileService.completeVerificationSession(user.sub, sessionId, dto);
    return new BaseResponseDto(HttpStatus.OK, 'Verification completed successfully', session);
  }
}
