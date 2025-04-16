"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleOAuthService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
let GoogleOAuthService = class GoogleOAuthService {
    constructor() {
        this.client = new google_auth_library_1.OAuth2Client();
    }
    async verifyGoogleToken(token) {
        try {
            const ticket = await this.client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email)
                throw new common_1.UnauthorizedException('Invalid Google token');
            return {
                email: payload.email,
                firstName: payload.given_name || '',
                lastName: payload.family_name || '',
                picture: payload.picture,
            };
        }
        catch (_a) {
            throw new common_1.UnauthorizedException('Invalid Google token');
        }
    }
};
exports.GoogleOAuthService = GoogleOAuthService;
exports.GoogleOAuthService = GoogleOAuthService = __decorate([
    (0, common_1.Injectable)()
], GoogleOAuthService);
//# sourceMappingURL=google-oauth.service.js.map