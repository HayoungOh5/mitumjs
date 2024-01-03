"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCurrencyFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
class RegisterCurrencyFact extends index_js_1.NodeFact {
    constructor(token, design) {
        super(index_js_2.HINT.CURRENCY.REGISTER_CURRENCY.FACT, token);
        this.design = design;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            this.token.toBuffer(),
            this.design.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.design.toHintedObject() });
    }
    get operationHint() {
        return index_js_2.HINT.CURRENCY.REGISTER_CURRENCY.OPERATION;
    }
}
exports.RegisterCurrencyFact = RegisterCurrencyFact;
//# sourceMappingURL=register-currency.js.map