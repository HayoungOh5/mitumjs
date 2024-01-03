"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operation = void 0;
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = require("fs");
const factsign_js_1 = require("./factsign.js");
const index_js_1 = require("../../common/index.js");
const index_js_2 = require("../../utils/index.js");
const index_js_3 = require("../../error/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../types/index.js");
class Operation {
    constructor(networkID, fact, memo) {
        this.id = networkID;
        this.memo = memo !== null && memo !== void 0 ? memo : "";
        this.fact = fact;
        this.hint = new index_js_1.Hint(fact.operationHint);
        this._factSigns = [];
        this._hash = Buffer.from([]);
    }
    setFactSigns(factSigns) {
        if (!factSigns) {
            return;
        }
        index_js_3.Assert.check(new Set(factSigns.map(fs => fs.signer.toString())).size === factSigns.length, index_js_3.MitumError.detail(index_js_3.ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        this._factSigns = factSigns;
        this._hash = this.hashing();
    }
    get factSigns() {
        return this._factSigns;
    }
    get hash() {
        return this._hash;
    }
    get factSignType() {
        return this.getSigType();
    }
    getSigType(factSigns) {
        if (!factSigns) {
            factSigns = this._factSigns;
        }
        if (factSigns.length === 0) {
            return null;
        }
        const set = new Set(factSigns.map(fs => Object.getPrototypeOf(fs).constructor.name));
        index_js_3.Assert.check(set.size === 1, index_js_3.MitumError.detail(index_js_3.ECODE.INVALID_FACTSIGNS, "multiple sig-type in operation"));
        return Array.from(set)[0];
    }
    hashing(force) {
        let b = (0, index_js_2.sha3)(this.toBuffer());
        if (force && force === "force") {
            this._hash = b;
        }
        return b;
    }
    sign(privateKey, option) {
        var _a;
        privateKey = index_js_4.Key.from(privateKey);
        const keypair = index_js_4.KeyPair.fromPrivateKey(privateKey);
        const sigType = this.factSignType;
        if (sigType === "NodeFactSign") {
            index_js_3.Assert.check(option !== undefined, index_js_3.MitumError.detail(index_js_3.ECODE.FAIL_SIGN, "no node address in sign option"));
        }
        const factSign = this.signWithSigType(sigType, keypair, option ? new index_js_4.NodeAddress((_a = option.node) !== null && _a !== void 0 ? _a : "") : undefined);
        const idx = this._factSigns
            .map((fs) => fs.signer.toString())
            .indexOf(keypair.publicKey.toString());
        if (idx < 0) {
            this._factSigns.push(factSign);
        }
        else {
            this._factSigns[idx] = factSign;
        }
        this._hash = this.hashing();
    }
    signWithSigType(sigType, keypair, node) {
        const getFactSign = (keypair, hash) => {
            const now = index_js_5.TimeStamp.new();
            return new factsign_js_1.GeneralFactSign(keypair.publicKey, keypair.sign(Buffer.concat([Buffer.from(this.id), hash, now.toBuffer()])), now.toString());
        };
        const getNodeFactSign = (node, keypair, hash) => {
            const now = index_js_5.TimeStamp.new();
            return new factsign_js_1.NodeFactSign(node.toString(), keypair.publicKey, keypair.sign(Buffer.concat([
                Buffer.from(this.id),
                node.toBuffer(),
                hash,
                now.toBuffer(),
            ])), now.toString());
        };
        const hash = this.fact.hash;
        if (sigType) {
            if (sigType == "NodeFactSign") {
                index_js_3.Assert.check(node !== undefined, index_js_3.MitumError.detail(index_js_3.ECODE.FAIL_SIGN, "no node address"));
                return getNodeFactSign(node, keypair, hash);
            }
            return getFactSign(keypair, hash);
        }
        else {
            if (node) {
                return getNodeFactSign(node, keypair, hash);
            }
            return getFactSign(keypair, hash);
        }
    }
    toBuffer() {
        if (!this._factSigns) {
            return this.fact.hash;
        }
        this._factSigns = this._factSigns.sort(index_js_2.SortFunc);
        return Buffer.concat([
            this.fact.hash,
            Buffer.concat(this._factSigns.map((fs) => fs.toBuffer())),
        ]);
    }
    toHintedObject() {
        const op = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : bs58_1.default.encode(this._hash)
        };
        const operation = this.memo ? op : Object.assign(Object.assign({}, op), { memo: this.memo });
        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(index_js_2.SortFunc);
        return Object.assign(Object.assign({}, operation), { signs: factSigns.map(fs => fs.toHintedObject()) });
    }
    export(filePath) {
        (0, fs_1.writeFile)(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
            if (e) {
                throw index_js_3.MitumError.detail(index_js_3.ECODE.FAIL_FILE_CREATION, "fs write-file failed");
            }
        });
    }
}
exports.Operation = Operation;
//# sourceMappingURL=operation.js.map