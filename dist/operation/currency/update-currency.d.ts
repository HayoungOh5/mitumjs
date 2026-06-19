import { CurrencyPolicy } from "./currency-design";
import { HintedFactObject, NodeFact } from "../base";
import { CurrencyID } from "../../common";
export declare class UpdateCurrencyFact extends NodeFact {
    readonly currency: CurrencyID;
    readonly policy: CurrencyPolicy;
    constructor(token: string, currency: string | CurrencyID, policy: CurrencyPolicy);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
