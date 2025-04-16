"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const geolocation_service_1 = require("./geolocation.service");
describe('GeolocationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [geolocation_service_1.GeolocationService],
        }).compile();
        service = module.get(geolocation_service_1.GeolocationService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=geolocation.service.spec.js.map