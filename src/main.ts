import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  try {
    console.log('🚀 Starting application...');
    console.log('📝 Environment:', process.env.NODE_ENV);
    console.log('🔑 Database URL:', process.env.DATABASE_URL ? 'Configured' : 'Not configured');
    console.log('🌐 API URL:', process.env.API_URL || 'Not configured');
    console.log('🔌 Port:', process.env.PORT || 9000);
    console.log('🏠 Host:', process.env.HOST || '0.0.0.0');

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

    // Swagger setup
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);

    // CORS
    app.enableCors();

    const port = process.env.PORT || 9000;
    const host = process.env.HOST || '0.0.0.0';

    console.log(`📡 Attempting to start server on ${host}:${port}`);
    await app.listen(port, host);

    const apiUrl = process.env.API_URL || `http://localhost:${port}`;
    console.log(`✅ Application is running on: ${apiUrl}`);
    console.log(`📚 Swagger documentation is available at: ${apiUrl}/api`);
    console.log(`🔍 Health check endpoint is available at: ${apiUrl}/`);

    // Handle graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach((signal) => {
      process.on(signal, async () => {
        console.log(`⚠️ Received ${signal}, shutting down gracefully`);
        await app.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
