"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSecurityTokenFact = exports.CreateSecurityTokenItem = void 0;
const item_js_1 = require("./item.js");
const partition_js_1 = require("./partition.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../types/index.js");
const index_js_4 = require("../../error/index.js");
class CreateSecurityTokenItem extends item_js_1.STOItem {
    constructor(contract, granularity, defaultPartition, currency) {
        super(index_js_2.HINT.STO.CREATE_SECURITY_TOKEN.ITEM, contract, currency);
        this.granularity = index_js_3.Big.from(granularity);
        this.defaultPartition = partition_js_1.Partition.from(defaultPartition);
        index_js_4.Assert.check(!this.granularity.isZero(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEM, "zero granularity"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.granularity.toBuffer("fill"),
            this.defaultPartition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { granularity: this.granularity.v, default_partition: this.defaultPartition.toString() });
    }
}
exports.CreateSecurityTokenItem = CreateSecurityTokenItem;
class CreateSecurityTokenFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.STO.CREATE_SECURITY_TOKEN.FACT, token, sender, items);
        index_js_4.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.STO.CREATE_SECURITY_TOKEN.OPERATION;
    }
}
exports.CreateSecurityTokenFact = CreateSecurityTokenFact;
//# sourceMappingURL=create-security-token.js.map