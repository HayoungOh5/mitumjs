/// <reference types="node" />
import { Item } from "./item.js";
import { FactJson } from "./types.js";
import { Address } from "../../key/index.js";
import { IBuffer, IHintedObject } from "../../types/index.js";
import { CurrencyID, Token } from "../../common/index.js";
export declare abstract class Fact implements IBuffer, IHintedObject {
    private hint;
    readonly token: Token;
    protected _hash: Buffer;
    readonly items?: Item[];
    protected constructor(hint: string, token: string);
    get hash(): Buffer;
    hashing(): Buffer;
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    abstract get operationHint(): string;
}
export declare abstract class OperationFact<T extends Item> extends Fact {
    readonly sender: Address;
    readonly items: T[];
    protected constructor(hint: string, token: string, sender: string | Address, items: T[]);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
}
export declare abstract class ContractFact extends Fact {
    readonly sender: Address;
    readonly contract: Address;
    readonly currency: CurrencyID;
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
}
export declare abstract class NodeFact extends Fact {
    protected constructor(hint: string, token: string);
}
