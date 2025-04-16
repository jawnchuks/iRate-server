"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const marketing_service_1 = require("./marketing.service");
describe('MarketingService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [marketing_service_1.MarketingService],
        }).compile();
        service = module.get(marketing_service_1.MarketingService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=marketing.service.spec.js.map