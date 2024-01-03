"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceFact = void 0;
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../base/index.js");
class CreateServiceFact extends index_js_2.ContractFact {
    constructor(token, sender, contract, currency) {
        super(index_js_1.HINT.CREDENTIAL.CREATE_SERVICE.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return index_js_1.HINT.CREDENTIAL.CREATE_SERVICE.OPERATION;
    }
}
exports.CreateServiceFact = CreateServiceFact;
//# sourceMappingURL=create-service.js.map