import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
  googleId: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly client: OAuth2Client;
  private readonly logger = new Logger(GoogleOAuthService.name);

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );
  }

  async verifyToken(token: string) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return null;
      }

      return {
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
      };
    } catch {
      return null;
    }
  }

  async validateGoogleToken(token: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid token payload');
      }

      return {
        email: payload.email!,
        name: payload.name!,
        picture: payload.picture!,
        googleId: payload.sub!,
      };
    } catch {
      this.logger.error('Failed to validate Google token');
      throw new Error('Invalid Google token');
    }
  }
}
