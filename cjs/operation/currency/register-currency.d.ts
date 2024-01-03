/// <reference types="node" />
import { CurrencyDesign } from "./currency-design.js";
import { NodeFact, FactJson } from "../base/index.js";
export declare class RegisterCurrencyFact extends NodeFact {
    readonly design: CurrencyDesign;
    constructor(token: string, design: CurrencyDesign);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
