"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const services_1 = require("../services");
const guards_1 = require("../../../common/guards");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async registerEmail(dto) {
        return this.authService.registerEmail(dto);
    }
    async registerPhone(dto) {
        return this.authService.registerPhone(dto);
    }
    async registerGoogle(dto) {
        return this.authService.registerGoogle(dto);
    }
    async loginEmail(dto) {
        return this.authService.loginEmail(dto);
    }
    async loginPhone(dto) {
        return this.authService.loginPhone(dto);
    }
    async loginGoogle(dto) {
        return this.authService.loginGoogle(dto);
    }
    async verifyEmail(dto) {
        return this.authService.verifyEmail(dto);
    }
    async verifyPhone(dto) {
        return this.authService.verifyPhone(dto);
    }
    async completeOnboarding(req, dto) {
        return this.authService.completeOnboarding(req.user.userId, dto);
    }
    async getProfile(req) {
        return this.authService.getProfile(req.user.userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("register/email"),
    (0, swagger_1.ApiOperation)({ summary: "Register with email" }),
    (0, swagger_1.ApiBody)({ type: dto_1.RegisterEmailDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerEmail", null);
__decorate([
    (0, common_1.Post)("register/phone"),
    (0, swagger_1.ApiOperation)({ summary: "Register with phone number" }),
    (0, swagger_1.ApiBody)({ type: dto_1.RegisterPhoneDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterPhoneDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerPhone", null);
__decorate([
    (0, common_1.Post)("register/google"),
    (0, swagger_1.ApiOperation)({ summary: "Register with Google" }),
    (0, swagger_1.ApiBody)({ type: dto_1.RegisterGoogleDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RegisterGoogleDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerGoogle", null);
__decorate([
    (0, common_1.Post)("login/email"),
    (0, swagger_1.ApiOperation)({ summary: "Login with email" }),
    (0, swagger_1.ApiBody)({ type: dto_1.LoginEmailDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginEmail", null);
__decorate([
    (0, common_1.Post)("login/phone"),
    (0, swagger_1.ApiOperation)({ summary: "Login with phone number and OTP" }),
    (0, swagger_1.ApiBody)({ type: dto_1.LoginPhoneDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginPhoneDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginPhone", null);
__decorate([
    (0, common_1.Post)("login/google"),
    (0, swagger_1.ApiOperation)({ summary: "Login with Google" }),
    (0, swagger_1.ApiBody)({ type: dto_1.LoginGoogleDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginGoogleDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginGoogle", null);
__decorate([
    (0, common_1.Post)("verify/email"),
    (0, swagger_1.ApiOperation)({ summary: "Verify email with code" }),
    (0, swagger_1.ApiBody)({ type: dto_1.VerifyEmailDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyEmailDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)("verify/phone"),
    (0, swagger_1.ApiOperation)({ summary: "Verify phone with OTP" }),
    (0, swagger_1.ApiBody)({ type: dto_1.VerifyPhoneDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyPhoneDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyPhone", null);
__decorate([
    (0, common_1.Post)("onboarding"),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Complete user onboarding" }),
    (0, swagger_1.ApiBody)({ type: dto_1.OnboardingDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.OnboardingDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get user profile" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "Profile retrieved successfully",
        schema: {
            properties: {
                success: { type: "boolean", example: true },
                data: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        email: { type: "string" },
                        username: { type: "string" },
                        bio: { type: "string" },
                        profilePicture: { type: "string" },
                        interests: { type: "array", items: { type: "string" } },
                        location: {
                            type: "object",
                            properties: {
                                latitude: { type: "number" },
                                longitude: { type: "number" },
                            },
                        },
                        averageRating: { type: "number" },
                        totalRatings: { type: "number" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: "Unauthorized",
        schema: {
            properties: {
                success: { type: "boolean", example: false },
                error: { type: "string" },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [services_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map