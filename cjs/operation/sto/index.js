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
exports.STO = void 0;
const create_security_token_js_1 = require("./create-security-token.js");
const issue_sercurity_token_js_1 = require("./issue-sercurity-token.js");
const authorize_operator_js_1 = require("./authorize-operator.js");
const revoke_operator_js_1 = require("./revoke-operator.js");
const redeem_token_js_1 = require("./redeem-token.js");
const set_document_js_1 = require("./set-document.js");
const transfer_security_token_partition_js_1 = require("./transfer-security-token-partition.js");
const index_js_1 = require("../../api/index.js");
const index_js_2 = require("../base/index.js");
const index_js_3 = require("../../types/index.js");
const index_js_4 = require("../../error/index.js");
class STO extends index_js_2.ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    authorizeOperator(contractAddr, sender, operator, partition, currency) {
        return new index_js_2.Operation(this.networkID, new authorize_operator_js_1.AuthorizeOperatorFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new authorize_operator_js_1.AuthorizeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['granularity', 'defaultPartition'];
        keysToCheck.forEach((key) => {
            index_js_4.Assert.check(data[key] !== undefined, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createServiceData structure`));
        });
        return new index_js_2.Operation(this.networkID, new create_security_token_js_1.CreateSecurityTokenFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new create_security_token_js_1.CreateSecurityTokenItem(contractAddr, data.granularity, data.defaultPartition, currency)
        ]));
    }
    issue(contractAddr, sender, receiver, partition, amount, currency) {
        return new index_js_2.Operation(this.networkID, new issue_sercurity_token_js_1.IssueSecurityTokenFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new issue_sercurity_token_js_1.IssueSecurityTokenItem(contractAddr, receiver, amount, partition, currency)
        ]));
    }
    redeem(contractAddr, sender, tokenHolder, partition, amount, currency) {
        return new index_js_2.Operation(this.networkID, new redeem_token_js_1.RedeemTokenFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new redeem_token_js_1.RedeemTokenItem(contractAddr, tokenHolder, amount, partition, currency)
        ]));
    }
    revokeOperator(contractAddr, sender, operator, partition, currency) {
        return new index_js_2.Operation(this.networkID, new revoke_operator_js_1.RevokeOperatorFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new revoke_operator_js_1.RevokeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    setDocument(contractAddr, sender, title, uri, documentHash, currency) {
        return new index_js_2.Operation(this.networkID, new set_document_js_1.SetDocumentFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, title, uri, documentHash, currency));
    }
    transferByPartition(contractAddr, sender, holder, receiver, partition, amount, currency) {
        return new index_js_2.Operation(this.networkID, new transfer_security_token_partition_js_1.TransferSecurityTokenPartitionFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new transfer_security_token_partition_js_1.TransferSecurityTokenPartitionItem(contractAddr, holder, receiver, partition, amount, currency)
        ]));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_1.getAPIData)(() => index_js_1.contract.sto.getService(this.api, contractAddr, this.delegateIP));
        });
    }
    getPartitionsInfo(contractAddr, holder) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_1.getAPIData)(() => index_js_1.contract.sto.getPartitions(this.api, contractAddr, holder, this.delegateIP));
        });
    }
    getBalanceByHolder(contractAddr, holder, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_1.getAPIData)(() => index_js_1.contract.sto.getBalanceByHolder(this.api, contractAddr, holder, partition, this.delegateIP));
        });
    }
    getOperatorsByHolder(contractAddr, holder, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_1.getAPIData)(() => index_js_1.contract.sto.getOperatorsByHolder(this.api, contractAddr, holder, partition, this.delegateIP));
        });
    }
    getPartitionBalanceInfo(contractAddr, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_1.getAPIData)(() => index_js_1.contract.sto.getPartitionBalance(this.api, contractAddr, partition, this.delegateIP));
        });
    }
    getAuthorizedInfo(contractAddr, operator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_1.getAPIData)(() => index_js_1.contract.sto.getAuthorized(this.api, contractAddr, operator, this.delegateIP));
        });
    }
}
exports.STO = STO;
//# sourceMappingURL=index.js.map