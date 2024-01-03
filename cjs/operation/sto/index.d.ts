import { CreateSecurityTokenFact } from "./create-security-token.js";
import { IssueSecurityTokenFact } from "./issue-sercurity-token.js";
import { AuthorizeOperatorFact } from "./authorize-operator.js";
import { RevokeOperatorFact } from "./revoke-operator.js";
import { RedeemTokenFact } from "./redeem-token.js";
import { SetDocumentFact } from "./set-document.js";
import { TransferSecurityTokenPartitionFact } from "./transfer-security-token-partition.js";
import { Partition } from "./partition.js";
import { ContractGenerator, Operation } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, IP } from "../../types/index.js";
type createServiceData = {
    granularity: string | number | Big;
    defaultPartition: string | Partition;
};
export declare class STO extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    authorizeOperator(contractAddr: string | Address, sender: string | Address, operator: string | Address, partition: string | Partition, currency: string | CurrencyID): Operation<AuthorizeOperatorFact>;
    createService(contractAddr: string | Address, sender: string | Address, data: createServiceData, currency: string | CurrencyID): Operation<CreateSecurityTokenFact>;
    issue(contractAddr: string | Address, sender: string | Address, receiver: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID): Operation<IssueSecurityTokenFact>;
    redeem(contractAddr: string | Address, sender: string | Address, tokenHolder: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID): Operation<RedeemTokenFact>;
    revokeOperator(contractAddr: string | Address, sender: string | Address, operator: string | Address, partition: string | Partition, currency: string | CurrencyID): Operation<RevokeOperatorFact>;
    setDocument(contractAddr: string | Address, sender: string | Address, title: string, uri: string, documentHash: string, currency: string | CurrencyID): Operation<SetDocumentFact>;
    transferByPartition(contractAddr: string | Address, sender: string | Address, holder: string | Address, receiver: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID): Operation<TransferSecurityTokenPartitionFact>;
    getServiceInfo(contractAddr: string | Address): Promise<any>;
    getPartitionsInfo(contractAddr: string | Address, holder: string | Address): Promise<any>;
    getBalanceByHolder(contractAddr: string | Address, holder: string | Address, partition: string): Promise<any>;
    getOperatorsByHolder(contractAddr: string | Address, holder: string | Address, partition: string): Promise<any>;
    getPartitionBalanceInfo(contractAddr: string | Address, partition: string): Promise<any>;
    getAuthorizedInfo(contractAddr: string | Address, operator: string | Address): Promise<any>;
}
export {};
