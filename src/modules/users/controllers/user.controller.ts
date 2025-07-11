import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UserService } from '../services/user.service';
import { UserFilterDto } from '../dto/user-filter.dto';
import {
  UserProfileDto,
  PaginatedResponseDto,
  PublicUserProfileDto,
} from '../dto/user-response.dto';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { UpdatePreferencesDto } from '../dto/user-preferences.dto';
import { UpdatePrivacyDto } from '../dto/user-privacy.dto';
import {
  BaseValidationErrorDto,
  BaseUnauthorizedErrorDto,
  BaseNotFoundErrorDto,
  BaseInternalServerErrorDto,
} from '../../../common/dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(UserProfileDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of users',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async findAll(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<UserProfileDto>>> {
    const users = await this.userService.findAll(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Users retrieved successfully', users);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending users' })
  @ApiResponse({ status: 200, description: 'Returns trending users', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getTrendingUsers(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<UserProfileDto>>> {
    const users = await this.userService.getTrendingUsers(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Trending users retrieved successfully', users);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Get top rated users' })
  @ApiResponse({ status: 200, description: 'Returns top rated users', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getTopRatedUsers(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<UserProfileDto>>> {
    const users = await this.userService.getTopRatedUsers(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Top rated users retrieved successfully', users);
  }

  @Get('fresh-faces')
  @ApiOperation({ summary: 'Get fresh faces (new users)' })
  @ApiResponse({ status: 200, description: 'Returns fresh faces', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getFreshFaces(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<UserProfileDto>>> {
    const users = await this.userService.getFreshFaces(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Fresh faces retrieved successfully', users);
  }

  @Get('unrated')
  @ApiOperation({ summary: 'Get unrated users' })
  @ApiResponse({ status: 200, description: 'Returns unrated users', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getUnratedUsers(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<UserProfileDto>>> {
    const users = await this.userService.getUnratedUsers(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Unrated users retrieved successfully', users);
  }

  @Get('rated')
  @ApiOperation({ summary: 'Get rated users' })
  @ApiResponse({ status: 200, description: 'Returns rated users', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getRatedUsers(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<UserProfileDto>>> {
    const users = await this.userService.getRatedUsers(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Rated users retrieved successfully', users);
  }

  @Get('suggested')
  @ApiOperation({ summary: "Get users I haven't rated but others have rated" })
  @ApiResponse({ status: 200, description: 'Returns users to rate', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getSuggestedUsers(
    @CurrentUser('userId') userId: string,
    @Query() filter: UserFilterDto,
  ): Promise<BaseResponseDto<PaginatedResponseDto<PublicUserProfileDto>>> {
    const users = await this.userService.getSuggestedUsers(userId, filter);
    return new BaseResponseDto(HttpStatus.OK, 'Users to rate retrieved successfully', users);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'Returns the user', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async findById(@Param('id') id: string): Promise<BaseResponseDto<UserProfileDto>> {
    const user = await this.userService.findById(id);
    return new BaseResponseDto(HttpStatus.OK, 'User retrieved successfully', user);
  }

  @Post(':id/block')
  @ApiOperation({ summary: 'Block a user' })
  @ApiResponse({ status: 200, description: 'User blocked successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async blockUser(
    @CurrentUser('userId') userId: string,
    @Param('id') targetId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.userService.blockUser(userId, targetId);
    return new BaseResponseDto(HttpStatus.OK, 'User blocked successfully', undefined);
  }

  @Post(':id/unblock')
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiResponse({ status: 200, description: 'User unblocked successfully', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async unblockUser(
    @CurrentUser('userId') userId: string,
    @Param('id') targetId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.userService.unblockUser(userId, targetId);
    return new BaseResponseDto(HttpStatus.OK, 'User unblocked successfully', undefined);
  }

  @Post(':id/report')
  @ApiOperation({ summary: 'Report a user' })
  @ApiResponse({ status: 200, description: 'User reported successfully', type: BaseResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request', type: BaseValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async reportUser(
    @CurrentUser('userId') userId: string,
    @Param('id') targetId: string,
    @Body('reason') reason: string,
    @Body('details') details?: string,
  ): Promise<BaseResponseDto<void>> {
    await this.userService.reportUser(userId, targetId, reason, details);
    return new BaseResponseDto(HttpStatus.OK, 'User reported successfully', undefined);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: BaseValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async updatePreferences(
    @CurrentUser('userId') userId: string,
    @Body() preferences: UpdatePreferencesDto,
  ): Promise<BaseResponseDto<void>> {
    await this.userService.updatePreferences(userId, preferences);
    return new BaseResponseDto(HttpStatus.OK, 'Preferences updated successfully', undefined);
  }

  @Patch('privacy')
  @ApiOperation({ summary: 'Update user privacy settings' })
  @ApiResponse({
    status: 200,
    description: 'Privacy settings updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: BaseValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'User not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async updatePrivacy(
    @CurrentUser('userId') userId: string,
    @Body() privacy: UpdatePrivacyDto,
  ): Promise<BaseResponseDto<void>> {
    await this.userService.updatePrivacy(userId, privacy);
    return new BaseResponseDto(HttpStatus.OK, 'Privacy settings updated successfully', undefined);
  }
}
