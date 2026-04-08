import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { Big, HintedObject, IBytes, IHintedObject } from "../../types";
export declare class CurrencyDesign implements IBytes, IHintedObject {
    private static hint;
    readonly initialSupply: Big;
    readonly currencyID: CurrencyID;
    readonly policy: CurrencyPolicy;
    readonly genesisAccount: Address;
    readonly totalSupply: Big;
    readonly decimal: Big;
    constructor(initialSupply: string | number | Big, currencyID: string | CurrencyID, genesisAccount: string | Address, decimal: string | number | Big, policy: CurrencyPolicy);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class CurrencyPolicy implements IBytes, IHintedObject {
    private static hint;
    readonly newAccountMinBalance: Big;
    readonly feeer: Feeer;
    constructor(newAccountMinBalance: string | number | Big, feeer: Feeer);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
declare abstract class Feeer implements IBytes, IHintedObject {
    private hint;
    constructor(hint: string);
    abstract toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class NilFeeer extends Feeer {
    constructor();
    toBytes(): Uint8Array;
}
export declare class FixedFeeer extends Feeer {
    readonly receiver: Address;
    readonly amount: Big;
    constructor(receiver: string | Address, amount: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class FixedItemFeeer extends Feeer {
    readonly receiver: Address;
    readonly amount: Big;
    readonly item_fee_amount: Big;
    constructor(receiver: string | Address, amount: string | number | Big, item_fee_amount: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export {};
