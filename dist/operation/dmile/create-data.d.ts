/// <reference types="node" />
import { ContractFact, FactJson } from "../base";
import { LongString } from "../../types";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare class CreateDataFact extends ContractFact {
    readonly merkleRoot: LongString;
    constructor(token: string, sender: string | Address, contract: string | Address, merkleRoot: string | LongString, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
