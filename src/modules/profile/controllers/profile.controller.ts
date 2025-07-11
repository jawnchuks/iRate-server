import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles, UserRole } from '../../auth/decorators/roles.decorator';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
  async getProfile(@CurrentUser() user: { userId: string }) {
    const profile = await this.profileService.getProfile(user.userId);
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
    @CurrentUser() user: { userId: string },
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedProfile = await this.profileService.updateProfile(user.userId, updateProfileDto);
    return new BaseResponseDto(HttpStatus.OK, 'Profile updated successfully', updatedProfile);
  }

  @Post('upload-media')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Upload a single media file (image/video) to user profile' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({}), // In-memory, not saving to disk
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/gif',
          'video/mp4',
          'video/quicktime',
        ];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('Only image and video files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max per file
    }),
  )
  async uploadMedia(
    @CurrentUser() user: { userId: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file || !file.buffer || file.size === 0) {
      return {
        statusCode: 400,
        message: 'No file uploaded or file is empty. Please attach an image or video file.',
      };
    }
    const imageMax = 5 * 1024 * 1024;
    const videoMax = 20 * 1024 * 1024;
    if (file.mimetype.startsWith('image/') && file.size > imageMax) {
      return {
        statusCode: 400,
        message: `Image file "${file.originalname}" is too large. Max size is 5MB.`,
      };
    }
    if (file.mimetype.startsWith('video/') && file.size > videoMax) {
      return {
        statusCode: 400,
        message: `Video file "${file.originalname}" is too large. Max size is 20MB.`,
      };
    }
    // Enforce max 6 media per user
    const currentMediaCount = await this.profileService.getUserMediaCount(user.userId);
    if (currentMediaCount >= 6) {
      return {
        statusCode: 400,
        message:
          'You have reached the maximum of 6 media uploads. Please delete an existing media to upload a new one.',
      };
    }
    try {
      const url = await this.profileService.uploadUserMedia(user.userId, file);
      return { url };
    } catch (err) {
      return {
        statusCode: 500,
        message: `Failed to upload file "${file.originalname}": ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  @Delete('media/:mediaId')
  @Roles(UserRole.USER)
  @ApiOperation({ summary: 'Delete a specific media item from user profile' })
  async deleteMedia(@CurrentUser() user: { userId: string }, @Param('mediaId') mediaId: string) {
    try {
      await this.profileService.deleteUserMedia(user.userId, mediaId);
      return { message: 'Media deleted successfully.' };
    } catch (err) {
      return {
        statusCode: 500,
        message: `Failed to delete media: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }
}
