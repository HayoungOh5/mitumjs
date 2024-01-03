"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemTokenFact = exports.RedeemTokenItem = void 0;
const item_js_1 = require("./item.js");
const partition_js_1 = require("./partition.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class RedeemTokenItem extends item_js_1.STOItem {
    constructor(contract, tokenHolder, amount, partition, currency) {
        super(index_js_2.HINT.STO.REDEEM.ITEM, contract, currency);
        this.tokenHolder = index_js_3.Address.from(tokenHolder);
        this.amount = index_js_4.Big.from(amount);
        this.partition = partition_js_1.Partition.from(partition);
        index_js_5.Assert.check(this.contract.toString() !== this.tokenHolder.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "contract is same with token holder address"));
        index_js_5.Assert.check(!this.amount.isZero(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { tokenHolder: this.tokenHolder.toString(), amount: this.amount.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.tokenHolder.toString();
    }
}
exports.RedeemTokenItem = RedeemTokenItem;
class RedeemTokenFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.STO.REDEEM.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate token holder found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.STO.REDEEM.OPERATION;
    }
}
exports.RedeemTokenFact = RedeemTokenFact;
//# sourceMappingURL=redeem-token.js.map