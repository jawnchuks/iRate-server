"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_KEY = void 0;
exports.RateLimit = RateLimit;
const common_1 = require("@nestjs/common");
const rate_limit_guard_1 = require("../guards/rate-limit.guard");
exports.RATE_LIMIT_KEY = 'rateLimit';
function RateLimit(options) {
    return (0, common_1.applyDecorators)((0, common_1.SetMetadata)(exports.RATE_LIMIT_KEY, options), (0, common_1.UseGuards)(rate_limit_guard_1.RateLimitGuard));
}
//# sourceMappingURL=rate-limit.decorator.js.map