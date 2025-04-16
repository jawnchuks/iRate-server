"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const verification_controller_1 = require("./verification.controller");
describe('VerificationController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [verification_controller_1.VerificationController],
        }).compile();
        controller = module.get(verification_controller_1.VerificationController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=verification.controller.spec.js.map