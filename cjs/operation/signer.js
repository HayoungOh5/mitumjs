"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
const bs58_1 = __importDefault(require("bs58"));
const index_js_1 = require("./base/index.js");
const index_js_2 = require("../utils/index.js");
const index_js_3 = require("../key/index.js");
const index_js_4 = require("../types/index.js");
const index_js_5 = require("../error/index.js");
class Signer extends index_js_4.Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    sign(privatekey, json, option) {
        var _a;
        const keypair = index_js_3.KeyPair.fromPrivateKey(privatekey);
        return option ? this.nodeSign(keypair, json, (_a = option.node) !== null && _a !== void 0 ? _a : "") : this.accSign(keypair, json);
    }
    accSign(keypair, json) {
        const now = index_js_4.TimeStamp.new();
        const fs = new index_js_1.GeneralFactSign(keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            bs58_1.default.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs !== undefined) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        index_js_5.Assert.check(new Set(json.signs.map(fs => fs.signer.toString())).size === json.signs.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            bs58_1.default.decode(s.signature),
            new index_js_4.FullTimeStamp(s.signed_at).toBuffer("super"),
        ]));
        //.sort((a, b) => Buffer.compare(a, b))
        const msg = Buffer.concat([
            bs58_1.default.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = bs58_1.default.encode((0, index_js_2.sha3)(msg));
        return json;
    }
    nodeSign(keypair, json, node) {
        const nd = new index_js_3.NodeAddress(node);
        const now = index_js_4.TimeStamp.new();
        const fs = new index_js_1.NodeFactSign(node, keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            nd.toBuffer(),
            bs58_1.default.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            bs58_1.default.decode(s.signature),
            new index_js_4.FullTimeStamp(s.signed_at).toBuffer("super"),
        ]))
            .sort((a, b) => Buffer.compare(a, b));
        const msg = Buffer.concat([
            bs58_1.default.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = bs58_1.default.encode((0, index_js_2.sha3)(msg));
        return json;
    }
}
exports.Signer = Signer;
//# sourceMappingURL=signer.js.map