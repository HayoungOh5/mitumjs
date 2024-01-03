/// <reference types="node" />
import { STOItem } from "./item.js";
import { Partition } from "./partition.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, HintedObject } from "../../types/index.js";
export declare class CreateSecurityTokenItem extends STOItem {
    readonly granularity: Big;
    readonly defaultPartition: Partition;
    constructor(contract: string | Address, granularity: string | number | Big, defaultPartition: string | Partition, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class CreateSecurityTokenFact extends OperationFact<CreateSecurityTokenItem> {
    constructor(token: string, sender: string | Address, items: CreateSecurityTokenItem[]);
    get operationHint(): string;
}
