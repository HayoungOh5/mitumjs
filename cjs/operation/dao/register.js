"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../error/index.js");
class RegisterFact extends fact_js_1.DAOFact {
    constructor(token, sender, contract, proposalID, delegated, currency) {
        super(index_js_1.HINT.DAO.REGISTER.FACT, token, sender, contract, proposalID, currency);
        this.delegated = index_js_2.Address.from(delegated);
        index_js_3.Assert.check(this.contract.toString() !== this.delegated.toString(), index_js_3.MitumError.detail(index_js_3.ECODE.INVALID_FACT, "contract is same with delegated address"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.delegated.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { delegated: this.delegated.toString() });
    }
    get operationHint() {
        return index_js_1.HINT.DAO.REGISTER.OPERATION;
    }
}
exports.RegisterFact = RegisterFact;
//# sourceMappingURL=register.js.map