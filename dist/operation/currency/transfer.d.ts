import { CurrencyItem } from "./item";
import { ItemOperationFact } from "../base";
import { Amount, CurrencyID } from "../../common";
import { HintedObject } from "../../types";
import { Address, ZeroAddress } from "../../key/address";
export declare class TransferItem extends CurrencyItem {
    readonly receiver: Address | ZeroAddress;
    constructor(receiver: string | Address | ZeroAddress, amounts: Amount[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFact extends ItemOperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
