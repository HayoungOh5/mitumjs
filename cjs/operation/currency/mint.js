"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintFact = exports.MintItem = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../utils/index.js");
const index_js_6 = require("../../error/index.js");
class MintItem extends index_js_1.Item {
    constructor(receiver, amount) {
        super(index_js_2.HINT.CURRENCY.MINT.ITEM);
        this.amount = amount;
        this.receiver = index_js_4.Address.from(receiver);
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toHintedObject() });
    }
    toString() {
        return `${this.receiver.toString()}-${this.amount.currency.toString()}`;
    }
}
exports.MintItem = MintItem;
class MintFact extends index_js_1.NodeFact {
    constructor(token, items) {
        super(index_js_2.HINT.CURRENCY.MINT.FACT, token);
        index_js_6.Assert.check(index_js_3.Config.ITEMS_IN_FACT.satisfy(items.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_ITEMS, "items length out of range"));
        index_js_6.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_ITEMS, "duplicate receiver-currency found in items"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.concat(this.items.sort(index_js_5.SortFunc).map(it => it.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { items: this.items.sort(index_js_5.SortFunc).map(it => it.toHintedObject()) });
    }
    get operationHint() {
        return index_js_2.HINT.CURRENCY.MINT.OPERATION;
    }
}
exports.MintFact = MintFact;
//# sourceMappingURL=mint.js.map