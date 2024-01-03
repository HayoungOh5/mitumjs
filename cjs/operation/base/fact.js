"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFact = exports.ContractFact = exports.OperationFact = exports.Fact = void 0;
const bs58_1 = __importDefault(require("bs58"));
const index_js_1 = require("../../node/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../utils/index.js");
const index_js_4 = require("../../common/index.js");
const index_js_5 = require("../../error/index.js");
class Fact {
    constructor(hint, token) {
        this.hint = new index_js_4.Hint(hint);
        this.token = new index_js_4.Token(token);
        this._hash = Buffer.from([]);
    }
    get hash() {
        return this._hash;
    }
    hashing() {
        return (0, index_js_3.sha3)(this.toBuffer());
    }
    toBuffer() {
        return this.token.toBuffer();
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            hash: bs58_1.default.encode(this.hash ? this.hash : []),
            token: this.token.toString()
        };
    }
}
exports.Fact = Fact;
class OperationFact extends Fact {
    constructor(hint, token, sender, items) {
        super(hint, token);
        this.sender = index_js_2.Address.from(sender);
        index_js_5.Assert.check(index_js_1.Config.ITEMS_IN_FACT.satisfy(items.length));
        index_js_5.Assert.check(new Set(items.map(i => i.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate items found"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            Buffer.concat(this.items.sort(index_js_3.SortFunc).map((i) => i.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), items: this.items.sort(index_js_3.SortFunc).map(i => i.toHintedObject()) });
    }
}
exports.OperationFact = OperationFact;
class ContractFact extends Fact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token);
        this.sender = index_js_2.Address.from(sender);
        this.contract = index_js_2.Address.from(contract);
        this.currency = index_js_4.CurrencyID.from(currency);
        index_js_5.Assert.check(this.sender.toString() !== this.contract.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_FACT, "sender is same with contract address"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), contract: this.contract.toString(), currency: this.currency.toString() });
    }
}
exports.ContractFact = ContractFact;
class NodeFact extends Fact {
    constructor(hint, token) {
        super(hint, token);
    }
}
exports.NodeFact = NodeFact;
//# sourceMappingURL=fact.js.map