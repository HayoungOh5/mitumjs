"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../error/index.js");
class DAOFact extends index_js_1.ContractFact {
    constructor(hint, token, sender, contract, proposalID, currency) {
        super(hint, token, sender, contract, currency);
        this.proposalID = proposalID;
        index_js_2.Assert.check(this.proposalID !== "", index_js_2.MitumError.detail(index_js_2.ECODE.INVALID_FACT, "empty proposal id"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.proposalID),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { proposal_id: this.proposalID });
    }
}
exports.DAOFact = DAOFact;
//# sourceMappingURL=fact.js.map