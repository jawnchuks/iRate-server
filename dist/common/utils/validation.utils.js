"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatValidationErrors = formatValidationErrors;
function formatValidationErrors(errors) {
    return errors.reduce((acc, error) => {
        if (error.constraints) {
            acc.push(...Object.values(error.constraints));
        }
        if (error.children && error.children.length > 0) {
            acc.push(...formatValidationErrors(error.children));
        }
        return acc;
    }, []);
}
//# sourceMappingURL=validation.utils.js.map