"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostSnapFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
class PostSnapFact extends fact_js_1.DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(index_js_1.HINT.DAO.POST_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return index_js_1.HINT.DAO.POST_SNAP.OPERATION;
    }
}
exports.PostSnapFact = PostSnapFact;
//# sourceMappingURL=post-snap.js.map