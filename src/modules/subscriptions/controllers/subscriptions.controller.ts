import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { SubscriptionsService } from '../services/subscriptions.service';
import {
  CreateSubscriptionDto,
  SubscriptionResponseDto,
  SubscriptionPlanDto,
  PaymentHistoryDto,
} from '../dto/subscription.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BaseResponseDto } from '../../../common/dto/base-response.dto';
import { HttpStatus } from '@nestjs/common';

interface RequestWithUser extends Request {
  user: {
    id: string;
  };
}

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(SubscriptionResponseDto, SubscriptionPlanDto, PaymentHistoryDto)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all available subscription plans' })
  @ApiResponse({
    status: 200,
    description: 'Returns all active subscription plans',
    type: () => BaseResponseDto<SubscriptionPlanDto[]>,
  })
  async getSubscriptionPlans(): Promise<BaseResponseDto<SubscriptionPlanDto[]>> {
    const plans = await this.subscriptionsService.getSubscriptionPlans();
    return new BaseResponseDto<SubscriptionPlanDto[]>(
      HttpStatus.OK,
      'Subscription plans retrieved successfully',
      plans,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
    type: () => BaseResponseDto<SubscriptionResponseDto>,
  })
  async createSubscription(
    @Request() req: RequestWithUser,
    @Body() dto: CreateSubscriptionDto,
  ): Promise<BaseResponseDto<SubscriptionResponseDto>> {
    const subscription = await this.subscriptionsService.createSubscription(req.user.id, dto);
    return new BaseResponseDto<SubscriptionResponseDto>(
      HttpStatus.CREATED,
      'Subscription created successfully',
      subscription,
    );
  }

  @Post('toggle-mock')
  @ApiOperation({
    summary: 'Toggle current user subscription between STANDARD and PREMIUM (mock/testing only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Toggles the user subscription tier and returns the updated subscription',
    type: () => BaseResponseDto<SubscriptionResponseDto>,
  })
  async toggleMockSubscription(
    @Request() req: RequestWithUser,
  ): Promise<BaseResponseDto<SubscriptionResponseDto>> {
    const subscription = await this.subscriptionsService.toggleUserSubscription(req.user.id);
    return new BaseResponseDto<SubscriptionResponseDto>(
      HttpStatus.OK,
      'Subscription tier toggled',
      subscription,
    );
  }

  @Get('current')
  @ApiOperation({ summary: 'Get current user subscription' })
  @ApiResponse({
    status: 200,
    description: "Returns the current user's active subscription",
    type: () => BaseResponseDto<SubscriptionResponseDto | null>,
  })
  async getCurrentSubscription(
    @Request() req: RequestWithUser,
  ): Promise<BaseResponseDto<SubscriptionResponseDto | null>> {
    const subscription = await this.subscriptionsService.getUserSubscription(req.user.id);
    return new BaseResponseDto<SubscriptionResponseDto | null>(
      HttpStatus.OK,
      'Current subscription retrieved successfully',
      subscription,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel a subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription cancelled successfully',
    type: () => BaseResponseDto<void>,
  })
  async cancelSubscription(
    @Request() req: RequestWithUser,
    @Param('id') subscriptionId: string,
  ): Promise<BaseResponseDto<void>> {
    await this.subscriptionsService.cancelSubscription(req.user.id, subscriptionId);
    return new BaseResponseDto<void>(
      HttpStatus.OK,
      'Subscription cancelled successfully',
      undefined,
    );
  }

  @Get('payment-history')
  @ApiOperation({ summary: 'Get subscription payment history' })
  @ApiResponse({
    status: 200,
    description: 'Returns the payment history for the current user',
    type: () => BaseResponseDto<PaymentHistoryDto[]>,
  })
  async getPaymentHistory(
    @Request() req: RequestWithUser,
  ): Promise<BaseResponseDto<PaymentHistoryDto[]>> {
    const history = await this.subscriptionsService.getPaymentHistory(req.user.id);
    return new BaseResponseDto<PaymentHistoryDto[]>(
      HttpStatus.OK,
      'Payment history retrieved successfully',
      history,
    );
  }
}
