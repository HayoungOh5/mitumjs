import { NodeFact, HintedFactObject } from "../base";
import { Address } from "../../key/address";
import type { Amount } from "../../common";
export declare class MintFact extends NodeFact {
    readonly amount: Amount;
    readonly receiver: Address;
    constructor(token: string, receiver: string | Address, amount: Amount);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    toString(): string;
    get operationHint(): string;
}
