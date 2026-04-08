import { CurrencyID } from "./id";
import { Big, HintedObject, IBytes, IHintedObject } from "../types";
export declare class Amount implements IBytes, IHintedObject {
    private hint;
    readonly currency: CurrencyID;
    readonly big: Big;
    constructor(currency: string | CurrencyID, big: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class Fee implements IBytes, IHintedObject {
    private hint;
    readonly currency: CurrencyID;
    readonly big: Big;
    constructor(currency: string | CurrencyID, big: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
