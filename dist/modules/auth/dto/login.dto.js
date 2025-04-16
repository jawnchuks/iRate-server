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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginGoogleDto = exports.LoginPhoneDto = exports.LoginEmailDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginEmailDto {
}
exports.LoginEmailDto = LoginEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User email address",
        example: "user@example.com",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginEmailDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User password",
        example: "password123",
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], LoginEmailDto.prototype, "password", void 0);
class LoginPhoneDto {
}
exports.LoginPhoneDto = LoginPhoneDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Phone number with country code",
        example: "+1234567890",
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+[1-9]\d{1,14}$/, {
        message: "Phone number must be in E.164 format (e.g., +1234567890)",
    }),
    __metadata("design:type", String)
], LoginPhoneDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "OTP code sent to phone number",
        example: "123456",
        minLength: 6,
        maxLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.MaxLength)(6),
    __metadata("design:type", String)
], LoginPhoneDto.prototype, "otp", void 0);
class LoginGoogleDto {
}
exports.LoginGoogleDto = LoginGoogleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Google OAuth token",
        example: "ya29.a0AfH6SM...",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LoginGoogleDto.prototype, "token", void 0);
//# sourceMappingURL=login.dto.js.map