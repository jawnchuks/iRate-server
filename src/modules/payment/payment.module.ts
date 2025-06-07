import { Module } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
