/// <reference types="node" />
import { DAOFact } from "./fact.js";
import { FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { BizProposal, CryptoProposal } from "./proposal.js";
export declare class ProposeFact extends DAOFact {
    readonly proposal: CryptoProposal | BizProposal;
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, proposal: CryptoProposal | BizProposal, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
