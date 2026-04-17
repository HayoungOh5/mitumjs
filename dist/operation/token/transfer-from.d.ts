import { TokenItem } from "./item";
import { ItemOperationFact } from "../base";
import { Big, HintedObject } from "../../types";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class TransferFromItem extends TokenItem {
    readonly receiver: Address;
    readonly target: Address;
    constructor(contract: string | Address, receiver: string | Address, target: string | Address, amount: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class TransferFromFact extends ItemOperationFact<TransferFromItem> {
    constructor(token: string, sender: string | Address, items: TransferFromItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
