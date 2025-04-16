"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const geolocation_controller_1 = require("./geolocation.controller");
describe('GeolocationController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [geolocation_controller_1.GeolocationController],
        }).compile();
        controller = module.get(geolocation_controller_1.GeolocationController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
//# sourceMappingURL=geolocation.controller.spec.js.map