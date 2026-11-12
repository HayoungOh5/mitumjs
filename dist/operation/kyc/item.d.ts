import { Item } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { HintedObject } from "../../types";
export declare abstract class KYCItem extends Item {
    readonly contract: Address;
    readonly currency: CurrencyID;
    protected constructor(hint: string, contract: string | Address, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
