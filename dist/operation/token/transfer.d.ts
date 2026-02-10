/// <reference types="node" />
import { Buffer } from "buffer";
import { TokenItem } from "./item";
import { OperationFact } from "../base";
import { Big, HintedObject } from "../../types";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class TransferItem extends TokenItem {
    readonly receiver: Address;
    constructor(contract: string | Address, receiver: string | Address, amount: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFact extends OperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[]);
    get operationHint(): string;
}
