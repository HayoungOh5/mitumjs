/// <reference types="node" />
import { STOItem } from "./item.js";
import { Partition } from "./partition.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, HintedObject } from "../../types/index.js";
export declare class IssueSecurityTokenItem extends STOItem {
    readonly receiver: Address;
    readonly amount: Big;
    readonly partition: Partition;
    constructor(contract: string | Address, receiver: string | Address, amount: string | number | Big, partition: string | Partition, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class IssueSecurityTokenFact extends OperationFact<IssueSecurityTokenItem> {
    constructor(token: string, sender: string | Address, items: IssueSecurityTokenItem[]);
    get operationHint(): string;
}
