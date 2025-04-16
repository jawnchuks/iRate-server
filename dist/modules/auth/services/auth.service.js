"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const google_oauth_service_1 = require("./google-oauth.service");
const email_service_1 = require("./email.service");
const phone_service_1 = require("./phone.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService, googleOAuthService, emailService, phoneService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.googleOAuthService = googleOAuthService;
        this.emailService = emailService;
        this.phoneService = phoneService;
    }
    async registerEmail(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser)
            throw new common_1.ConflictException("Email already in use");
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                password: hashedPassword,
                role: "user",
                emailVerified: false,
                onboardingComplete: false,
            },
        });
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.verificationOTP.create({
            data: {
                phoneNumber: dto.email,
                otp: code,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        await this.emailService.sendVerificationCode(dto.email, code);
        return { success: true, message: "Verification code sent to email" };
    }
    async registerPhone(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { phoneNumber: dto.phoneNumber },
        });
        if (existingUser)
            throw new common_1.ConflictException("Phone number already in use");
        const user = await this.prisma.user.create({
            data: {
                phoneNumber: dto.phoneNumber,
                email: "",
                password: "",
                role: "user",
                phoneVerified: false,
                onboardingComplete: false,
            },
        });
        await this.sendPhoneOTP(dto.phoneNumber);
        return { success: true, message: "OTP sent to phone number" };
    }
    async registerGoogle(dto) {
        const googleUser = await this.googleOAuthService.verifyGoogleToken(dto.token);
        let user = await this.prisma.user.findUnique({
            where: { email: googleUser.email },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: googleUser.email,
                    password: "",
                    firstName: googleUser.firstName,
                    lastName: googleUser.lastName,
                    role: "user",
                    emailVerified: true,
                    onboardingComplete: false,
                },
            });
        }
        return {
            success: true,
            data: { access_token: this.generateToken(user), user },
        };
    }
    async loginEmail(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid)
            throw new common_1.UnauthorizedException("Invalid credentials");
        if (!user.emailVerified)
            throw new common_1.UnauthorizedException("Email not verified");
        return {
            success: true,
            data: { access_token: this.generateToken(user), user },
        };
    }
    async loginPhone(dto) {
        const user = await this.prisma.user.findUnique({
            where: { phoneNumber: dto.phoneNumber },
        });
        if (!user)
            throw new common_1.UnauthorizedException("Invalid credentials");
        if (!user.phoneVerified)
            throw new common_1.UnauthorizedException("Phone not verified");
        const otpRecord = await this.prisma.verificationOTP.findFirst({
            where: {
                phoneNumber: dto.phoneNumber,
                otp: dto.otp,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord)
            throw new common_1.UnauthorizedException("Invalid or expired OTP");
        await this.prisma.verificationOTP.delete({ where: { id: otpRecord.id } });
        return {
            success: true,
            data: { access_token: this.generateToken(user), user },
        };
    }
    async loginGoogle(dto) {
        const googleUser = await this.googleOAuthService.verifyGoogleToken(dto.token);
        let user = await this.prisma.user.findUnique({
            where: { email: googleUser.email },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: googleUser.email,
                    password: "",
                    firstName: googleUser.firstName,
                    lastName: googleUser.lastName,
                    role: "user",
                    emailVerified: true,
                    onboardingComplete: false,
                },
            });
        }
        return {
            success: true,
            data: { access_token: this.generateToken(user), user },
        };
    }
    async verifyEmail(dto) {
        const otpRecord = await this.prisma.verificationOTP.findFirst({
            where: {
                phoneNumber: dto.email,
                otp: dto.code,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord)
            throw new common_1.UnauthorizedException("Invalid or expired code");
        const user = await this.prisma.user.update({
            where: { email: dto.email },
            data: { emailVerified: true },
        });
        await this.prisma.verificationOTP.delete({ where: { id: otpRecord.id } });
        return {
            success: true,
            data: { access_token: this.generateToken(user), user },
        };
    }
    async verifyPhone(dto) {
        const otpRecord = await this.prisma.verificationOTP.findFirst({
            where: {
                phoneNumber: dto.phoneNumber,
                otp: dto.otp,
                expiresAt: { gt: new Date() },
            },
        });
        if (!otpRecord)
            throw new common_1.UnauthorizedException("Invalid or expired OTP");
        const user = await this.prisma.user.update({
            where: { phoneNumber: dto.phoneNumber },
            data: { phoneVerified: true },
        });
        await this.prisma.verificationOTP.delete({ where: { id: otpRecord.id } });
        return {
            success: true,
            data: { access_token: this.generateToken(user), user },
        };
    }
    async sendPhoneOTP(phoneNumber) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await this.prisma.verificationOTP.create({
            data: { phoneNumber, otp, expiresAt: otpExpiry },
        });
        await this.phoneService.sendOTP(phoneNumber, otp);
        return { success: true, message: "OTP sent successfully" };
    }
    async completeOnboarding(userId, dto) {
        var _a, _b;
        if (!dto.photos.includes(dto.profilePicture)) {
            throw new common_1.BadRequestException("Profile picture must be one of the uploaded photos");
        }
        await this.prisma.userPhoto.deleteMany({ where: { userId } });
        const photoRecords = await Promise.all(dto.photos.map((url) => this.prisma.userPhoto.create({
            data: {
                url,
                userId,
                isProfilePicture: url === dto.profilePicture,
            },
        })));
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                dob: new Date(dto.dob),
                gender: dto.gender,
                selfDescription: dto.selfDescription,
                valuesInOthers: dto.valuesInOthers,
                whoCanSeeRatings: dto.whoCanSeeRatings,
                notificationPreferences: dto.notificationPreferences,
                onboardingComplete: true,
                profileCompletionPercentage: (_a = dto.profileCompletion) !== null && _a !== void 0 ? _a : 100,
                profilePictureId: (_b = photoRecords.find((p) => p.isProfilePicture)) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        return { success: true, data: { user } };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                phoneNumber: true,
                firstName: true,
                lastName: true,
                dob: true,
                gender: true,
                selfDescription: true,
                valuesInOthers: true,
                whoCanSeeRatings: true,
                notificationPreferences: true,
                onboardingComplete: true,
                profileCompletionPercentage: true,
                profilePhotos: true,
                profilePicture: true,
                averageRating: true,
                totalRatings: true,
            },
        });
        if (!user)
            throw new common_1.UnauthorizedException("User not found");
        return { success: true, data: user };
    }
    generateToken(user) {
        return this.jwtService.sign({
            sub: user.id,
            email: user.email,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        google_oauth_service_1.GoogleOAuthService,
        email_service_1.EmailService,
        phone_service_1.PhoneService])
], AuthService);
//# sourceMappingURL=auth.service.js.map