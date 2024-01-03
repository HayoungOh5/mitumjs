"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreSnapFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
class PreSnapFact extends fact_js_1.DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(index_js_1.HINT.DAO.PRE_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return index_js_1.HINT.DAO.PRE_SNAP.OPERATION;
    }
}
exports.PreSnapFact = PreSnapFact;
//# sourceMappingURL=pre-snap.js.map