"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferFact = exports.TransferItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class TransferItem extends item_js_1.NFTItem {
    constructor(contract, receiver, nft, currency) {
        super(index_js_2.HINT.NFT.TRANSFER.ITEM, contract, currency);
        this.receiver = index_js_3.Address.from(receiver);
        this.nft = index_js_4.Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), nft: this.nft.v });
    }
    toString() {
        return `${super.toString()}-${this.nft.toString()}`;
    }
}
exports.TransferItem = TransferItem;
class TransferFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.NFT.TRANSFER.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate nft found in items"));
        this.items.forEach(it => index_js_5.Assert.check(this.sender.toString() != it.contract.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return index_js_2.HINT.NFT.TRANSFER.OPERATION;
    }
}
exports.TransferFact = TransferFact;
//# sourceMappingURL=transfer.js.map