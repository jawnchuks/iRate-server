import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000; // 5 seconds

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('database.url'),
        },
      },
      log: ['query', 'error', 'warn', 'info'],
    });
  }

  async onModuleInit() {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        this.logger.log('Attempting to connect to database...');
        const dbUrl = this.configService.get('database.url');
        this.logger.log('Database URL:', dbUrl?.replace(/(:\/\/[^:]+:)([^@]+)@/, '$1****@'));
        this.logger.log('Environment:', process.env.NODE_ENV);

        // Extract host from database URL
        const url = new URL(dbUrl);
        this.logger.log('Host:', url.hostname);

        await this.$connect();
        this.logger.log('✅ Database connection established');
        return;
      } catch (error) {
        retries++;
        this.logger.error(
          `❌ Database connection attempt ${retries}/${this.maxRetries} failed:`,
          error instanceof Error ? error.message : String(error),
        );

        if (retries === this.maxRetries) {
          throw error;
        }

        this.logger.log(`Retrying in ${this.retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
