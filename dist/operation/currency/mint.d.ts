/// <reference types="node" />
import { Buffer } from "buffer";
import { NodeFact, FactJson } from "../base";
import { Address } from "../../key/address";
import type { Amount } from "../../common";
export declare class MintFact extends NodeFact {
    readonly amount: Amount;
    readonly receiver: Address;
    constructor(token: string, receiver: string | Address, amount: Amount);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    toString(): string;
    get operationHint(): string;
}
