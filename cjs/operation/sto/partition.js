"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partition = void 0;
const index_js_1 = require("../../node/index.js");
const index_js_2 = require("../../error/index.js");
class Partition {
    constructor(s) {
        index_js_2.Assert.check(index_js_1.Config.STO.PARTITION.satisfy(s.length), index_js_2.MitumError.detail(index_js_2.ECODE.STO.INVALID_PARTITION, "partition length out of range"));
        index_js_2.Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), index_js_2.MitumError.detail(index_js_2.ECODE.STO.INVALID_PARTITION, "invalid partition format"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Partition ? s : new Partition(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
exports.Partition = Partition;
//# sourceMappingURL=partition.js.map