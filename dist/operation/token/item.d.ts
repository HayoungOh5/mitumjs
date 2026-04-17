import { Item } from "../base";
import { Big } from "../../types";
import { Address } from "../../key/address";
import { HintedObject } from "../../types";
export declare abstract class TokenItem extends Item {
    readonly contract: Address;
    readonly amount: Big;
    protected constructor(hint: string, contract: string | Address, amount: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
