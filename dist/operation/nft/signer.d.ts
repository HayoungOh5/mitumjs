import { Hint } from "../../common";
import { Address } from "../../key/address";
import { Big, Bool } from "../../types";
import type { HintedObject, IBytes, IHintedObject } from "../../types";
export declare class Signer implements IBytes, IHintedObject {
    readonly hint: Hint;
    readonly account: Address;
    readonly share: Big;
    readonly signed: Bool;
    constructor(account: string | Address, share: string | number | Big, signed: boolean | Bool);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class Signers implements IBytes, IHintedObject {
    readonly hint: Hint;
    readonly signers: Signer[];
    constructor(signers: Signer[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
