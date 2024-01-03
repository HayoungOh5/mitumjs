/// <reference types="node" />
import { STOItem } from "./item.js";
import { Partition } from "./partition.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare class RevokeOperatorItem extends STOItem {
    readonly operator: Address;
    readonly partition: Partition;
    constructor(contract: string | Address, operator: string | Address, partition: string | Partition, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class RevokeOperatorFact extends OperationFact<RevokeOperatorItem> {
    constructor(token: string, sender: string | Address, items: RevokeOperatorItem[]);
    get operationHint(): string;
}
