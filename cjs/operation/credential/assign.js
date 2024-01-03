"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignFact = exports.AssignItem = void 0;
const index_js_1 = require("../base/index.js");
const item_js_1 = require("./item.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../error/index.js");
const index_js_5 = require("../../types/index.js");
class AssignItem extends item_js_1.CredentialItem {
    constructor(contract, holder, templateID, id, value, validFrom, validUntil, did, currency) {
        super(index_js_2.HINT.CREDENTIAL.ASSIGN.ITEM, contract, holder, templateID, id, currency);
        this.value = value;
        this.validFrom = index_js_5.Big.from(validFrom);
        this.validUntil = index_js_5.Big.from(validUntil);
        this.did = did;
        index_js_4.Assert.check(index_js_3.Config.CREDENTIAL.VALUE.satisfy(value.length), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEM, "credential value length out of range"));
        index_js_4.Assert.check(validFrom < validUntil, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEM, "valid until <= valid from"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.value),
            this.validFrom.toBuffer("fill"),
            this.validUntil.toBuffer("fill"),
            Buffer.from(this.did),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { value: this.value, valid_from: this.validFrom.v, valid_until: this.validUntil.v, did: this.did });
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
exports.AssignItem = AssignItem;
class AssignFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.CREDENTIAL.ASSIGN.FACT, token, sender, items);
        index_js_4.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.CREDENTIAL.ASSIGN.OPERATION;
    }
}
exports.AssignFact = AssignFact;
//# sourceMappingURL=assign.js.map