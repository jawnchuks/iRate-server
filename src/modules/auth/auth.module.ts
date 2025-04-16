import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./controllers";
import { AuthService } from "./services";
import { JwtStrategy } from "./strategies";
import { PrismaModule } from "../prisma/prisma.module";
import { GoogleOAuthService } from "./services/google-oauth.service";
import { EmailService } from "./services/email.service";
import { PhoneService } from "./services/phone.service";

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN", "1d"),
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleOAuthService,
    EmailService,
    PhoneService,
  ],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
