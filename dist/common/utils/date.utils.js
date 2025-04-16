"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.addDays = addDays;
exports.isExpired = isExpired;
function formatDate(date) {
    return date.toISOString();
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function isExpired(date) {
    return date < new Date();
}
//# sourceMappingURL=date.utils.js.map