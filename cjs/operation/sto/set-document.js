"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDocumentFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../alias/index.js");
class SetDocumentFact extends index_js_1.ContractFact {
    constructor(token, sender, contract, title, uri, documentHash, currency) {
        super(index_js_2.HINT.STO.SET_DOCUMENT.FACT, token, sender, contract, currency);
        this.title = title;
        this.uri = uri;
        this.documentHash = documentHash;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.title),
            Buffer.from(this.uri),
            Buffer.from(this.documentHash),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { title: this.title, uri: this.uri, documenthash: this.documentHash });
    }
    get operationHint() {
        return index_js_2.HINT.STO.SET_DOCUMENT.OPERATION;
    }
}
exports.SetDocumentFact = SetDocumentFact;
//# sourceMappingURL=set-document.js.map