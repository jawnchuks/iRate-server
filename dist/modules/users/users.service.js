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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../modules/prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profilePhotos: true,
                profilePicture: true,
                givenRatings: true,
                receivedRatings: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return Object.assign(Object.assign({}, user), { preferences: this.parseJsonField(user.preferences), privacy: this.parseJsonField(user.privacy), visibility: this.parseJsonField(user.visibility), settings: this.parseJsonField(user.settings) });
    }
    async getPublicProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                profilePhotos: true,
                profilePicture: true,
                givenRatings: {
                    where: {
                        target: {
                            whoCanSeeRatings: 'everyone',
                        },
                    },
                },
                receivedRatings: {
                    where: {
                        target: {
                            whoCanSeeRatings: 'everyone',
                        },
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return Object.assign(Object.assign({}, user), { preferences: this.parseJsonField(user.preferences), privacy: this.parseJsonField(user.privacy), visibility: this.parseJsonField(user.visibility), settings: this.parseJsonField(user.settings) });
    }
    async isUserBlocked(userId, otherUserId) {
        const blocked = await this.prisma.blockedUser.findFirst({
            where: {
                OR: [
                    { blockerId: userId, blockedId: otherUserId },
                    { blockerId: otherUserId, blockedId: userId },
                ],
            },
        });
        return !!blocked;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: Object.assign(Object.assign({}, dto), { preferences: dto.preferences ? JSON.stringify(dto.preferences) : undefined, privacy: dto.privacy ? JSON.stringify(dto.privacy) : undefined, visibility: dto.visibility ? JSON.stringify(dto.visibility) : undefined, settings: dto.settings ? JSON.stringify(dto.settings) : undefined }),
            include: {
                profilePhotos: true,
                profilePicture: true,
                givenRatings: true,
                receivedRatings: true,
            },
        });
        return Object.assign(Object.assign({}, user), { preferences: this.parseJsonField(user.preferences), privacy: this.parseJsonField(user.privacy), visibility: this.parseJsonField(user.visibility), settings: this.parseJsonField(user.settings) });
    }
    async updatePreferences(userId, dto) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                notificationPreferences: {
                    pushNotifications: dto.pushNotifications,
                    emailNotifications: dto.emailNotifications,
                    profileVisibility: dto.profileVisibility,
                    hideRating: dto.hideRating,
                    whoCanMessage: dto.whoCanMessage,
                },
            },
            include: {
                profilePhotos: true,
                profilePicture: true,
                givenRatings: true,
                receivedRatings: true,
            },
        });
        return Object.assign(Object.assign({}, user), { preferences: this.parseJsonField(user.preferences), privacy: this.parseJsonField(user.privacy), visibility: this.parseJsonField(user.visibility), settings: this.parseJsonField(user.settings) });
    }
    async uploadPhoto(userId, file) {
        const photo = await this.prisma.userPhoto.create({
            data: {
                url: file.path,
                userId,
                isProfilePicture: true,
            },
        });
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { profilePictureId: photo.id },
            include: {
                profilePhotos: true,
                profilePicture: true,
                givenRatings: true,
                receivedRatings: true,
            },
        });
        return Object.assign(Object.assign({}, user), { preferences: this.parseJsonField(user.preferences), privacy: this.parseJsonField(user.privacy), visibility: this.parseJsonField(user.visibility), settings: this.parseJsonField(user.settings) });
    }
    async deletePhoto(userId, photoId) {
        await this.prisma.userPhoto.delete({
            where: { id: photoId, userId },
        });
        return { deleted: true };
    }
    async blockUser(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userToBlock = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!userToBlock)
            throw new common_1.NotFoundException('User to block not found');
        await this.prisma.blockedUser.create({
            data: {
                blockerId: userId,
                blockedId: dto.userId,
                reason: dto.reason,
            },
        });
        await this.prisma.conversation.deleteMany({
            where: {
                OR: [
                    { participant1Id: userId, participant2Id: dto.userId },
                    { participant1Id: dto.userId, participant2Id: userId },
                ],
            },
        });
        return { blocked: true };
    }
    async reportUser(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userToReport = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!userToReport)
            throw new common_1.NotFoundException('User to report not found');
        await this.prisma.userReport.create({
            data: {
                reporterId: userId,
                reportedId: dto.userId,
                reason: dto.reason,
                details: dto.details,
                reportType: 'user_report',
            },
        });
        return { reported: true };
    }
    async deleteAccount(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: false,
                email: `deleted_${user.email}`,
                phoneNumber: user.phoneNumber ? `deleted_${user.phoneNumber}` : null,
                username: user.username ? `deleted_${user.username}` : null,
            },
        });
        await this.prisma.userPhoto.deleteMany({
            where: { userId },
        });
        await this.prisma.conversation.deleteMany({
            where: {
                OR: [{ participant1Id: userId }, { participant2Id: userId }],
            },
        });
        return { deleted: true };
    }
    async deactivateAccount(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: false,
            },
        });
        return { deactivated: true };
    }
    async reactivateAccount(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: true,
            },
        });
        return { reactivated: true };
    }
    async getUserPreferences(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { preferences: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return JSON.parse(user.preferences);
    }
    async getUserSettings(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { settings: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return JSON.parse(user.settings);
    }
    async getUserPrivacy(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { privacy: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return JSON.parse(user.privacy);
    }
    async updateUserPrivacy(userId, updatePrivacyDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { privacy: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const currentPrivacy = JSON.parse(user.privacy);
        const updatedPrivacy = Object.assign(Object.assign({}, currentPrivacy), updatePrivacyDto);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                privacy: JSON.stringify(updatedPrivacy),
            },
        });
        return updatedPrivacy;
    }
    async getUserVisibility(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { visibility: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return JSON.parse(user.visibility);
    }
    async updateUserVisibility(userId, updateVisibilityDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { visibility: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const currentVisibility = JSON.parse(user.visibility);
        const updatedVisibility = Object.assign(Object.assign({}, currentVisibility), updateVisibilityDto);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                visibility: JSON.stringify(updatedVisibility),
            },
        });
        return updatedVisibility;
    }
    async getUserStatus(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                isActive: true,
                deactivatedAt: true,
                deletedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            isActive: user.isActive,
            isDeactivated: !!user.deactivatedAt,
            isDeleted: !!user.deletedAt,
            deactivatedAt: user.deactivatedAt,
            deletedAt: user.deletedAt,
        };
    }
    getDefaultPreferences() {
        return {
            language: '',
            timezone: '',
            notifications: {
                email: false,
                push: false,
                sms: false,
            },
        };
    }
    getDefaultPrivacy() {
        return {
            isProfilePublic: false,
            areRatingsPublic: false,
            isLocationPublic: false,
            isContactPublic: false,
        };
    }
    getDefaultVisibility() {
        return {
            isVisibleInSearch: false,
            isVisibleToNearby: false,
            isVisibleToRecommended: false,
        };
    }
    async getProfileCompletion(userId) {
        var _a, _b, _c, _d, _e, _f;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                preferences: true,
                privacy: true,
                visibility: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userProfile = Object.assign(Object.assign({}, user), { preferences: (_a = this.parseJsonField(user.preferences)) !== null && _a !== void 0 ? _a : this.getDefaultPreferences(), privacy: (_b = this.parseJsonField(user.privacy)) !== null && _b !== void 0 ? _b : this.getDefaultPrivacy(), visibility: (_c = this.parseJsonField(user.visibility)) !== null && _c !== void 0 ? _c : this.getDefaultVisibility() });
        const completion = {
            basicInfo: this.calculateBasicInfoCompletion(userProfile),
            preferences: this.calculatePreferencesCompletion((_d = userProfile.preferences) !== null && _d !== void 0 ? _d : this.getDefaultPreferences()),
            privacy: this.calculatePrivacyCompletion((_e = userProfile.privacy) !== null && _e !== void 0 ? _e : this.getDefaultPrivacy()),
            visibility: this.calculateVisibilityCompletion((_f = userProfile.visibility) !== null && _f !== void 0 ? _f : this.getDefaultVisibility()),
        };
        return Object.assign(Object.assign({}, completion), { total: this.calculateTotalCompletion(completion) });
    }
    async getProfileRequirements(userId) {
        var _a, _b, _c, _d, _e, _f;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
                preferences: true,
                privacy: true,
                visibility: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userProfile = Object.assign(Object.assign({}, user), { preferences: (_a = this.parseJsonField(user.preferences)) !== null && _a !== void 0 ? _a : this.getDefaultPreferences(), privacy: (_b = this.parseJsonField(user.privacy)) !== null && _b !== void 0 ? _b : this.getDefaultPrivacy(), visibility: (_c = this.parseJsonField(user.visibility)) !== null && _c !== void 0 ? _c : this.getDefaultVisibility() });
        return {
            basicInfo: this.getBasicInfoRequirements(userProfile),
            preferences: this.getPreferencesRequirements((_d = userProfile.preferences) !== null && _d !== void 0 ? _d : this.getDefaultPreferences()),
            privacy: this.getPrivacyRequirements((_e = userProfile.privacy) !== null && _e !== void 0 ? _e : this.getDefaultPrivacy()),
            visibility: this.getVisibilityRequirements((_f = userProfile.visibility) !== null && _f !== void 0 ? _f : this.getDefaultVisibility()),
        };
    }
    calculateBasicInfoCompletion(user) {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
        const completedFields = requiredFields.filter((field) => user[field]);
        return (completedFields.length / requiredFields.length) * 100;
    }
    calculatePreferencesCompletion(preferences) {
        const requiredFields = ['language', 'timezone', 'notifications'];
        const completedFields = requiredFields.filter((field) => preferences[field]);
        return (completedFields.length / requiredFields.length) * 100;
    }
    calculatePrivacyCompletion(privacy) {
        const requiredFields = [
            'isProfilePublic',
            'areRatingsPublic',
            'isLocationPublic',
            'isContactPublic',
        ];
        const completedFields = requiredFields.filter((field) => privacy[field] !== undefined);
        return (completedFields.length / requiredFields.length) * 100;
    }
    calculateVisibilityCompletion(visibility) {
        const requiredFields = ['isVisibleInSearch', 'isVisibleToNearby', 'isVisibleToRecommended'];
        const completedFields = requiredFields.filter((field) => visibility[field] !== undefined);
        return (completedFields.length / requiredFields.length) * 100;
    }
    calculateTotalCompletion(completion) {
        const weights = {
            basicInfo: 0.4,
            preferences: 0.2,
            privacy: 0.2,
            visibility: 0.2,
        };
        return Object.entries(completion).reduce((total, [key, value]) => total + value * (weights[key] || 0), 0);
    }
    getBasicInfoRequirements(user) {
        return {
            firstName: !user.firstName ? 'First name is required' : null,
            lastName: !user.lastName ? 'Last name is required' : null,
            email: !user.email ? 'Email is required' : null,
            phone: !user.phoneNumber ? 'Phone number is required' : null,
        };
    }
    getPreferencesRequirements(preferences) {
        return {
            language: !preferences.language ? 'Language preference is required' : null,
            timezone: !preferences.timezone ? 'Timezone is required' : null,
            notifications: !preferences.notifications ? 'Notification preferences are required' : null,
        };
    }
    getPrivacyRequirements(privacy) {
        return {
            isProfilePublic: privacy.isProfilePublic === undefined ? 'Profile visibility setting is required' : null,
            areRatingsPublic: privacy.areRatingsPublic === undefined ? 'Ratings visibility setting is required' : null,
            isLocationPublic: privacy.isLocationPublic === undefined ? 'Location visibility setting is required' : null,
            isContactPublic: privacy.isContactPublic === undefined ? 'Contact visibility setting is required' : null,
        };
    }
    getVisibilityRequirements(visibility) {
        return {
            isVisibleInSearch: visibility.isVisibleInSearch === undefined ? 'Search visibility setting is required' : null,
            isVisibleToNearby: visibility.isVisibleToNearby === undefined ? 'Nearby visibility setting is required' : null,
            isVisibleToRecommended: visibility.isVisibleToRecommended === undefined
                ? 'Recommended visibility setting is required'
                : null,
        };
    }
    parseJsonField(value) {
        if (value === null || value === undefined) {
            return null;
        }
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (_a) {
                return null;
            }
        }
        return value;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map