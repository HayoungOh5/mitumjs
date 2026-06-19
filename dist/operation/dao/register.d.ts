import { DAOFact } from "./fact";
import { HintedFactObject } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class RegisterFact extends DAOFact {
    readonly approved: Address;
    constructor(token: string, sender: string | Address, contract: string | Address, proposalID: string, approved: string | Address, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
