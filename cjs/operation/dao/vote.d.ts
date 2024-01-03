/// <reference types="node" />
import { DAOFact } from "./fact.js";
import { FactJson } from "../base/index.js";
import { Big } from "../../types/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class VoteFact extends DAOFact {
    readonly vote: Big;
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, vote: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
