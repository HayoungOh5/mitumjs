import { Item } from "./item";
import { HintedFactObject } from "./types";
import { Address } from "../../key/address";
import { IBytes, IHintedObject } from "../../types";
import { CurrencyID, Token } from "../../common";
export declare abstract class Fact implements IBytes, IHintedObject {
    private hint;
    readonly token: Token;
    protected _hash: Uint8Array;
    readonly items?: Item[];
    protected constructor(hint: string, token: string);
    get hash(): Uint8Array;
    hashing(): Uint8Array;
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    abstract get operationHint(): string;
}
export declare abstract class OperationFact<T extends Item> extends Fact {
    readonly sender: Address;
    readonly items: T[];
    protected constructor(hint: string, token: string, sender: string | Address, items: T[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
}
export declare abstract class ItemOperationFact<T extends Item> extends Fact {
    readonly sender: Address;
    readonly items: T[];
    readonly currency: CurrencyID;
    protected constructor(hint: string, token: string, sender: string | Address, items: T[], currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
}
export declare abstract class ContractFact extends Fact {
    readonly sender: Address;
    readonly contract: Address;
    readonly currency: CurrencyID;
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
}
export declare abstract class NodeFact extends Fact {
    protected constructor(hint: string, token: string);
}
