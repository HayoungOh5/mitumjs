import { NFTItem } from "./item";
import { ItemOperationFact } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { HintedObject } from "../../types";
export declare class ApproveAllItem extends NFTItem {
    readonly approved: Address;
    readonly mode: "allow" | "cancel";
    constructor(contract: string | Address, approved: string | Address, mode: "allow" | "cancel");
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class ApproveAllFact extends ItemOperationFact<ApproveAllItem> {
    constructor(token: string, sender: string | Address, items: ApproveAllItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
