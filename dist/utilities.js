"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPositiveInteger = void 0;
const isPositiveInteger = (num) => {
    try {
        return Number.isSafeInteger(Number(num)) && Number(num) > 0;
    }
    catch (e) {
        return false;
    }
};
exports.isPositiveInteger = isPositiveInteger;
