/// <reference types="node" />
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { ContractFact, FactJson } from "../base";
import { LongString } from "../../types";
import { Key } from "../../key";
export declare class CreateFact extends ContractFact {
    readonly authType: LongString;
    readonly publicKey: Key;
    readonly serviceType: LongString;
    readonly serviceEndpoints: LongString;
    constructor(token: string, sender: string | Address, contract: string | Address, authType: "ECDSA" | "EdDSA", publicKey: string, serviceType: string, serviceEndpoints: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
