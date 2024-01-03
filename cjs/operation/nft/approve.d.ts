/// <reference types="node" />
import { NFTItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, HintedObject } from "../../types/index.js";
export declare class ApproveItem extends NFTItem {
    readonly approved: Address;
    readonly nftIDX: Big;
    constructor(contract: string | Address, approved: string | Address, nftIDX: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class ApproveFact extends OperationFact<ApproveItem> {
    constructor(token: string, sender: string | Address, items: ApproveItem[]);
    get operationHint(): string;
}
