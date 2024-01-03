"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevokeFact = exports.RevokeItem = void 0;
const index_js_1 = require("../base/index.js");
const item_js_1 = require("./item.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../error/index.js");
class RevokeItem extends item_js_1.CredentialItem {
    constructor(contract, holder, templateID, id, currency) {
        super(index_js_2.HINT.CREDENTIAL.REVOKE.ITEM, contract, holder, templateID, id, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
exports.RevokeItem = RevokeItem;
class RevokeFact extends index_js_1.OperationFact {
    constructor(token, sender, items) {
        super(index_js_2.HINT.CREDENTIAL.REVOKE.FACT, token, sender, items);
        index_js_3.Assert.check(new Set(items.map(it => it.toString())).size === items.length, index_js_3.MitumError.detail(index_js_3.ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return index_js_2.HINT.CREDENTIAL.REVOKE.OPERATION;
    }
}
exports.RevokeFact = RevokeFact;
//# sourceMappingURL=revoke.js.map