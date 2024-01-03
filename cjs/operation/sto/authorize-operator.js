"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizeOperatorFact = exports.AuthorizeOperatorItem = void 0;
const item_js_1 = require("./item.js");
const partition_js_1 = require("./partition.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../error/index.js");
class AuthorizeOperatorItem extends item_js_1.STOItem {
    constructor(contract, operator, partition, currency) {
        super(index_js_2.HINT.STO.AUTHORIZE_OPERATOR.ITEM, contract, currency);
        this.operator = index_js_3.Address.from(operator);
        this.partition = partition_js_1.Partition.from(partition);
        index_js_4.Assert.check(this.contract.toString() !== this.operator.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEM, "contract is same with operator address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { operator: this.operator.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.operator.toString();
    }
}
exports.AuthorizeOperatorItem = AuthorizeOperatorItem;
class AuthorizeOperatorFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.STO.AUTHORIZE_OPERATOR.FACT, token, sender, items);
        index_js_4.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "duplicate operator found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.STO.AUTHORIZE_OPERATOR.OPERATION;
    }
}
exports.AuthorizeOperatorFact = AuthorizeOperatorFact;
//# sourceMappingURL=authorize-operator.js.map