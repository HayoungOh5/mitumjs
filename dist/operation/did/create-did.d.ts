/// <reference types="node" />
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { ContractFact, FactJson } from "../base";
import { LongString } from "../../types";
export declare class CreateFact extends ContractFact {
    readonly authType: LongString;
    readonly publicKey: LongString;
    readonly serviceType: LongString;
    readonly serviceEndpoints: LongString;
    constructor(token: string, sender: string | Address, contract: string | Address, authType: "EcdsaSecp256k1VerificationKey2019" | "Ed25519VerificationKey2018", publicKey: string, serviceType: string, serviceEndpoints: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
