/// <reference types="node" />
import { Buffer } from "buffer";
import { ContractFact, FactJson } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare abstract class DAOFact extends ContractFact {
    readonly proposalID: string;
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, proposalID: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
}
