"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintFact = exports.MintItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class MintItem extends item_js_1.NFTItem {
    constructor(contract, receiver, hash, uri, creators, currency) {
        super(index_js_2.HINT.NFT.MINT.ITEM, contract, currency);
        this.receiver = index_js_3.Address.from(receiver);
        this.hash = index_js_4.LongString.from(hash);
        this.uri = index_js_4.LongString.from(uri);
        this.creators = creators;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.hash.toBuffer(),
            this.uri.toBuffer(),
            this.creators.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), hash: this.hash.toString(), uri: this.uri.toString(), creators: this.creators.toHintedObject() });
    }
}
exports.MintItem = MintItem;
class MintFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.NFT.MINT.FACT, token, sender, items);
        this.items.forEach(it => index_js_5.Assert.check(this.sender.toString() != it.contract.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return index_js_2.HINT.NFT.MINT.OPERATION;
    }
}
exports.MintFact = MintFact;
//# sourceMappingURL=mint.js.map