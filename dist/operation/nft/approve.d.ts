import { NFTItem } from "./item";
import { ItemOperationFact } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { Big, HintedObject } from "../../types";
export declare class ApproveItem extends NFTItem {
    readonly approved: Address;
    readonly nftIdx: Big;
    constructor(contract: string | Address, approved: string | Address, nftIdx: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class ApproveFact extends ItemOperationFact<ApproveItem> {
    constructor(token: string, sender: string | Address, items: ApproveItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
