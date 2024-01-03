import { Item } from "../base/index.js";
import { Amount } from "../../common/index.js";
import { AddressType } from "../../key/index.js";
import { HintedObject } from "../../types/index.js";
export declare abstract class CurrencyItem extends Item {
    readonly amounts: Amount[];
    readonly addressType: AddressType | "";
    protected constructor(hint: string, amounts: Amount[], addressType?: AddressType);
    toHintedObject(): HintedObject;
}
