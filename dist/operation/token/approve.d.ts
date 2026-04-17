import { TokenItem } from "./item";
import { ItemOperationFact } from "../base";
import { Big, HintedObject } from "../../types";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class ApproveItem extends TokenItem {
    readonly approved: Address;
    constructor(contract: string | Address, approved: string | Address, amount: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class ApproveFact extends ItemOperationFact<ApproveItem> {
    constructor(token: string, sender: string | Address, items: ApproveItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
