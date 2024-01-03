"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCurrencyFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../common/index.js");
class UpdateCurrencyFact extends index_js_1.NodeFact {
    constructor(token, currency, policy) {
        super(index_js_2.HINT.CURRENCY.UPDATE_CURRENCY.FACT, token);
        this.currency = index_js_3.CurrencyID.from(currency);
        this.policy = policy;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.currency.toString(), policy: this.policy.toHintedObject() });
    }
    get operationHint() {
        return index_js_2.HINT.CURRENCY.UPDATE_CURRENCY.OPERATION;
    }
}
exports.UpdateCurrencyFact = UpdateCurrencyFact;
//# sourceMappingURL=update-currency.js.map