"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFromFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../types/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../error/index.js");
class TransferFromFact extends fact_js_1.TokenFact {
    constructor(token, sender, contract, currency, receiver, target, amount) {
        super(index_js_2.HINT.TOKEN.TRANSFER_FROM.FACT, token, sender, contract, currency);
        this.receiver = index_js_3.Address.from(receiver);
        this.target = index_js_3.Address.from(target);
        this.amount = index_js_1.Big.from(amount);
        index_js_4.Assert.check(this.contract.toString() !== this.receiver.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "contract is same with receiver address"));
        index_js_4.Assert.check(this.contract.toString() !== this.target.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "contract is same with target address"));
        index_js_4.Assert.check(this.amount.compare(0) > 0, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), target: this.target.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return index_js_2.HINT.TOKEN.TRANSFER_FROM.OPERATION;
    }
}
exports.TransferFromFact = TransferFromFact;
//# sourceMappingURL=transfer-from.js.map