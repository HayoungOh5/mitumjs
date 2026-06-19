import { CurrencyDesign } from "./currency-design";
import { NodeFact, HintedFactObject } from "../base";
export declare class RegisterCurrencyFact extends NodeFact {
    readonly design: CurrencyDesign;
    constructor(token: string, design: CurrencyDesign);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
