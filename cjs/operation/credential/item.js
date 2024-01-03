"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialItem = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../node/index.js");
const index_js_3 = require("../../key/index.js");
const index_js_4 = require("../../common/index.js");
const index_js_5 = require("../../error/index.js");
class CredentialItem extends index_js_1.Item {
    constructor(hint, contract, holder, templateID, id, currency) {
        super(hint);
        this.contract = index_js_3.Address.from(contract);
        this.holder = index_js_3.Address.from(holder);
        this.templateID = templateID;
        this.id = id;
        this.currency = index_js_4.CurrencyID.from(currency);
        index_js_5.Assert.check(index_js_2.Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "template id length out of range"));
        index_js_5.Assert.check(index_js_2.Config.CREDENTIAL.ID.satisfy(id.length), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "credential id length out of range"));
        index_js_5.Assert.check(this.contract.toString() !== this.holder.toString(), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_ITEM, "contract is same with holder address"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.holder.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.id),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), holder: this.holder.toString(), template_id: this.templateID, id: this.id, currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}
exports.CredentialItem = CredentialItem;
//# sourceMappingURL=item.js.map