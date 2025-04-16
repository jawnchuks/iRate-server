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
exports.RateLimitGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const redis_service_1 = require("../../modules/redis/redis.service");
const rate_limit_decorator_1 = require("../decorators/rate-limit.decorator");
let RateLimitGuard = class RateLimitGuard {
    constructor(redis, reflector) {
        this.redis = redis;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const options = this.reflector.get(rate_limit_decorator_1.RATE_LIMIT_KEY, context.getHandler());
        if (!options) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const key = `rate-limit:${request.ip}`;
        const current = await this.redis.incr(key);
        if (current === 1) {
            await this.redis.expire(key, options.ttl);
        }
        return current <= options.limit;
    }
};
exports.RateLimitGuard = RateLimitGuard;
exports.RateLimitGuard = RateLimitGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        core_1.Reflector])
], RateLimitGuard);
//# sourceMappingURL=rate-limit.guard.js.map