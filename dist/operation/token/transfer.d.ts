import { TokenItem } from "./item";
import { ItemOperationFact } from "../base";
import { Big, HintedObject } from "../../types";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class TransferItem extends TokenItem {
    readonly receiver: Address;
    constructor(contract: string | Address, receiver: string | Address, amount: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFact extends ItemOperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
