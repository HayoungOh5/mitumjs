/// <reference types="node" />
import { Address } from "../../key";
import { LongString } from "../../types";
import { CurrencyID } from "../../common";
import { ContractFact, FactJson } from "../base";
import { Document } from "./document";
export declare class UpdateDocumentFact extends ContractFact {
    readonly did: LongString;
    readonly document: Document;
    constructor(token: string, sender: string | Address, contract: string | Address, did: string, document: Document, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
