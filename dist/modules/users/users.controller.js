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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const users_service_1 = require("./users.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const user_preferences_dto_1 = require("./dto/user-preferences.dto");
const block_user_dto_1 = require("./dto/block-user.dto");
const report_user_dto_1 = require("./dto/report-user.dto");
const platform_express_1 = require("@nestjs/platform-express");
const user_profile_dto_1 = require("./dto/user-profile.dto");
const update_privacy_dto_1 = require("./dto/update-privacy.dto");
const update_visibility_dto_1 = require("./dto/update-visibility.dto");
const profile_completion_dto_1 = require("./dto/profile-completion.dto");
const profile_requirements_dto_1 = require("./dto/profile-requirements.dto");
const user_status_dto_1 = require("./dto/user-status.dto");
const user_settings_dto_1 = require("./dto/user-settings.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getProfile(userId) {
        return this.usersService.getProfile(userId);
    }
    async getPublicProfile(userId) {
        return this.usersService.getPublicProfile(userId);
    }
    async updateProfile(userId, updateProfileDto) {
        return this.usersService.updateProfile(userId, updateProfileDto);
    }
    async updatePreferences(userId, userPreferencesDto) {
        return this.usersService.updatePreferences(userId, userPreferencesDto);
    }
    async uploadPhoto(userId, file) {
        return this.usersService.uploadPhoto(userId, file);
    }
    async deletePhoto(userId, photoId) {
        return this.usersService.deletePhoto(userId, photoId);
    }
    async blockUser(userId, blockUserDto) {
        return this.usersService.blockUser(userId, blockUserDto);
    }
    async reportUser(userId, reportUserDto) {
        return this.usersService.reportUser(userId, reportUserDto);
    }
    async deleteAccount(userId) {
        return this.usersService.deleteAccount(userId);
    }
    async deactivateAccount(userId) {
        return this.usersService.deactivateAccount(userId);
    }
    async reactivateAccount(userId) {
        return this.usersService.reactivateAccount(userId);
    }
    async getUserPreferences(userId) {
        return this.usersService.getUserPreferences(userId);
    }
    async getUserSettings(userId) {
        return this.usersService.getUserSettings(userId);
    }
    async getUserPrivacy(userId) {
        return this.usersService.getUserPrivacy(userId);
    }
    async updateUserPrivacy(userId, updatePrivacyDto) {
        return this.usersService.updateUserPrivacy(userId, updatePrivacyDto);
    }
    async getUserVisibility(userId) {
        return this.usersService.getUserVisibility(userId);
    }
    async updateUserVisibility(userId, updateVisibilityDto) {
        return this.usersService.updateUserVisibility(userId, updateVisibilityDto);
    }
    async getUserStatus(userId) {
        return this.usersService.getUserStatus(userId);
    }
    async getProfileCompletion(userId) {
        return this.usersService.getProfileCompletion(userId);
    }
    async getProfileRequirements(userId) {
        return this.usersService.getProfileRequirements(userId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the user profile',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('profile/public'),
    (0, swagger_1.ApiOperation)({ summary: 'Get public user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns the public user profile',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPublicProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user profile' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user preferences' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preferences updated successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_preferences_dto_1.UserPreferencesDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updatePreferences", null);
__decorate([
    (0, common_1.Post)('photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload user photo' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Photo uploaded successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Delete)('photos/:photoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user photo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Photo deleted successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Photo not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Param)('photoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Post)('block'),
    (0, swagger_1.ApiOperation)({ summary: 'Block a user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User blocked successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, block_user_dto_1.BlockUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "blockUser", null);
__decorate([
    (0, common_1.Post)('report'),
    (0, swagger_1.ApiOperation)({ summary: 'Report a user' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User reported successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, report_user_dto_1.ReportUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reportUser", null);
__decorate([
    (0, common_1.Delete)('account'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user account' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account deleted successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.Post)('deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate user account' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account deactivated successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivateAccount", null);
__decorate([
    (0, common_1.Post)('reactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate user account' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Account reactivated successfully',
        type: user_profile_dto_1.UserProfileDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "reactivateAccount", null);
__decorate([
    (0, common_1.Get)('preferences'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user preferences' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user preferences',
        type: user_preferences_dto_1.UserPreferencesDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPreferences", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user settings' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user settings',
        type: user_settings_dto_1.UserSettingsDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserSettings", null);
__decorate([
    (0, common_1.Get)('privacy'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user privacy settings' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user privacy settings',
        type: update_privacy_dto_1.UpdatePrivacyDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPrivacy", null);
__decorate([
    (0, common_1.Patch)('privacy'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user privacy settings' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Privacy settings updated successfully',
        type: update_privacy_dto_1.UpdatePrivacyDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_privacy_dto_1.UpdatePrivacyDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserPrivacy", null);
__decorate([
    (0, common_1.Get)('visibility'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user visibility settings' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user visibility settings',
        type: update_visibility_dto_1.UpdateVisibilityDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserVisibility", null);
__decorate([
    (0, common_1.Patch)('visibility'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user visibility settings' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Visibility settings updated successfully',
        type: update_visibility_dto_1.UpdateVisibilityDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_visibility_dto_1.UpdateVisibilityDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserVisibility", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user account status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns user account status',
        type: user_status_dto_1.UserStatusDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserStatus", null);
__decorate([
    (0, common_1.Get)('completion'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profile completion status' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns profile completion status',
        type: profile_completion_dto_1.ProfileCompletionDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileCompletion", null);
__decorate([
    (0, common_1.Get)('requirements'),
    (0, swagger_1.ApiOperation)({ summary: 'Get profile requirements' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns profile requirements',
        type: profile_requirements_dto_1.ProfileRequirementsDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileRequirements", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map