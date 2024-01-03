/// <reference types="node" />
import { STOItem } from "./item.js";
import { Partition } from "./partition.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, HintedObject } from "../../types/index.js";
export declare class TransferSecurityTokenPartitionItem extends STOItem {
    readonly tokenHolder: Address;
    readonly receiver: Address;
    readonly partition: Partition;
    readonly amount: Big;
    constructor(contract: string | Address, tokenHolder: string | Address, receiver: string | Address, partition: string | Partition, amount: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferSecurityTokenPartitionFact extends OperationFact<TransferSecurityTokenPartitionItem> {
    constructor(token: string, sender: string | Address, items: TransferSecurityTokenPartitionItem[]);
    get operationHint(): string;
}
