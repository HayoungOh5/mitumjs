/// <reference types="node" />
import { Buffer } from "buffer";
import { PointItem } from "./item";
import { OperationFact } from "../base";
import { Big, HintedObject } from "../../types";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class TransferFromItem extends PointItem {
    readonly receiver: Address;
    readonly target: Address;
    constructor(contract: string | Address, receiver: string | Address, target: string | Address, amount: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFromFact extends OperationFact<TransferFromItem> {
    constructor(token: string, sender: string | Address, items: TransferFromItem[]);
    get operationHint(): string;
}
