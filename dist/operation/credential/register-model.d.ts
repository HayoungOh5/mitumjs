import { Address } from "../../key/address";
import { ContractFact } from "../base";
import { CurrencyID } from "../../common";
export declare class RegisterModelFact extends ContractFact {
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    get operationHint(): string;
}
