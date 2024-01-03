"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveControllerFact = exports.RemoveControllerItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../error/index.js");
class RemoveControllerItem extends item_js_1.KYCItem {
    constructor(contract, controller, currency) {
        super(index_js_2.HINT.KYC.REMOVE_CONTROLLER.ITEM, contract, currency);
        this.controller = index_js_3.Address.from(controller);
        index_js_4.Assert.check(this.contract.toString() !== this.controller.toString(), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEM, "contract is same with controller address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.controller.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { controller: this.controller.toString() });
    }
    toString() {
        return `${super.toString()}-${this.controller.toString()}`;
    }
}
exports.RemoveControllerItem = RemoveControllerItem;
class RemoveControllerFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.KYC.REMOVE_CONTROLLER.FACT, token, sender, items);
        index_js_4.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "duplicate controller found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.KYC.REMOVE_CONTROLLER.OPERATION;
    }
}
exports.RemoveControllerFact = RemoveControllerFact;
//# sourceMappingURL=remove-controller.js.map