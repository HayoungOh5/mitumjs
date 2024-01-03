"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractID = exports.CurrencyID = void 0;
const index_js_1 = require("../node/index.js");
const index_js_2 = require("../error/index.js");
class ID {
    constructor(s) {
        this.s = s;
    }
    equal(id) {
        return this.toString() === id.toString();
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class CurrencyID extends ID {
    constructor(s) {
        super(s);
        index_js_2.Assert.check(index_js_1.Config.CURRENCY_ID.satisfy(s.length), index_js_2.MitumError.detail(index_js_2.ECODE.INVALID_CURRENCY_ID, "currency id length out of range"));
        index_js_2.Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), index_js_2.MitumError.detail(index_js_2.ECODE.INVALID_CURRENCY_ID, "invalid currency id format"));
    }
    static from(s) {
        return s instanceof CurrencyID ? s : new CurrencyID(s);
    }
}
exports.CurrencyID = CurrencyID;
class ContractID extends ID {
    constructor(s) {
        super(s);
        index_js_2.Assert.check(index_js_1.Config.CONTRACT_ID.satisfy(s.length), index_js_2.MitumError.detail(index_js_2.ECODE.INVALID_CONTRACT_ID, "contract id length out of range"));
        index_js_2.Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), index_js_2.MitumError.detail(index_js_2.ECODE.INVALID_CONTRACT_ID, "invalid contract id format"));
    }
    static from(s) {
        return s instanceof ContractID ? s : new ContractID(s);
    }
}
exports.ContractID = ContractID;
//# sourceMappingURL=id.js.map