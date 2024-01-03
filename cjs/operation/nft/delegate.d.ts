/// <reference types="node" />
import { NFTItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare class DelegateItem extends NFTItem {
    readonly operator: Address;
    readonly mode: "allow" | "cancel";
    constructor(contract: string | Address, operator: string | Address, mode: "allow" | "cancel", currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class DelegateFact extends OperationFact<DelegateItem> {
    constructor(token: string, sender: string | Address, items: DelegateItem[]);
    get operationHint(): string;
}
