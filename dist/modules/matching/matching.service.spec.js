"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const matching_service_1 = require("./matching.service");
describe('MatchingService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [matching_service_1.MatchingService],
        }).compile();
        service = module.get(matching_service_1.MatchingService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=matching.service.spec.js.map