"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BizProposal = exports.CryptoProposal = exports.GovernanceCalldata = exports.TransferCalldata = void 0;
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../common/index.js");
const index_js_4 = require("../../types/index.js");
class Calldata {
    constructor(hint) {
        this.hint = new index_js_3.Hint(hint);
    }
    toBuffer() {
        return Buffer.from([]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
        };
    }
}
class TransferCalldata extends Calldata {
    constructor(sender, receiver, amount) {
        super(index_js_1.HINT.DAO.CALLDATA.TRANSFER);
        this.sender = index_js_2.Address.from(sender);
        this.receiver = index_js_2.Address.from(receiver);
        this.amount = amount;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), receiver: this.receiver.toString(), amount: this.amount.toHintedObject() });
    }
}
exports.TransferCalldata = TransferCalldata;
class GovernanceCalldata extends Calldata {
    constructor(policy) {
        super(index_js_1.HINT.DAO.CALLDATA.GOVERNANCE);
        this.policy = policy;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { policy: this.policy.toHintedObject() });
    }
}
exports.GovernanceCalldata = GovernanceCalldata;
class Proposal {
    constructor(hint, proposer, startTime) {
        this.hint = new index_js_3.Hint(hint);
        this.proposer = index_js_2.Address.from(proposer);
        this.startTime = index_js_4.Big.from(startTime);
    }
    toBuffer() {
        return Buffer.concat([
            this.proposer.toBuffer(),
            this.startTime.toBuffer("fill"),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            proposer: this.proposer.toString(),
            start_time: this.startTime.v,
        };
    }
}
class CryptoProposal extends Proposal {
    constructor(proposer, startTime, calldata) {
        super(index_js_1.HINT.DAO.PROPOSAL.CRYPTO, proposer, startTime);
        this.calldata = calldata;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.calldata.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { call_data: this.calldata.toHintedObject() });
    }
}
exports.CryptoProposal = CryptoProposal;
class BizProposal extends Proposal {
    constructor(proposer, startTime, url, hash, options) {
        super(index_js_1.HINT.DAO.PROPOSAL.BIZ, proposer, startTime);
        this.url = index_js_4.LongString.from(url);
        this.hash = index_js_4.LongString.from(hash);
        this.options = index_js_4.Big.from(options);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.url.toBuffer(),
            this.hash.toBuffer(),
            this.options.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { url: this.url.toString(), hash: this.hash.toString(), options: this.options.v });
    }
}
exports.BizProposal = BizProposal;
//# sourceMappingURL=proposal.js.map