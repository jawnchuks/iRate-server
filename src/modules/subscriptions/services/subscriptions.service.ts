import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { PaymentService } from '../../payment/services/payment.service';
import { ChatService } from '../../chat/services/chat.service';
import {
  CreateSubscriptionDto,
  SubscriptionResponseDto,
  SubscriptionPlanDto,
  PaymentHistoryDto,
} from '../dto/subscription.dto';
import { SubscriptionStatus, SubscriptionPlanType } from '../dto/subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly paymentService: PaymentService,
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
  ) {}

  async getSubscriptionPlans(): Promise<SubscriptionPlanDto[]> {
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
    });

    return plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      type: plan.type as SubscriptionPlanType,
      messagesPerMonth: plan.messagesPerMonth,
      isActive: plan.isActive,
    }));
  }

  async createSubscription(
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionResponseDto> {
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: dto.planId },
    });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    if (!plan.isActive) {
      throw new BadRequestException('This subscription plan is no longer active');
    }

    // Calculate subscription end date based on plan type
    const endDate = new Date();
    switch (plan.type) {
      case SubscriptionPlanType.MONTHLY:
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case SubscriptionPlanType.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case SubscriptionPlanType.ANNUAL:
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    // Create subscription record
    const subscription = await this.prisma.subscription.create({
      data: {
        userId,
        planId: plan.id,
        status: SubscriptionStatus.PENDING,
        startDate: new Date(),
        endDate,
        messagesUsed: 0,
        autoRenew: true,
      },
    });

    // Process payment if payment method is provided
    if (dto.paymentMethodId) {
      try {
        await this.paymentService.processPayment({
          amount: plan.price,
          currency: 'USD',
          paymentMethodId: dto.paymentMethodId,
          subscriptionId: subscription.id,
        });

        // Update subscription status to active
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: SubscriptionStatus.ACTIVE },
        });
      } catch (error) {
        // If payment fails, delete the subscription
        await this.prisma.subscription.delete({
          where: { id: subscription.id },
        });
        throw new BadRequestException(
          `Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status as SubscriptionStatus,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      messagesUsed: subscription.messagesUsed,
      autoRenew: subscription.autoRenew,
    };
  }

  async getUserSubscription(userId: string): Promise<SubscriptionResponseDto | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!subscription) {
      return null;
    }

    return {
      id: subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status as SubscriptionStatus,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      messagesUsed: subscription.messagesUsed,
      autoRenew: subscription.autoRenew,
    };
  }

  async cancelSubscription(userId: string, subscriptionId: string): Promise<void> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Active subscription not found');
    }

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        autoRenew: false,
        status: SubscriptionStatus.CANCELLED,
      },
    });
  }

  async getPaymentHistory(userId: string): Promise<PaymentHistoryDto[]> {
    const payments = await this.prisma.payment.findMany({
      where: {
        subscription: {
          userId,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map((payment) => ({
      id: payment.id,
      subscriptionId: payment.subscriptionId,
      amount: payment.amount,
      paymentDate: payment.createdAt,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
    }));
  }

  async checkMessageLimit(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription) {
      return false;
    }

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: subscription.planId },
    });

    if (!plan) {
      return false;
    }

    return subscription.messagesUsed < plan.messagesPerMonth;
  }

  async incrementMessageCount(userId: string): Promise<void> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.ACTIVE,
        endDate: { gt: new Date() },
      },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          messagesUsed: {
            increment: 1,
          },
        },
      });
    }
  }
}
