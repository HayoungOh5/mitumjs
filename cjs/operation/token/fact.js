"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFact = void 0;
const index_js_1 = require("../base/index.js");
class TokenFact extends index_js_1.ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign({}, super.toHintedObject());
    }
}
exports.TokenFact = TokenFact;
//# sourceMappingURL=fact.js.map