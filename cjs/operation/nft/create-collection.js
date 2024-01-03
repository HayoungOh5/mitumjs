"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCollectionFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../types/index.js");
const index_js_6 = require("../../error/index.js");
const index_js_7 = require("../../utils/index.js");
class CreateCollectionFact extends index_js_1.ContractFact {
    constructor(token, sender, contract, name, royalty, uri, whitelist, currency) {
        super(index_js_2.HINT.NFT.CREATE_COLLECTION.FACT, token, sender, contract, currency);
        this.name = index_js_5.LongString.from(name);
        this.royalty = index_js_5.Big.from(royalty);
        this.uri = index_js_5.LongString.from(uri);
        this.whitelist = whitelist ? whitelist.map(w => index_js_4.Address.from(w)) : [];
        index_js_6.Assert.check(index_js_3.Config.NFT.ROYALTY.satisfy(this.royalty.v), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "royalty out of range"));
        index_js_6.Assert.check(index_js_3.Config.NFT.ADDRESS_IN_WHITELIST.satisfy(this.whitelist.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "whitelist length out of range"));
        index_js_6.Assert.check((0, index_js_7.hasOverlappingAddress)(this.whitelist), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "duplicate address found in whitelist"));
        this.whitelist.forEach(a => index_js_6.Assert.check(this.contract.toString() !== a.toString(), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.whitelist.sort(index_js_7.SortFunc).map(w => w.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { name: this.name.toString(), royalty: this.royalty.v, uri: this.uri.toString(), whitelist: this.whitelist.sort(index_js_7.SortFunc).map(w => w.toString()) });
    }
    get operationHint() {
        return index_js_2.HINT.NFT.CREATE_COLLECTION.OPERATION;
    }
}
exports.CreateCollectionFact = CreateCollectionFact;
//# sourceMappingURL=create-collection.js.map