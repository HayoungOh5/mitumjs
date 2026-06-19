import { ContractFact } from "../base";
import type { HintedFactObject } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare abstract class TokenFact extends ContractFact {
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
}
