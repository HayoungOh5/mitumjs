"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferSecurityTokenPartitionFact = exports.TransferSecurityTokenPartitionItem = void 0;
const item_js_1 = require("./item.js");
const partition_js_1 = require("./partition.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class TransferSecurityTokenPartitionItem extends item_js_1.STOItem {
    constructor(contract, tokenHolder, receiver, partition, amount, currency) {
        super(index_js_2.HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.ITEM, contract, currency);
        this.tokenHolder = index_js_3.Address.from(tokenHolder);
        this.receiver = index_js_3.Address.from(receiver);
        this.partition = partition_js_1.Partition.from(partition);
        this.amount = index_js_4.Big.from(amount);
        index_js_5.Assert.check(this.contract.toString() !== this.tokenHolder.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "contract is same with token holder address"));
        index_js_5.Assert.check(this.contract.toString() !== this.receiver.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "contract is same with receiver address"));
        index_js_5.Assert.check(this.tokenHolder.toString() !== this.receiver.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "token holder is same with receiver address"));
        index_js_5.Assert.check(!this.amount.isZero(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.receiver.toBuffer(),
            this.partition.toBuffer(),
            this.amount.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { tokenholder: this.tokenHolder.toString(), receiver: this.receiver.toString(), partition: this.partition.toString(), amount: this.amount.toString() });
    }
    toString() {
        return `${this.tokenHolder.toString()}-${this.receiver.toString()}-${this.partition.toString()}`;
    }
}
exports.TransferSecurityTokenPartitionItem = TransferSecurityTokenPartitionItem;
class TransferSecurityTokenPartitionFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate token holder-receiver-partition found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.OPERATION;
    }
}
exports.TransferSecurityTokenPartitionFact = TransferSecurityTokenPartitionFact;
//# sourceMappingURL=transfer-security-token-partition.js.map