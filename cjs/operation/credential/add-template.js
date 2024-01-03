"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTemplateFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../types/index.js");
const index_js_6 = require("../../error/index.js");
class AddTemplateFact extends index_js_1.ContractFact {
    constructor(token, sender, contract, templateID, templateName, serviceDate, expirationDate, templateShare, multiAudit, displayName, subjectKey, description, creator, currency) {
        super(index_js_2.HINT.CREDENTIAL.ADD_TEMPLATE.FACT, token, sender, contract, currency);
        this.templateID = templateID;
        this.templateName = templateName;
        this.serviceDate = index_js_5.ShortDate.from(serviceDate);
        this.expirationDate = index_js_5.ShortDate.from(expirationDate);
        this.templateShare = index_js_5.Bool.from(templateShare);
        this.multiAudit = index_js_5.Bool.from(multiAudit);
        this.displayName = displayName;
        this.subjectKey = subjectKey;
        this.description = description;
        this.creator = index_js_4.Address.from(creator);
        index_js_6.Assert.check(index_js_3.Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "template id length out of range"));
        index_js_6.Assert.check(index_js_3.Config.CREDENTIAL.TEMPLATE_NAME.satisfy(templateName.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "template name length out of range"));
        index_js_6.Assert.check(index_js_3.Config.CREDENTIAL.DISPLAY_NAME.satisfy(displayName.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "display name length out of range"));
        index_js_6.Assert.check(index_js_3.Config.CREDENTIAL.SUBJECT_KEY.satisfy(subjectKey.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "subject key length out of range"));
        index_js_6.Assert.check(index_js_3.Config.CREDENTIAL.DESCRIPTION.satisfy(description.length), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "description length out of range"));
        index_js_6.Assert.check(Date.parse(serviceDate.toString()) <= Date.parse(expirationDate.toString()), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "expire date < service date"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.templateName),
            this.serviceDate.toBuffer(),
            this.expirationDate.toBuffer(),
            this.templateShare.toBuffer(),
            this.multiAudit.toBuffer(),
            Buffer.from(this.displayName),
            Buffer.from(this.subjectKey),
            Buffer.from(this.description),
            this.creator.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { template_id: this.templateID, template_name: this.templateName, service_date: this.serviceDate.toString(), expiration_date: this.expirationDate.toString(), template_share: this.templateShare.v, multi_audit: this.multiAudit.v, display_name: this.displayName, subject_key: this.subjectKey, description: this.description, creator: this.creator.toString() });
    }
    get operationHint() {
        return index_js_2.HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION;
    }
}
exports.AddTemplateFact = AddTemplateFact;
//# sourceMappingURL=add-template.js.map