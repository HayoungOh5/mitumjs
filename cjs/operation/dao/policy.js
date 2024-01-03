"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOPolicy = void 0;
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../common/index.js");
const index_js_3 = require("../../types/index.js");
class DAOPolicy {
    constructor(token, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum) {
        this.hint = new index_js_2.Hint(index_js_1.HINT.DAO.POLICY);
        this.token = index_js_2.CurrencyID.from(token);
        this.threshold = index_js_3.Big.from(threshold);
        this.fee = fee,
            this.whitelist = whitelist;
        this.proposalReviewPeriod = index_js_3.Big.from(proposalReviewPeriod);
        this.registrationPeriod = index_js_3.Big.from(registrationPeriod);
        this.preSnapshotPeriod = index_js_3.Big.from(preSnapshotPeriod);
        this.votingPeriod = index_js_3.Big.from(votingPeriod);
        this.postSnapshotPeriod = index_js_3.Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = index_js_3.Big.from(executionDelayPeriod);
        this.turnout = index_js_3.Big.from(turnout);
        this.quorum = index_js_3.Big.from(quorum);
    }
    toBuffer() {
        return Buffer.concat([
            this.token.toBuffer(),
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
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            token: this.token.toString(),
            threshold: this.threshold.toString(),
            fee: this.fee.toHintedObject(),
            whitelist: this.whitelist.toHintedObject(),
            proposal_review_period: this.proposalReviewPeriod.v,
            registration_period: this.registrationPeriod.v,
            pre_snapshot_period: this.preSnapshotPeriod.v,
            voting_period: this.votingPeriod.v,
            post_snapshot_period: this.postSnapshotPeriod.v,
            execution_delay_period: this.executionDelayPeriod.v,
            turnout: this.turnout.v,
            quorum: this.quorum.v,
        };
    }
}
exports.DAOPolicy = DAOPolicy;
//# sourceMappingURL=policy.js.map