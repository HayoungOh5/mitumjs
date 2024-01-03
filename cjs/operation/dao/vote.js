"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoteFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../types/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../error/index.js");
class VoteFact extends fact_js_1.DAOFact {
    constructor(token, sender, contract, proposalID, vote, currency) {
        super(index_js_2.HINT.DAO.VOTE.FACT, token, sender, contract, proposalID, currency);
        index_js_4.Assert.check(index_js_3.Config.DAO.VOTE.satisfy(Number(vote)), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "vote option out of range"));
        this.vote = index_js_1.Big.from(vote);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.vote.v === 0 ? Buffer.from([0x00]) : this.vote.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { vote: this.vote.v });
    }
    get operationHint() {
        return index_js_2.HINT.DAO.VOTE.OPERATION;
    }
}
exports.VoteFact = VoteFact;
//# sourceMappingURL=vote.js.map