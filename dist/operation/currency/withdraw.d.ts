import { CurrencyItem } from "./item";
import { ItemOperationFact } from "../base";
import { Address } from "../../key/address";
import { Amount, CurrencyID } from "../../common";
import { HintedObject } from "../../types";
export declare class WithdrawItem extends CurrencyItem {
    readonly target: Address;
    constructor(target: string | Address, amounts: Amount[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class WithdrawFact extends ItemOperationFact<WithdrawItem> {
    constructor(token: string, sender: string | Address, items: WithdrawItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
