"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKeyFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../common/index.js");
const index_js_4 = require("../../key/index.js");
class UpdateKeyFact extends index_js_1.Fact {
    constructor(token, target, keys, currency) {
        super(index_js_2.HINT.CURRENCY.UPDATE_KEY.FACT, token);
        this.target = index_js_4.Address.from(target);
        this.keys = keys;
        this.currency = index_js_3.CurrencyID.from(currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.keys.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString(), keys: this.keys.toHintedObject(), currency: this.currency.toString() });
    }
    get operationHint() {
        return index_js_2.HINT.CURRENCY.UPDATE_KEY.OPERATION;
    }
}
exports.UpdateKeyFact = UpdateKeyFact;
//# sourceMappingURL=update-key.js.map