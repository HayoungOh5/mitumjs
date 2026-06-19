import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { ContractFact, HintedFactObject } from "../base";
export declare class CreateFact extends ContractFact {
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
