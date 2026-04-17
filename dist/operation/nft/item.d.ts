import { Item } from "../base";
import { Address } from "../../key/address";
import { HintedObject } from "../../types";
export declare abstract class NFTItem extends Item {
    readonly contract: Address;
    protected constructor(hint: string, contract: string | Address);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
