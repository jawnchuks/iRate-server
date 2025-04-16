import { Injectable, UnauthorizedException } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class GoogleOAuthService {
  private client = new OAuth2Client();

  async verifyGoogleToken(token: string): Promise<{
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email)
        throw new UnauthorizedException("Invalid Google token");
      return {
        email: payload.email,
        firstName: payload.given_name || "",
        lastName: payload.family_name || "",
        picture: payload.picture,
      };
    } catch (e) {
      throw new UnauthorizedException("Invalid Google token");
    }
  }
}
