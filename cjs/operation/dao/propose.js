"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposeFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../error/index.js");
class ProposeFact extends fact_js_1.DAOFact {
    constructor(token, sender, contract, proposalID, proposal, currency) {
        super(index_js_1.HINT.DAO.PROPOSE.FACT, token, sender, contract, proposalID, currency);
        this.proposal = proposal;
        index_js_2.Assert.check(proposal.proposer.toString() === sender, index_js_2.MitumError.detail(index_js_2.ECODE.DAO.UNMATCHED_SENDER, `sender is unmatched with proposer of given proposal`));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.proposal.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { proposal: this.proposal.toHintedObject() });
    }
    get operationHint() {
        return index_js_1.HINT.DAO.PROPOSE.OPERATION;
    }
}
exports.ProposeFact = ProposeFact;
//# sourceMappingURL=propose.js.map