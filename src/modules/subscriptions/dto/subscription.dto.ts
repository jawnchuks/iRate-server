import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export enum SubscriptionPlanType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

export class SubscriptionPlanDto {
  @ApiProperty({ description: 'Unique identifier for the plan' })
  @IsString()
  id: string = '';

  @ApiProperty({ description: 'Name of the subscription plan' })
  @IsString()
  name: string = '';

  @ApiProperty({ description: 'Description of the plan features' })
  @IsString()
  description: string = '';

  @ApiProperty({ description: 'Price of the plan' })
  @IsNumber()
  price: number = 0;

  @ApiProperty({ description: 'Type of subscription plan', enum: SubscriptionPlanType })
  @IsEnum(SubscriptionPlanType)
  type: SubscriptionPlanType = SubscriptionPlanType.MONTHLY;

  @ApiProperty({ description: 'Number of messages allowed per month' })
  @IsNumber()
  messagesPerMonth: number = 0;

  @ApiProperty({ description: 'Whether the plan is currently active' })
  @IsBoolean()
  isActive: boolean = false;
}

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'ID of the subscription plan' })
  @IsString()
  planId: string = '';

  @ApiProperty({ description: 'Payment method ID', required: false })
  @IsString()
  @IsOptional()
  paymentMethodId?: string;
}

export class SubscriptionResponseDto {
  @ApiProperty({ description: 'Unique identifier for the subscription' })
  @IsString()
  id: string = '';

  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string = '';

  @ApiProperty({ description: 'Plan ID' })
  @IsString()
  planId: string = '';

  @ApiProperty({ description: 'Current status of the subscription', enum: SubscriptionStatus })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus = SubscriptionStatus.PENDING;

  @ApiProperty({ description: 'Start date of the subscription' })
  @IsDate()
  @Type(() => Date)
  startDate: Date = new Date();

  @ApiProperty({ description: 'End date of the subscription' })
  @IsDate()
  @Type(() => Date)
  endDate: Date = new Date();

  @ApiProperty({ description: 'Number of messages used in current period' })
  @IsNumber()
  messagesUsed: number = 0;

  @ApiProperty({ description: 'Whether the subscription is auto-renewing' })
  @IsBoolean()
  autoRenew: boolean = false;

  @ApiProperty({ description: 'Subscription tier', enum: ['STANDARD', 'PREMIUM'] })
  @IsString()
  tier: string = 'STANDARD';
}

export class PaymentHistoryDto {
  @ApiProperty({ description: 'Unique identifier for the payment' })
  @IsString()
  id: string = '';

  @ApiProperty({ description: 'Subscription ID' })
  @IsString()
  subscriptionId: string = '';

  @ApiProperty({ description: 'Amount paid' })
  @IsNumber()
  amount: number = 0;

  @ApiProperty({ description: 'Date of payment' })
  @IsDate()
  @Type(() => Date)
  paymentDate: Date = new Date();

  @ApiProperty({ description: 'Payment status' })
  @IsString()
  status: string = '';

  @ApiProperty({ description: 'Payment method used' })
  @IsString()
  paymentMethod: string = '';
}
