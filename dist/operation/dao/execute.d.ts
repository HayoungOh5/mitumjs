/// <reference types="node" />
import { Buffer } from "buffer";
import { DAOFact } from "./fact";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class ExecuteFact extends DAOFact {
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    get operationHint(): string;
}
