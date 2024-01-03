"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOverlappingAddress = void 0;
const index_js_1 = require("../key/index.js");
const hasOverlappingAddress = (arr) => (new Set(arr.map(a => a instanceof index_js_1.Address ? a.toString() : a)).size == arr.length);
exports.hasOverlappingAddress = hasOverlappingAddress;
//# sourceMappingURL=duplicate.js.map