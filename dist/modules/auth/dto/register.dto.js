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
exports.RegisterGoogleDto = exports.RegisterPhoneDto = exports.RegisterEmailDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class RegisterEmailDto {
}
exports.RegisterEmailDto = RegisterEmailDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User email address",
        example: "user@example.com",
    }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterEmailDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User password (min 8 characters)",
        example: "password123",
        minLength: 8,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: "Password is too weak. It should contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character.",
    }),
    __metadata("design:type", String)
], RegisterEmailDto.prototype, "password", void 0);
class RegisterPhoneDto {
}
exports.RegisterPhoneDto = RegisterPhoneDto;
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
], RegisterPhoneDto.prototype, "phoneNumber", void 0);
class RegisterGoogleDto {
}
exports.RegisterGoogleDto = RegisterGoogleDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Google OAuth token",
        example: "ya29.a0AfH6SM...",
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterGoogleDto.prototype, "token", void 0);
//# sourceMappingURL=register.dto.js.map