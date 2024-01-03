"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAO = void 0;
const create_dao_js_1 = require("./create-dao.js");
const propose_js_1 = require("./propose.js");
const cancel_proposal_js_1 = require("./cancel-proposal.js");
const register_js_1 = require("./register.js");
const pre_snap_js_1 = require("./pre-snap.js");
const post_snap_js_1 = require("./post-snap.js");
const vote_js_1 = require("./vote.js");
const execute_js_1 = require("./execute.js");
const policy_js_1 = require("./policy.js");
const whitelist_js_1 = require("./whitelist.js");
const proposal_js_1 = require("./proposal.js");
const proposal_js_2 = require("./proposal.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../common/index.js");
const index_js_4 = require("../../api/index.js");
const index_js_5 = require("../../types/index.js");
const update_policy_js_1 = require("./update-policy.js");
const index_js_6 = require("../../error/index.js");
class DAO extends index_js_1.ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            index_js_6.Assert.check(data[key] !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new index_js_1.Operation(this.networkID, new create_dao_js_1.CreateDAOFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new index_js_3.Amount(currency, data.fee), new whitelist_js_1.Whitelist(true, data.proposers.map(a => index_js_2.Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    updateService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            index_js_6.Assert.check(data[key] !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new index_js_1.Operation(this.networkID, new update_policy_js_1.UpdatePolicyFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new index_js_3.Amount(currency, data.fee), new whitelist_js_1.Whitelist(true, data.proposers.map(a => index_js_2.Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    formTransferCalldata(sender, receiver, currency, amount) {
        return new proposal_js_2.TransferCalldata(sender, receiver, new index_js_3.Amount(currency, amount));
    }
    formSetPolicyCalldata(data, currency) {
        const keysToCheck = ['token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            index_js_6.Assert.check(data[key] !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the policyData structure`));
        });
        return new proposal_js_2.GovernanceCalldata(new policy_js_1.DAOPolicy(data.token, data.threshold, new index_js_3.Amount(currency, data.fee), new whitelist_js_1.Whitelist(true, data.proposers.map(a => index_js_2.Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum));
    }
    writeCryptoProposal(proposer, startTime, calldata) {
        return new proposal_js_1.CryptoProposal(proposer, startTime, calldata);
    }
    writeBizProposal(proposer, startTime, url, hash, options) {
        return new proposal_js_1.BizProposal(proposer, startTime, url, hash, options);
    }
    propose(contractAddr, sender, proposalID, proposal, currency) {
        new index_js_5.URIString(proposalID, 'proposalID');
        return new index_js_1.Operation(this.networkID, new propose_js_1.ProposeFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, proposal, currency));
    }
    register(contractAddr, sender, proposalID, currency, delegator) {
        return new index_js_1.Operation(this.networkID, new register_js_1.RegisterFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, delegator ? delegator : sender, currency));
    }
    cancel(contractAddr, sender, proposalID, currency) {
        return new index_js_1.Operation(this.networkID, new cancel_proposal_js_1.CancelProposalFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    snapBeforeVoting(contractAddr, sender, proposalID, currency) {
        return new index_js_1.Operation(this.networkID, new pre_snap_js_1.PreSnapFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    castVote(contractAddr, sender, proposalID, voteOption, currency) {
        return new index_js_1.Operation(this.networkID, new vote_js_1.VoteFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, voteOption, currency));
    }
    snapAfterVoting(contractAddr, sender, proposalID, currency) {
        return new index_js_1.Operation(this.networkID, new post_snap_js_1.PostSnapFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    execute(contractAddr, sender, proposalID, currency) {
        return new index_js_1.Operation(this.networkID, new execute_js_1.ExecuteFact(index_js_5.TimeStamp.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_4.getAPIData)(() => index_js_4.contract.dao.getService(this.api, contractAddr, this.delegateIP));
        });
    }
    getProposalInfo(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_4.getAPIData)(() => index_js_4.contract.dao.getProposal(this.api, contractAddr, proposalID, this.delegateIP));
        });
    }
    getDelegatorInfo(contractAddr, proposalID, delegator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_4.getAPIData)(() => index_js_4.contract.dao.getDelegator(this.api, contractAddr, proposalID, delegator, this.delegateIP));
        });
    }
    getVoterInfo(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_4.getAPIData)(() => index_js_4.contract.dao.getVoter(this.api, contractAddr, proposalID, this.delegateIP));
        });
    }
    getVotingResult(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_4.getAPIData)(() => index_js_4.contract.dao.getVotingResult(this.api, contractAddr, proposalID, this.delegateIP));
        });
    }
}
exports.DAO = DAO;
//# sourceMappingURL=index.js.map