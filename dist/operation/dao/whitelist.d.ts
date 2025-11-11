/// <reference types="node" />
import { Buffer } from "buffer";
import { Address } from "../../key/address";
import { Bool } from "../../types";
import type { HintedObject, IBuffer, IHintedObject } from "../../types";
export declare class Whitelist implements IBuffer, IHintedObject {
    private hint;
    readonly active: Bool;
    readonly accounts: Address[];
    constructor(active: boolean | Bool, accounts: (string | Address)[]);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
