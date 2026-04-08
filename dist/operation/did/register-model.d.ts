import { Address } from "../../key";
import { LongString } from "../../types";
import { CurrencyID } from "../../common";
import { ContractFact, FactJson } from "../base";
export declare class RegisterModelFact extends ContractFact {
    readonly didMethod: LongString;
    constructor(token: string, sender: string | Address, contract: string | Address, didMethod: string, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
