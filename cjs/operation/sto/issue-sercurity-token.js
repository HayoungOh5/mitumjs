"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueSecurityTokenFact = exports.IssueSecurityTokenItem = void 0;
const item_js_1 = require("./item.js");
const partition_js_1 = require("./partition.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class IssueSecurityTokenItem extends item_js_1.STOItem {
    constructor(contract, receiver, amount, partition, currency) {
        super(index_js_2.HINT.STO.ISSUE_SECURITY_TOKEN.ITEM, contract, currency);
        this.receiver = index_js_3.Address.from(receiver);
        this.amount = index_js_4.Big.from(amount);
        this.partition = partition_js_1.Partition.from(partition);
        index_js_5.Assert.check(this.contract.toString() !== this.receiver.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "contract is same with receiver address"));
        index_js_5.Assert.check(!this.amount.isZero(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString(), partition: this.partition.toString() });
    }
}
exports.IssueSecurityTokenItem = IssueSecurityTokenItem;
class IssueSecurityTokenFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.STO.ISSUE_SECURITY_TOKEN.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.STO.ISSUE_SECURITY_TOKEN.OPERATION;
    }
}
exports.IssueSecurityTokenFact = IssueSecurityTokenFact;
//# sourceMappingURL=issue-sercurity-token.js.map