"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signers = exports.Signer = void 0;
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../common/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../utils/index.js");
const index_js_6 = require("../../error/index.js");
const index_js_7 = require("../../types/index.js");
class Signer {
    constructor(account, share, signed) {
        this.hint = new index_js_2.Hint(index_js_1.HINT.NFT.SIGNER);
        this.account = index_js_4.Address.from(account);
        this.share = index_js_7.Big.from(share);
        this.signed = index_js_7.Bool.from(signed);
        index_js_6.Assert.check(index_js_3.Config.NFT.SHARE.satisfy(this.share.v), index_js_6.MitumError.detail(index_js_6.ECODE.NFT.INVALID_NFT_SIGNER, "share out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.account.toBuffer(),
            this.share.toBuffer("fill"),
            this.signed.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            account: this.account.toString(),
            share: this.share.v,
            signed: this.signed.v,
        };
    }
}
exports.Signer = Signer;
class Signers {
    constructor(total, signers) {
        this.hint = new index_js_2.Hint(index_js_1.HINT.NFT.SIGNERS);
        this.total = index_js_7.Big.from(total);
        this.signers = signers;
        index_js_6.Assert.check(index_js_3.Config.NFT.SIGNERS_IN_SIGNERS.satisfy(this.signers.length), index_js_6.MitumError.detail(index_js_6.ECODE.NFT.INVALID_NFT_SIGNERS, "signers length out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.total.toBuffer("fill"),
            Buffer.concat(this.signers.sort(index_js_5.SortFunc).map(s => s.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            total: this.total.v,
            signers: this.signers.sort(index_js_5.SortFunc).map(s => s.toHintedObject()),
        };
    }
}
exports.Signers = Signers;
//# sourceMappingURL=signer.js.map