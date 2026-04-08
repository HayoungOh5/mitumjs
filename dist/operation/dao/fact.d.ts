import { ContractFact, FactJson } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { URIString } from "../../types";
export declare abstract class DAOFact extends ContractFact {
    readonly proposalID: URIString;
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, proposalID: string, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): FactJson;
}
