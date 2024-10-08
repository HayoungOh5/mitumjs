/// <reference types="node" />
import { FactJson } from "../base";
import { DidFact } from "./fact";
import { LongString } from "../../types";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare class ReactivateDidFact extends DidFact {
    constructor(token: string, sender: string | Address, contract: string | Address, did: string | LongString, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
