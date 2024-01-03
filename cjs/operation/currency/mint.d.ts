/// <reference types="node" />
import { Item, NodeFact, FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { Amount } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare class MintItem extends Item {
    readonly amount: Amount;
    readonly receiver: Address;
    constructor(receiver: string | Address, amount: Amount);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class MintFact extends NodeFact {
    readonly items: MintItem[];
    constructor(token: string, items: MintItem[]);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
