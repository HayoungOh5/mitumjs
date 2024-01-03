"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFact = exports.TransferItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../utils/index.js");
const index_js_3 = require("../../alias/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../error/index.js");
class TransferItem extends item_js_1.CurrencyItem {
    constructor(receiver, amounts) {
        super(index_js_3.HINT.CURRENCY.TRANSFER.ITEM, amounts);
        if (typeof receiver === "string") {
            if (receiver.endsWith(index_js_3.SUFFIX.ADDRESS.ZERO)) {
                this.receiver = new index_js_4.ZeroAddress(receiver);
            }
            else {
                this.receiver = new index_js_4.Address(receiver);
            }
        }
        else {
            this.receiver = receiver;
        }
        if (this.receiver.type === "zero") {
            for (const am of amounts) {
                index_js_5.Assert.check(am.currency.equal(this.receiver.currency), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_AMOUNT, "invalid amount currency for given zero address"));
            }
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            Buffer.concat(this.amounts.sort(index_js_2.SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString() });
    }
    toString() {
        return this.receiver.toString();
    }
}
exports.TransferItem = TransferItem;
class TransferFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_3.HINT.CURRENCY.TRANSFER.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate receiver found in items"));
        this.items.forEach(it => index_js_5.Assert.check(this.sender.toString() != it.receiver.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "sender is same with receiver address")));
    }
    get operationHint() {
        return index_js_3.HINT.CURRENCY.TRANSFER.OPERATION;
    }
}
exports.TransferFact = TransferFact;
//# sourceMappingURL=transfer.js.map