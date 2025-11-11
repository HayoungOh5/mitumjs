/// <reference types="node" />
import { Buffer } from "buffer";
import { ContractFact, FactJson } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare abstract class TimeStampFact extends ContractFact {
    protected constructor(hint: string, token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
}
