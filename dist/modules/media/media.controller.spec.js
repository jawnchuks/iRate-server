"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const media_controller_1 = require("./media.controller");
describe('MediaController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [media_controller_1.MediaController],
        }).compile();
        controller = module.get(media_controller_1.MediaController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=media.controller.spec.js.map