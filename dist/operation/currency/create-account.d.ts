import { CurrencyItem } from "./item";
import { ItemOperationFact } from "../base";
import { Amount, CurrencyID } from "../../common";
import { HintedObject } from "../../types";
import { Keys } from "../../key/pub";
import { Address } from "../../key/address";
export declare class CreateAccountItem extends CurrencyItem {
    readonly keys: Keys;
    constructor(keys: Keys, amounts: Amount[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class CreateAccountFact extends ItemOperationFact<CreateAccountItem> {
    constructor(token: string, sender: string | Address, items: CreateAccountItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
