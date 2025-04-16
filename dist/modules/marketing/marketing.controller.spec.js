"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const marketing_controller_1 = require("./marketing.controller");
describe('MarketingController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [marketing_controller_1.MarketingController],
        }).compile();
        controller = module.get(marketing_controller_1.MarketingController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=marketing.controller.spec.js.map