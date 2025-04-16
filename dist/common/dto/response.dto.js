"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(success, data, message, error) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.error = error;
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=response.dto.js.map