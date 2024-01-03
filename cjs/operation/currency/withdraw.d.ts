/// <reference types="node" />
import { CurrencyItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { Amount } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare class WithdrawItem extends CurrencyItem {
    readonly target: Address;
    constructor(target: string | Address, amounts: Amount[]);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class WithdrawFact extends OperationFact<WithdrawItem> {
    constructor(token: string, sender: string | Address, items: WithdrawItem[]);
    get operationHint(): string;
}
