"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignFact = exports.SignItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../types/index.js");
const index_js_4 = require("../../error/index.js");
class SignItem extends item_js_1.NFTItem {
    constructor(contract, nft, currency) {
        super(index_js_2.HINT.NFT.SIGN.ITEM, contract, currency);
        this.nft = index_js_3.Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { nft: this.nft.v });
    }
}
exports.SignItem = SignItem;
class SignFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.NFT.SIGN.FACT, token, sender, items);
        this.items.forEach(it => index_js_4.Assert.check(this.sender.toString() != it.contract.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return index_js_2.HINT.NFT.SIGN.OPERATION;
    }
}
exports.SignFact = SignFact;
//# sourceMappingURL=sign.js.map