"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rating_service_1 = require("./rating.service");
describe('RatingService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [rating_service_1.RatingService],
        }).compile();
        service = module.get(rating_service_1.RatingService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=rating.service.spec.js.map