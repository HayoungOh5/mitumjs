/// <reference types="node" />
import { ContractFact, FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare abstract class DAOFact extends ContractFact {
    readonly proposalID: string;
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, proposalID: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
}
