/// <reference types="node" />
import { CurrencyPolicy } from "./currency-design.js";
import { FactJson, NodeFact } from "../base/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class UpdateCurrencyFact extends NodeFact {
    readonly currency: CurrencyID;
    readonly policy: CurrencyPolicy;
    constructor(token: string, currency: string | CurrencyID, policy: CurrencyPolicy);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
