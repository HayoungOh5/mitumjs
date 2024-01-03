"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeStampFact = void 0;
const index_js_1 = require("../base/index.js");
class TimeStampFact extends index_js_1.ContractFact {
    constructor(hint, token, sender, target, currency) {
        super(hint, token, sender, target, currency);
        // this._hash = this.hashing()
    }
    toHintedObject() {
        const fact = super.toHintedObject();
        delete fact['contract'];
        return Object.assign(Object.assign({}, fact), { target: this.contract.toString() });
    }
}
exports.TimeStampFact = TimeStampFact;
//# sourceMappingURL=fact.js.map