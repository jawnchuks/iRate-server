"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const discovery_controller_1 = require("./discovery.controller");
describe('DiscoveryController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [discovery_controller_1.DiscoveryController],
        }).compile();
        controller = module.get(discovery_controller_1.DiscoveryController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=discovery.controller.spec.js.map