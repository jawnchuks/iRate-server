import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto, UpdateNotificationDto } from '../dto/notification.dto';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { Notification } from '../entities/notification.entity';
import {
  BaseValidationErrorDto,
  BaseUnauthorizedErrorDto,
  BaseNotFoundErrorDto,
  BaseInternalServerErrorDto,
} from '../../../common/dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: BaseValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<Notification>> {
    const notification = await this.notificationService.create(userId, createNotificationDto);
    return new BaseResponseDto<Notification>(
      HttpStatus.CREATED,
      'Notification created successfully',
      notification,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  @ApiResponse({ status: 200, description: 'Returns all notifications', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async findAll(@CurrentUser('userId') userId: string): Promise<BaseResponseDto<Notification[]>> {
    const notifications = await this.notificationService.findAll(userId);
    return new BaseResponseDto<Notification[]>(
      HttpStatus.OK,
      'Notifications retrieved successfully',
      notifications,
    );
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({
    status: 200,
    description: 'Returns unread notifications count',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async getUnreadCount(@CurrentUser('userId') userId: string): Promise<BaseResponseDto<number>> {
    const count = await this.notificationService.getUnreadCount(userId);
    return new BaseResponseDto<number>(
      HttpStatus.OK,
      'Unread notifications count retrieved successfully',
      count,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a notification by id' })
  @ApiResponse({ status: 200, description: 'Returns the notification', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Notification not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<Notification>> {
    const notification = await this.notificationService.findOne(id, userId);
    return new BaseResponseDto<Notification>(
      HttpStatus.OK,
      'Notification retrieved successfully',
      notification,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification updated successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: BaseValidationErrorDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Notification not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<Notification>> {
    const notification = await this.notificationService.update(id, userId, updateNotificationDto);
    return new BaseResponseDto<Notification>(
      HttpStatus.OK,
      'Notification updated successfully',
      notification,
    );
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read', type: BaseResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Notification not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<Notification>> {
    const notification = await this.notificationService.markAsRead(id, userId);
    return new BaseResponseDto<Notification>(
      HttpStatus.OK,
      'Notification marked as read',
      notification,
    );
  }

  @Patch('read/all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async markAllAsRead(@CurrentUser('userId') userId: string): Promise<BaseResponseDto<void>> {
    await this.notificationService.markAllAsRead(userId);
    return new BaseResponseDto<void>(HttpStatus.OK, 'All notifications marked as read', undefined);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: BaseUnauthorizedErrorDto })
  @ApiResponse({ status: 404, description: 'Notification not found', type: BaseNotFoundErrorDto })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: BaseInternalServerErrorDto,
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser('userId') userId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.notificationService.remove(id, userId);
    return new BaseResponseDto<void>(HttpStatus.OK, 'Notification deleted successfully', undefined);
  }
}
