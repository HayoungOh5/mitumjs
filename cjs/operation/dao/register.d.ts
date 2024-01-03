/// <reference types="node" />
import { DAOFact } from "./fact.js";
import { FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class RegisterFact extends DAOFact {
    readonly delegated: Address;
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, delegated: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
