/// <reference types="node" />
import { ContractFact, FactJson } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { LongString } from "../../types";
export declare abstract class DidFact extends ContractFact {
    readonly did: LongString;
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, did: string | LongString, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
}
