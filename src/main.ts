import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerCustomOptions } from './config/swagger';
import { AppModule } from './modules/app/app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    logger.log('🚀 Starting application...');
    logger.log('📝 Environment:', process.env.NODE_ENV);

    // Log database configuration (safely)
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const maskedUrl = dbUrl.replace(/(:\/\/[^:]+:)([^@]+)@/, '$1****@');
      logger.log('🔑 Database URL:', maskedUrl);
    } else {
      logger.error('❌ Database URL not configured');
      process.exit(1);
    }

    logger.log('🌐 API URL:', process.env.API_URL || 'Not configured');
    logger.log('🔌 Port:', process.env.PORT || 9000);
    logger.log('🏠 Host:', process.env.HOST || '0.0.0.0');

    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
      bodyParser: true,
    });

    // Global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    // Global interceptors
    app.useGlobalInterceptors(new TransformInterceptor());

    // CORS configuration
    app.enableCors({
      origin: [
        'http://localhost:9000',
        'http://localhost:3000',
        'https://irate-server-production.up.railway.app',
        'https://irate-server.up.railway.app',
        /\.railway\.app$/,
        /\.expo\.dev$/,
        'exp://localhost:19000',
        'exp://192.168.1.*:19000',
        'exp://10.0.0.*:19000',
        'exp://127.0.0.1:19000',
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      maxAge: 3600,
    });

    // Set global prefix for all API endpoints
    app.setGlobalPrefix('api');

    // Swagger setup at /swagger-docs
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('swagger-docs', app, document, {
      ...swaggerCustomOptions,
      customCss: '.swagger-ui .topbar { display: none }',
      customJs: undefined,
      customfavIcon: undefined,
    });

    const port = process.env.PORT || 9000;
    const host = process.env.HOST || '0.0.0.0';

    logger.log(`📡 Attempting to start server on ${host}:${port}`);
    await app.listen(port, host);

    const apiUrl = process.env.API_URL || `http://localhost:${port}`;
    logger.log(`✅ Application is running on: ${apiUrl}`);
    logger.log(`📚 Swagger documentation is available at: ${apiUrl}/swagger-docs`);
    logger.log(`🔍 Health check endpoint is available at: ${apiUrl}/api/`);

    // Handle graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        logger.log(`⚠️ Received ${signal}, shutting down gracefully`);
        await app.close();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(
      '❌ Failed to start application:',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

bootstrap();
