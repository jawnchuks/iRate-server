import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('iRate API')
  .setDescription(
    `
    The iRate server API provides a comprehensive set of endpoints for user management, 
    authentication, geolocation services, ratings, and more.
    
    ## Features
    - User Management & Authentication
    - Profile Management
    - Discovery & Matching
    - Chat & Messaging
    - Security Features (2FA, Device Verification)
    - Geolocation Services
    - Rating System
    - Email Notifications
    - Real-time Updates
    - Media Management
    - Analytics & Metrics
    - Achievement System
    - Marketing Tools
    - Subscription Management
  `,
  )
  .setVersion('1.0')
  .addBearerAuth()
  .addServer(process.env.API_URL || 'http://localhost:3000', 'API Server')
  .addTag('auth', 'Authentication endpoints')
  .addTag('users', 'User management endpoints')
  .addTag('profiles', 'Profile management endpoints')
  .addTag('discovery', 'Discovery and matching endpoints')
  .addTag('chat', 'Chat and messaging endpoints')
  .addTag('security', 'Security and 2FA endpoints')
  .addTag('geolocation', 'Location and mapping services')
  .addTag('ratings', 'Rating system endpoints')
  .addTag('email', 'Email notification endpoints')
  .addTag('media', 'Media management endpoints')
  .addTag('analytics', 'Analytics and metrics endpoints')
  .addTag('achievements', 'Achievement system endpoints')
  .addTag('marketing', 'Marketing tools endpoints')
  .addTag('notifications', 'Notification system endpoints')
  .addTag('verification', 'User verification endpoints')
  .build();
