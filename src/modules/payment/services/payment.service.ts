import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface ProcessPaymentDto {
  amount: number;
  currency: string;
  paymentMethodId: string;
  subscriptionId: string;
}

interface PaymentStatus {
  status: string;
  amount: number;
  currency: string;
  timestamp: string;
}

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async processPayment(dto: ProcessPaymentDto): Promise<void> {
    try {
      // Here you would integrate with your payment provider (e.g., Stripe)
      // For now, we'll simulate a successful payment

      // Create payment record
      await this.prisma.payment.create({
        data: {
          subscriptionId: dto.subscriptionId,
          amount: dto.amount,
          currency: dto.currency,
          status: 'SUCCESS',
          paymentMethod: dto.paymentMethodId,
        },
      });

      // Cache payment status for quick lookup
      await this.redis.set(
        `payment:${dto.subscriptionId}`,
        JSON.stringify({
          status: 'SUCCESS',
          amount: dto.amount,
          currency: dto.currency,
          timestamp: new Date().toISOString(),
        }),
        3600, // Cache for 1 hour
      );
    } catch {
      throw new BadRequestException('Payment processing failed');
    }
  }

  async getPaymentStatus(subscriptionId: string): Promise<PaymentStatus | null> {
    // Try to get from cache first
    const cachedStatus = await this.redis.get(`payment:${subscriptionId}`);
    if (cachedStatus) {
      return JSON.parse(cachedStatus);
    }

    // If not in cache, get from database
    const payment = await this.prisma.payment.findFirst({
      where: {
        subscriptionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!payment) {
      return null;
    }

    // Cache the result
    await this.redis.set(
      `payment:${payment.id}`,
      JSON.stringify(payment),
      3600, // Cache for 1 hour
    );

    return {
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      timestamp: payment.createdAt.toISOString(),
    };
  }

  async refundPayment(paymentId: string): Promise<void> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (payment.status !== 'SUCCESS') {
      throw new BadRequestException('Payment cannot be refunded');
    }

    // Here you would integrate with your payment provider for refund
    // For now, we'll just update the status

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    });

    // Clear cache
    await this.redis.del(`payment:${payment.subscriptionId}`);
  }
}
