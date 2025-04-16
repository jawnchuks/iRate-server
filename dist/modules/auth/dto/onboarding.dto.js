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
exports.OnboardingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class LocationDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Latitude coordinate',
        example: 37.7749,
        minimum: -90,
        maximum: 90,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Longitude coordinate',
        example: -122.4194,
        minimum: -180,
        maximum: 180,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LocationDto.prototype, "longitude", void 0);
class OnboardingDto {
}
exports.OnboardingDto = OnboardingDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of birth (YYYY-MM-DD)',
        example: '1990-01-01',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], OnboardingDto.prototype, "dob", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Gender', example: 'male' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'How would you describe yourself? (min 1)',
        example: ['adventurous', 'kind'],
        type: [String],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], OnboardingDto.prototype, "selfDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'What do you value in others? (min 1)',
        example: ['honesty', 'humor'],
        type: [String],
        minItems: 1,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1),
    __metadata("design:type", Array)
], OnboardingDto.prototype, "valuesInOthers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Who should see your ratings?',
        example: 'everyone',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingDto.prototype, "whoCanSeeRatings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notification preferences',
        example: ['ratings', 'profile', 'someone'],
        type: [String],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], OnboardingDto.prototype, "notificationPreferences", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Upload up to 4 pictures of yourself',
        example: ['url1', 'url2'],
        type: [String],
        maxItems: 4,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMaxSize)(4),
    __metadata("design:type", Array)
], OnboardingDto.prototype, "photos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Profile picture URL (must be one of the uploaded photos)',
        example: 'url1',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], OnboardingDto.prototype, "profilePicture", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Profile completion percentage',
        example: 80,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], OnboardingDto.prototype, "profileCompletion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User bio (max 500 characters)',
        example: 'I love hiking and photography',
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], OnboardingDto.prototype, "bio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User interests (min 3)',
        example: ['hiking', 'photography', 'travel'],
        type: [String],
        minItems: 3,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(3),
    __metadata("design:type", Array)
], OnboardingDto.prototype, "interests", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'User location coordinates',
        type: LocationDto,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LocationDto),
    __metadata("design:type", LocationDto)
], OnboardingDto.prototype, "location", void 0);
//# sourceMappingURL=onboarding.dto.js.map