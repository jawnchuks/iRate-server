"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const profile_controller_1 = require("./profile.controller");
describe('ProfileController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [profile_controller_1.ProfileController],
        }).compile();
        controller = module.get(profile_controller_1.ProfileController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=profile.controller.spec.js.map