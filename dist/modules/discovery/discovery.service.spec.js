"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const discovery_service_1 = require("./discovery.service");
describe('DiscoveryService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [discovery_service_1.DiscoveryService],
        }).compile();
        service = module.get(discovery_service_1.DiscoveryService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=discovery.service.spec.js.map