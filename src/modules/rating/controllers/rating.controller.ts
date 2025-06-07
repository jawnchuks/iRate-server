import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { RatingService } from '../services/rating.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles, UserRole } from '../../auth/decorators/roles.decorator';
import { CreateRatingDto } from '../dto/create-rating.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
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
import { RatingResponseDto, RatingStatsDto } from '../dto/rating-response.dto';

@ApiTags('ratings')
@Controller('ratings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Post()
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Create a new rating',
    description: 'Create a new rating for a user',
  })
  @CommonApiResponse(RatingResponseDto)
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
    description: 'User to rate not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async createRating(
    @CurrentUser() user: { sub: string },
    @Body() createRatingDto: CreateRatingDto,
  ) {
    try {
      const rating = await this.ratingService.createRating(user.sub, createRatingDto);
      return new BaseResponseDto(HttpStatus.CREATED, 'Rating created successfully', rating);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to create rating', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Get user ratings',
    description: 'Get all ratings for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to get ratings for',
    example: 'user-uuid',
  })
  @CommonApiResponse(RatingResponseDto)
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
    description: 'User not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async getUserRatings(@Param('userId') userId: string) {
    try {
      const ratings = await this.ratingService.getUserRatings(userId);
      return new BaseResponseDto(HttpStatus.OK, 'Ratings retrieved successfully', ratings);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get ratings', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId/stats')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Get user rating stats',
    description: 'Get rating statistics for a specific user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to get rating stats for',
    example: 'user-uuid',
  })
  @CommonApiResponse(RatingStatsDto)
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
    description: 'User not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async getUserRatingStats(@Param('userId') userId: string) {
    try {
      const stats = await this.ratingService.getUserRatingStats(userId);
      return new BaseResponseDto(HttpStatus.OK, 'Rating stats retrieved successfully', stats);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Failed to get rating stats', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('can-rate/:userId')
  @Roles(UserRole.USER)
  @ApiOperation({
    summary: 'Check if user can rate',
    description: 'Check if the authenticated user can rate another user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The ID of the user to check rating eligibility for',
    example: 'user-uuid',
  })
  @CommonApiResponse({ type: 'object' })
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
    description: 'User not found',
    type: NotFoundErrorDto,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Internal server error',
    type: InternalServerErrorDto,
  })
  async canRateUser(@CurrentUser() user: { sub: string }, @Param('userId') targetUserId: string) {
    try {
      const canRate = await this.ratingService.canRateUser(user.sub, targetUserId);
      return new BaseResponseDto(HttpStatus.OK, 'Rating eligibility checked successfully', {
        canRate,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to check rating eligibility',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
