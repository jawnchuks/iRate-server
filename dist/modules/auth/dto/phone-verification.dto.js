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
exports.VerifyEmailDto = exports.VerifyPhoneDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class VerifyPhoneDto {
}
exports.VerifyPhoneDto = VerifyPhoneDto;
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
], VerifyPhoneDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "OTP code sent to phone number",
        example: "123456",
        minLength: 6,
        maxLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: "OTP must be exactly 6 digits" }),
    __metadata("design:type", String)
], VerifyPhoneDto.prototype, "otp", void 0);
class VerifyEmailDto {
}
exports.VerifyEmailDto = VerifyEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User email address",
        example: "user@example.com",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Verification code sent to email",
        example: "123456",
        minLength: 6,
        maxLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(6, 6, { message: "Code must be exactly 6 digits" }),
    __metadata("design:type", String)
], VerifyEmailDto.prototype, "code", void 0);
//# sourceMappingURL=phone-verification.dto.js.map