import { DAOFact } from "./fact";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class PostSnapFact extends DAOFact {
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    get operationHint(): string;
}
