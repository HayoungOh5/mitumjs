"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveFact = exports.ApproveItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class ApproveItem extends item_js_1.NFTItem {
    constructor(contract, approved, nftIDX, currency) {
        super(index_js_2.HINT.NFT.APPROVE.ITEM, contract, currency);
        this.approved = index_js_3.Address.from(approved);
        this.nftIDX = index_js_4.Big.from(nftIDX);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.nftIDX.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), nftidx: this.nftIDX.v });
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
}
exports.ApproveItem = ApproveItem;
class ApproveFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.NFT.APPROVE.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate approve found in items"));
        this.items.forEach(it => index_js_5.Assert.check(this.sender.toString() != it.contract.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return index_js_2.HINT.NFT.APPROVE.OPERATION;
    }
}
exports.ApproveFact = ApproveFact;
//# sourceMappingURL=approve.js.map