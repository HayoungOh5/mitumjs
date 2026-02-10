/// <reference types="node" />
import { Buffer } from "buffer";
import { PointItem } from "./item";
import { OperationFact } from "../base";
import { Big, HintedObject } from "../../types";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class ApproveItem extends PointItem {
    readonly approved: Address;
    constructor(contract: string | Address, approved: string | Address, amount: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class ApproveFact extends OperationFact<ApproveItem> {
    constructor(token: string, sender: string | Address, items: ApproveItem[]);
    get operationHint(): string;
}
