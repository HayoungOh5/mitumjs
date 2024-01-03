"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../types/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../error/index.js");
class ApproveFact extends fact_js_1.PointFact {
    constructor(token, sender, contract, currency, approved, amount) {
        super(index_js_2.HINT.POINT.APPROVE.FACT, token, sender, contract, currency);
        this.approved = index_js_3.Address.from(approved);
        this.amount = index_js_1.Big.from(amount);
        index_js_4.Assert.check(this.contract.toString() !== this.approved.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "contract is same with approved address"));
        index_js_4.Assert.check(this.amount.compare(0) >= 0, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "under zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return index_js_2.HINT.POINT.APPROVE.OPERATION;
    }
}
exports.ApproveFact = ApproveFact;
//# sourceMappingURL=approve.js.map