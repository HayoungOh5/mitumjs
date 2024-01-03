"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFactSign = exports.GeneralFactSign = exports.FactSign = void 0;
const bs58_1 = __importDefault(require("bs58"));
const index_js_1 = require("../../types/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../error/index.js");
class FactSign {
    constructor(signer, signature, signedAt) {
        this.signature = signature;
        this.signedAt = new index_js_1.FullTimeStamp(signedAt);
        this.signer = index_js_2.Key.from(signer);
        index_js_3.Assert.get(this.signer.isPriv, index_js_3.MitumError.detail(index_js_3.ECODE.INVALID_PUBLIC_KEY, "not public key")).not().excute();
    }
    toBuffer() {
        return Buffer.concat([
            this.signer.toBuffer(),
            this.signature,
            this.signedAt.toBuffer("super")
        ]);
    }
    toHintedObject() {
        return {
            signer: this.signer.toString(),
            signature: bs58_1.default.encode(this.signature),
            signed_at: this.signedAt.ISO(),
        };
    }
}
exports.FactSign = FactSign;
class GeneralFactSign extends FactSign {
    constructor(signer, signature, signedAt) {
        super(signer, signature, signedAt);
    }
    toHintedObject() {
        return super.toHintedObject();
    }
}
exports.GeneralFactSign = GeneralFactSign;
class NodeFactSign extends FactSign {
    constructor(node, signer, signature, signedAt) {
        super(signer, signature, signedAt);
        this.node = index_js_2.NodeAddress.from(node);
    }
    toBuffer() {
        return Buffer.concat([
            this.node.toBuffer(),
            super.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { node: this.node.toString() });
    }
}
exports.NodeFactSign = NodeFactSign;
//# sourceMappingURL=factsign.js.map