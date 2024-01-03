/// <reference types="node" />
import { TimeStampFact } from "./fact.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class CreateServiceFact extends TimeStampFact {
    constructor(token: string, sender: string | Address, target: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    get operationHint(): string;
}
