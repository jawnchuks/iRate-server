"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const email_controller_1 = require("./email.controller");
describe('EmailController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [email_controller_1.EmailController],
        }).compile();
        controller = module.get(email_controller_1.EmailController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=email.controller.spec.js.map