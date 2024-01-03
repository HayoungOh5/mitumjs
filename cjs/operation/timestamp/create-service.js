"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateServiceFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
class CreateServiceFact extends fact_js_1.TimeStampFact {
    constructor(token, sender, target, currency) {
        super(index_js_1.HINT.TIMESTAMP.CREATE_SERVICE.FACT, token, sender, target, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return index_js_1.HINT.TIMESTAMP.CREATE_SERVICE.OPERATION;
    }
}
exports.CreateServiceFact = CreateServiceFact;
//# sourceMappingURL=create-service.js.map