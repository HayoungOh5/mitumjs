"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateFact = exports.DelegateItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../error/index.js");
class DelegateItem extends item_js_1.NFTItem {
    constructor(contract, operator, mode, currency) {
        super(index_js_2.HINT.NFT.DELEGATE.ITEM, contract, currency);
        this.operator = index_js_3.Address.from(operator);
        this.mode = mode;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            Buffer.from(this.mode),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { delegatee: this.operator.toString(), mode: this.mode });
    }
    toString() {
        return `${super.toString()}-${this.operator.toString()}`;
    }
}
exports.DelegateItem = DelegateItem;
class DelegateFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.NFT.DELEGATE.FACT, token, sender, items);
        index_js_4.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "duplicate operator found in items"));
        this.items.forEach(it => index_js_4.Assert.check(this.sender.toString() != it.contract.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return index_js_2.HINT.NFT.DELEGATE.OPERATION;
    }
}
exports.DelegateFact = DelegateFact;
//# sourceMappingURL=delegate.js.map