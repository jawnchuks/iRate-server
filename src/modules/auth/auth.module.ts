import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { GoogleOAuthService } from './services/google-oauth.service';
import { EmailService } from './services/email.service';
import { PhoneService } from './services/phone.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryService } from 'src/common/utils/cloudinary';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    GoogleOAuthService,
    EmailService,
    PhoneService,
    CloudinaryService,
  ],
  exports: [AuthService, RolesGuard],
})
export class AuthModule {}
