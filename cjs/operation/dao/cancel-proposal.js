"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelProposalFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
class CancelProposalFact extends fact_js_1.DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(index_js_1.HINT.DAO.CANCEL_PROPOSAL.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return index_js_1.HINT.DAO.CANCEL_PROPOSAL.OPERATION;
    }
}
exports.CancelProposalFact = CancelProposalFact;
//# sourceMappingURL=cancel-proposal.js.map