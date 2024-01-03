"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePolicyFact = void 0;
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../types/index.js");
const index_js_3 = require("../../alias/index.js");
const index_js_4 = require("../../node/index.js");
const index_js_5 = require("../../common/index.js");
const index_js_6 = require("../../error/index.js");
class UpdatePolicyFact extends index_js_1.ContractFact {
    constructor(token, sender, contract, option, votingPowerToken, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum, currency) {
        super(index_js_3.HINT.DAO.UPDATE_POLICY.FACT, token, sender, contract, currency);
        this.option = option;
        this.votingPowerToken = index_js_5.CurrencyID.from(votingPowerToken);
        this.threshold = index_js_2.Big.from(threshold);
        this.fee = fee;
        this.whitelist = whitelist;
        this.proposalReviewPeriod = index_js_2.Big.from(proposalReviewPeriod);
        this.registrationPeriod = index_js_2.Big.from(registrationPeriod);
        this.preSnapshotPeriod = index_js_2.Big.from(preSnapshotPeriod);
        this.votingPeriod = index_js_2.Big.from(votingPeriod);
        this.postSnapshotPeriod = index_js_2.Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = index_js_2.Big.from(executionDelayPeriod);
        this.turnout = index_js_2.Big.from(turnout);
        this.quorum = index_js_2.Big.from(quorum);
        index_js_6.Assert.check(index_js_4.Config.DAO.QUORUM.satisfy(this.turnout.v), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "turnout out of range"));
        index_js_6.Assert.check(index_js_4.Config.DAO.QUORUM.satisfy(this.quorum.v), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "quorum out of range"));
        this.whitelist.accounts.forEach(a => index_js_6.Assert.check(this.contract.toString() !== a.toString(), index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.option),
            this.votingPowerToken.toBuffer(),
            this.threshold.toBuffer(),
            this.fee.toBuffer(),
            this.whitelist.toBuffer(),
            this.proposalReviewPeriod.toBuffer("fill"),
            this.registrationPeriod.toBuffer("fill"),
            this.preSnapshotPeriod.toBuffer("fill"),
            this.votingPeriod.toBuffer("fill"),
            this.postSnapshotPeriod.toBuffer("fill"),
            this.executionDelayPeriod.toBuffer("fill"),
            this.turnout.toBuffer(),
            this.quorum.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { option: this.option, voting_power_token: this.votingPowerToken.toString(), threshold: this.threshold.toString(), fee: this.fee.toHintedObject(), whitelist: this.whitelist.toHintedObject(), proposal_review_period: this.proposalReviewPeriod.v, registration_period: this.registrationPeriod.v, pre_snapshot_period: this.preSnapshotPeriod.v, voting_period: this.votingPeriod.v, post_snapshot_period: this.postSnapshotPeriod.v, execution_delay_period: this.executionDelayPeriod.v, turnout: this.turnout.v, quorum: this.quorum.v });
    }
    get operationHint() {
        return index_js_3.HINT.DAO.UPDATE_POLICY.OPERATION;
    }
}
exports.UpdatePolicyFact = UpdatePolicyFact;
//# sourceMappingURL=update-policy.js.map