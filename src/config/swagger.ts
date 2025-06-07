import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('iRate API')
  .setDescription('iRate - A social rating platform API')
  .setVersion('1.0')
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management and discovery endpoints')
  .addTag('ratings', 'Rating system endpoints')
  .addTag('profile', 'Profile management endpoints')
  .addTag('notifications', 'Notification endpoints')
  .addTag('affiliate', 'Affiliate system endpoints')
  .addTag('chat', 'Chat and messaging endpoints')
  .addTag('chat-requests', 'Chat request endpoints')
  .addTag('subscriptions', 'Subscription endpoints')
  .addTag('media', 'Media management endpoints')
  .addTag('admin', 'Admin management endpoints')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'JWT-auth',
  )
  .addServer('http://localhost:9000', 'Local Development')
  .addServer('https://api.irate.com', 'Production')
  .addServer('https://irate-server-production.up.railway.app/api', 'Staging')
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'none',
    filter: true,
    showRequestDuration: true,
    syntaxHighlight: {
      theme: 'monokai',
    },
    defaultModelsExpandDepth: 3,
    defaultModelExpandDepth: 3,
    displayRequestDuration: true,
    tryItOutEnabled: true,
  },
  customSiteTitle: 'iRate API Documentation',
};
