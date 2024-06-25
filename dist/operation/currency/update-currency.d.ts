/// <reference types="node" />
import { CurrencyPolicy } from "./currency-design";
import { FactJson, NodeFact } from "../base";
import { CurrencyID } from "../../common";
import { Big } from "../../types";
export declare class UpdateCurrencyFact extends NodeFact {
    readonly currency: CurrencyID;
    readonly policy: CurrencyPolicy;
    readonly decimal: Big;
    constructor(token: string, currency: string | CurrencyID, decimal: string | number | Big, policy: CurrencyPolicy);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
