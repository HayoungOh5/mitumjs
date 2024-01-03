"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAccountFact = exports.CreateAccountItem = void 0;
const bs58_1 = __importDefault(require("bs58"));
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../utils/index.js");
const index_js_3 = require("../../alias/index.js");
const index_js_4 = require("../../error/index.js");
class CreateAccountItem extends item_js_1.CurrencyItem {
    constructor(keys, amounts, addressType) {
        super(index_js_3.HINT.CURRENCY.CREATE_ACCOUNT.ITEM, amounts, addressType);
        this.keys = keys;
        if (addressType === "mitum") {
            this.addressSuffix = index_js_3.SUFFIX.ADDRESS.MITUM;
        }
        else {
            this.addressSuffix = index_js_3.SUFFIX.ADDRESS.ETHER;
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.from(this.addressSuffix),
            Buffer.concat(this.amounts.sort(index_js_2.SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { keys: this.keys.toHintedObject(), addrtype: this.addressSuffix });
    }
    toString() {
        return bs58_1.default.encode(this.keys.toBuffer());
    }
}
exports.CreateAccountItem = CreateAccountItem;
class CreateAccountFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_3.HINT.CURRENCY.CREATE_ACCOUNT.FACT, token, sender, items);
        index_js_4.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "duplicate key hash found in items"));
    }
    get operationHint() {
        return index_js_3.HINT.CURRENCY.CREATE_ACCOUNT.OPERATION;
    }
}
exports.CreateAccountFact = CreateAccountFact;
//# sourceMappingURL=create-account.js.map