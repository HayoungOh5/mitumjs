import { CurrencyItem } from "./item";
import { ItemOperationFact } from "../base";
import { Amount, CurrencyID } from "../../common";
import { HintedObject } from "../../types";
import { Keys, Address } from "../../key";
export declare class CreateContractAccountItem extends CurrencyItem {
    readonly keys: Keys;
    constructor(keys: Keys, amounts: Amount[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class CreateContractAccountFact extends ItemOperationFact<CreateContractAccountItem> {
    constructor(token: string, sender: string | Address, items: CreateContractAccountItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
