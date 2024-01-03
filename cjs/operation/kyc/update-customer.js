"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerFact = exports.UpdateCustomerItem = void 0;
const item_js_1 = require("./item.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../error/index.js");
class UpdateCustomerItem extends item_js_1.KYCItem {
    constructor(contract, customer, status, currency) {
        super(index_js_2.HINT.KYC.UPDATE_CUSTOMER.ITEM, contract, currency);
        this.customer = index_js_3.Address.from(customer);
        this.status = index_js_4.Bool.from(status);
        index_js_5.Assert.check(this.contract.toString() !== this.customer.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "contract is same with customer address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.customer.toBuffer(),
            this.status.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { customer: this.customer.toString(), status: this.status.v });
    }
    toString() {
        return `${super.toString()}-${this.customer.toString()}`;
    }
}
exports.UpdateCustomerItem = UpdateCustomerItem;
class UpdateCustomerFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.KYC.UPDATE_CUSTOMER.FACT, token, sender, items);
        index_js_5.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEMS, "duplicate customer found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.KYC.UPDATE_CUSTOMER.OPERATION;
    }
}
exports.UpdateCustomerFact = UpdateCustomerFact;
//# sourceMappingURL=update-customer.js.map