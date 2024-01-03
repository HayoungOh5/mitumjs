"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTItem = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../common/index.js");
class NFTItem extends index_js_1.Item {
    constructor(hint, contract, currency) {
        super(hint);
        this.contract = index_js_2.Address.from(contract);
        this.currency = index_js_3.CurrencyID.from(currency);
    }
    toBuffer() {
        return this.contract.toBuffer();
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}
exports.NFTItem = NFTItem;
//# sourceMappingURL=item.js.map