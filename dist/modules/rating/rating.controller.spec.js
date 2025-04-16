"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rating_controller_1 = require("./rating.controller");
describe('RatingController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [rating_controller_1.RatingController],
        }).compile();
        controller = module.get(rating_controller_1.RatingController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=rating.controller.spec.js.map