/// <reference types="node" />
import { Item } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare abstract class STOItem extends Item {
    readonly contract: Address;
    readonly currency: CurrencyID;
    protected constructor(hint: string, contract: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
