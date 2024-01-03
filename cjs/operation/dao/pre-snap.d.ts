/// <reference types="node" />
import { DAOFact } from "./fact.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class PreSnapFact extends DAOFact {
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    get operationHint(): string;
}
