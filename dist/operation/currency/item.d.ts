import { Item } from "../base";
import type { Amount } from "../../common";
import type { HintedObject } from "../../types";
export declare abstract class CurrencyItem extends Item {
    readonly amounts: Amount[];
    protected constructor(hint: string, amounts: Amount[]);
    toHintedObject(): HintedObject;
}
