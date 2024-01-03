/// <reference types="node" />
import { STOItem } from "./item.js";
import { Partition } from "./partition.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, HintedObject } from "../../types/index.js";
export declare class RedeemTokenItem extends STOItem {
    readonly tokenHolder: Address;
    readonly amount: Big;
    readonly partition: Partition;
    constructor(contract: string | Address, tokenHolder: string | Address, amount: string | number | Big, partition: string | Partition, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class RedeemTokenFact extends OperationFact<RedeemTokenItem> {
    constructor(token: string, sender: string | Address, items: RedeemTokenItem[]);
    get operationHint(): string;
}
