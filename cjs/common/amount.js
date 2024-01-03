"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amount = void 0;
const hint_js_1 = require("./hint.js");
const id_js_1 = require("./id.js");
const index_js_1 = require("../alias/index.js");
const index_js_2 = require("../error/index.js");
const index_js_3 = require("../types/index.js");
class Amount {
    constructor(currency, big) {
        this.hint = new hint_js_1.Hint(index_js_1.HINT.CURRENCY.AMOUNT);
        this.currency = id_js_1.CurrencyID.from(currency);
        this.big = index_js_3.Big.from(big);
        index_js_2.Assert.check(0 < this.big.big, index_js_2.MitumError.detail(index_js_2.ECODE.INVALID_AMOUNT, "zero big"));
    }
    toBuffer() {
        return Buffer.concat([
            this.big.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            currency: this.currency.toString(),
            amount: this.big.toString(),
        };
    }
}
exports.Amount = Amount;
//# sourceMappingURL=amount.js.map