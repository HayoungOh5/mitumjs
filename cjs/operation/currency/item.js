"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyItem = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../node/index.js");
const index_js_3 = require("../../utils/index.js");
const index_js_4 = require("../../error/index.js");
class CurrencyItem extends index_js_1.Item {
    constructor(hint, amounts, addressType) {
        super(hint);
        index_js_4.Assert.check(index_js_2.Config.AMOUNTS_IN_ITEM.satisfy(amounts.length), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_AMOUNTS, "amounts length out of range"));
        index_js_4.Assert.check(new Set(amounts.map(am => am.currency.toString())).size === amounts.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts"));
        this.amounts = amounts;
        this.addressType = addressType !== null && addressType !== void 0 ? addressType : "";
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { amounts: this.amounts.sort(index_js_3.SortFunc).map(am => am.toHintedObject()) });
    }
}
exports.CurrencyItem = CurrencyItem;
//# sourceMappingURL=item.js.map