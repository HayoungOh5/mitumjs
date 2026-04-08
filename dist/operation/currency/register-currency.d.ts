import { CurrencyDesign } from "./currency-design";
import { NodeFact, FactJson } from "../base";
export declare class RegisterCurrencyFact extends NodeFact {
    readonly design: CurrencyDesign;
    constructor(token: string, design: CurrencyDesign);
    toBytes(): Uint8Array;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
