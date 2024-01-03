"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawFact = exports.WithdrawItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../utils/index.js");
const index_js_5 = require("../../error/index.js");
class WithdrawItem extends item_js_1.CurrencyItem {
    constructor(target, amounts) {
        super(index_js_2.HINT.CURRENCY.WITHDRAW.ITEM, amounts);
        this.target = typeof target === "string" ? new index_js_3.Address(target) : target;
    }
    toBuffer() {
        return Buffer.concat([
            this.target.toBuffer(),
            Buffer.concat(this.amounts.sort(index_js_4.SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString() });
    }
    toString() {
        return this.target.toString();
    }
}
exports.WithdrawItem = WithdrawItem;
class WithdrawFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.CURRENCY.WITHDRAW.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate target found in items"));
        this.items.forEach(it => index_js_5.Assert.check(this.sender.toString() != it.target.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "sender is same with target address")));
    }
    get operationHint() {
        return index_js_2.HINT.CURRENCY.WITHDRAW.OPERATION;
    }
}
exports.WithdrawFact = WithdrawFact;
//# sourceMappingURL=withdraw.js.map