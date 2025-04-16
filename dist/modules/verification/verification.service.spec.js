"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const verification_service_1 = require("./verification.service");
describe('VerificationService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [verification_service_1.VerificationService],
        }).compile();
        service = module.get(verification_service_1.VerificationService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=verification.service.spec.js.map