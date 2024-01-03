/// <reference types="node" />
import { CurrencyID } from "./id.js";
import { Big, HintedObject, IBuffer, IHintedObject } from "../types/index.js";
export declare class Amount implements IBuffer, IHintedObject {
    private hint;
    readonly currency: CurrencyID;
    readonly big: Big;
    constructor(currency: string | CurrencyID, big: string | number | Big);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
