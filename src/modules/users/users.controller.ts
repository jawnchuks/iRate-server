import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserPreferencesDto } from './dto/user-preferences.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { ReportUserDto } from './dto/report-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserProfileDto } from './dto/user-profile.dto';
import { UpdatePrivacyDto } from './dto/update-privacy.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { ProfileCompletionDto } from './dto/profile-completion.dto';
import { ProfileRequirementsDto } from './dto/profile-requirements.dto';
import { UserStatusDto } from './dto/user-status.dto';
import { UserSettingsDto } from './dto/user-settings.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user profile',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Query('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @Get('profile/public')
  @ApiOperation({ summary: 'Get public user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the public user profile',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getPublicProfile(@Query('userId') userId: string) {
    return this.usersService.getPublicProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(@Query('userId') userId: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, updateProfileDto);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updatePreferences(
    @Query('userId') userId: string,
    @Body() userPreferencesDto: UserPreferencesDto,
  ) {
    return this.usersService.updatePreferences(userId, userPreferencesDto);
  }

  @Post('photos')
  @ApiOperation({ summary: 'Upload user photo' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    status: 201,
    description: 'Photo uploaded successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async uploadPhoto(@Query('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadPhoto(userId, file);
  }

  @Delete('photos/:photoId')
  @ApiOperation({ summary: 'Delete user photo' })
  @ApiResponse({
    status: 200,
    description: 'Photo deleted successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  async deletePhoto(@Query('userId') userId: string, @Param('photoId') photoId: string) {
    return this.usersService.deletePhoto(userId, photoId);
  }

  @Post('block')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({
    status: 201,
    description: 'User blocked successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async blockUser(@Query('userId') userId: string, @Body() blockUserDto: BlockUserDto) {
    return this.usersService.blockUser(userId, blockUserDto);
  }

  @Post('report')
  @ApiOperation({ summary: 'Report a user' })
  @ApiResponse({
    status: 201,
    description: 'User reported successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async reportUser(@Query('userId') userId: string, @Body() reportUserDto: ReportUserDto) {
    return this.usersService.reportUser(userId, reportUserDto);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deleted successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteAccount(@Query('userId') userId: string) {
    return this.usersService.deleteAccount(userId);
  }

  @Post('deactivate')
  @ApiOperation({ summary: 'Deactivate user account' })
  @ApiResponse({
    status: 200,
    description: 'Account deactivated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deactivateAccount(@Query('userId') userId: string) {
    return this.usersService.deactivateAccount(userId);
  }

  @Post('reactivate')
  @ApiOperation({ summary: 'Reactivate user account' })
  @ApiResponse({
    status: 200,
    description: 'Account reactivated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async reactivateAccount(@Query('userId') userId: string) {
    return this.usersService.reactivateAccount(userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Returns user preferences',
    type: UserPreferencesDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPreferences(@Query('userId') userId: string) {
    return this.usersService.getUserPreferences(userId);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get user settings' })
  @ApiResponse({
    status: 200,
    description: 'Returns user settings',
    type: UserSettingsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserSettings(@Query('userId') userId: string) {
    return this.usersService.getUserSettings(userId);
  }

  @Get('privacy')
  @ApiOperation({ summary: 'Get user privacy settings' })
  @ApiResponse({
    status: 200,
    description: 'Returns user privacy settings',
    type: UpdatePrivacyDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPrivacy(@Query('userId') userId: string) {
    return this.usersService.getUserPrivacy(userId);
  }

  @Patch('privacy')
  @ApiOperation({ summary: 'Update user privacy settings' })
  @ApiResponse({
    status: 200,
    description: 'Privacy settings updated successfully',
    type: UpdatePrivacyDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserPrivacy(
    @Query('userId') userId: string,
    @Body() updatePrivacyDto: UpdatePrivacyDto,
  ) {
    return this.usersService.updateUserPrivacy(userId, updatePrivacyDto);
  }

  @Get('visibility')
  @ApiOperation({ summary: 'Get user visibility settings' })
  @ApiResponse({
    status: 200,
    description: 'Returns user visibility settings',
    type: UpdateVisibilityDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserVisibility(@Query('userId') userId: string) {
    return this.usersService.getUserVisibility(userId);
  }

  @Patch('visibility')
  @ApiOperation({ summary: 'Update user visibility settings' })
  @ApiResponse({
    status: 200,
    description: 'Visibility settings updated successfully',
    type: UpdateVisibilityDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserVisibility(
    @Query('userId') userId: string,
    @Body() updateVisibilityDto: UpdateVisibilityDto,
  ) {
    return this.usersService.updateUserVisibility(userId, updateVisibilityDto);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get user account status' })
  @ApiResponse({
    status: 200,
    description: 'Returns user account status',
    type: UserStatusDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserStatus(@Query('userId') userId: string) {
    return this.usersService.getUserStatus(userId);
  }

  @Get('completion')
  @ApiOperation({ summary: 'Get profile completion status' })
  @ApiResponse({
    status: 200,
    description: 'Returns profile completion status',
    type: ProfileCompletionDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfileCompletion(@Query('userId') userId: string) {
    return this.usersService.getProfileCompletion(userId);
  }

  @Get('requirements')
  @ApiOperation({ summary: 'Get profile requirements' })
  @ApiResponse({
    status: 200,
    description: 'Returns profile requirements',
    type: ProfileRequirementsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfileRequirements(@Query('userId') userId: string) {
    return this.usersService.getProfileRequirements(userId);
  }
}
