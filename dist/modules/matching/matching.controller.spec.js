"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const matching_controller_1 = require("./matching.controller");
describe('MatchingController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [matching_controller_1.MatchingController],
        }).compile();
        controller = module.get(matching_controller_1.MatchingController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=matching.controller.spec.js.map