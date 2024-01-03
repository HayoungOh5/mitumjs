/// <reference types="node" />
import { Address } from "../../key/index.js";
import { Bool, HintedObject, IBuffer, IHintedObject } from "../../types/index.js";
export declare class Whitelist implements IBuffer, IHintedObject {
    private hint;
    readonly active: Bool;
    readonly accounts: Address[];
    constructor(active: boolean | Bool, accounts: (string | Address)[]);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
