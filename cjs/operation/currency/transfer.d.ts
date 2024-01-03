/// <reference types="node" />
import { CurrencyItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Amount } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
import { Address, ZeroAddress } from "../../key/index.js";
export declare class TransferItem extends CurrencyItem {
    readonly receiver: Address | ZeroAddress;
    constructor(receiver: string | Address | ZeroAddress, amounts: Amount[]);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFact extends OperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[]);
    get operationHint(): string;
}
