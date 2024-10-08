/// <reference types="node" />
import { ContractFact, FactJson } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { LongString } from "../../types";
export declare class CreateDidFact extends ContractFact {
    readonly publicKey: LongString;
    constructor(token: string, sender: string | Address, contract: string | Address, publicKey: string | LongString, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
