"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOperatorFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../utils/index.js");
const index_js_5 = require("../../common/index.js");
class UpdateOperatorFact extends index_js_1.Fact {
    constructor(token, sender, contract, currency, operators) {
        super(index_js_2.HINT.CURRENCY.UPDATE_OPERATOR.FACT, token);
        this.sender = index_js_3.Address.from(sender);
        this.contract = index_js_3.Address.from(contract);
        this.currency = index_js_5.CurrencyID.from(currency);
        this.operators = operators.map(a => index_js_3.Address.from(a));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.operators.sort(index_js_4.SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), contract: this.contract.toString(), currency: this.currency.toString(), operators: this.operators.sort(index_js_4.SortFunc).map((w) => w.toString()) });
    }
    get operationHint() {
        return index_js_2.HINT.CURRENCY.UPDATE_OPERATOR.OPERATION;
    }
}
exports.UpdateOperatorFact = UpdateOperatorFact;
//# sourceMappingURL=update-operator.js.map