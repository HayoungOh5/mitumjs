"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTokenFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../common/index.js");
const index_js_3 = require("../../types/index.js");
const index_js_4 = require("../../error/index.js");
class RegisterTokenFact extends fact_js_1.TokenFact {
    constructor(token, sender, contract, currency, symbol, name, initialSupply) {
        super(index_js_1.HINT.TOKEN.REGISTER_TOKEN.FACT, token, sender, contract, currency);
        this.symbol = index_js_2.CurrencyID.from(symbol);
        this.name = index_js_3.LongString.from(name);
        this.initialSupply = index_js_3.Big.from(initialSupply);
        index_js_4.Assert.check(this.initialSupply.compare(0) > 0, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "initialSupply under zero"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.symbol.toBuffer(),
            this.name.toBuffer(),
            this.initialSupply.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { symbol: this.symbol.toString(), name: this.name.toString(), initial_supply: this.initialSupply.toString() });
    }
    get operationHint() {
        return index_js_1.HINT.TOKEN.REGISTER_TOKEN.OPERATION;
    }
}
exports.RegisterTokenFact = RegisterTokenFact;
//# sourceMappingURL=register-token.js.map