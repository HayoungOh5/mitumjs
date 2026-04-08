import { Address } from "../../key/address";
import { Bool } from "../../types";
import type { HintedObject, IBytes, IHintedObject } from "../../types";
export declare class Whitelist implements IBytes, IHintedObject {
    private hint;
    readonly active: Bool;
    readonly accounts: Address[];
    constructor(active: boolean | Bool, accounts: (string | Address)[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
