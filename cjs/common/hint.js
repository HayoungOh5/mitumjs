"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hint = void 0;
const index_js_1 = require("../node/index.js");
class Hint {
    constructor(s) {
        this.s = s;
    }
    toString() {
        return `${this.s}-${index_js_1.Version.get()}`;
    }
}
exports.Hint = Hint;
//# sourceMappingURL=hint.js.map