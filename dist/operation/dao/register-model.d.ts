/// <reference types="node" />
import { Buffer } from "buffer";
import { ContractFact, FactJson } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { DAOPolicy } from "./policy";
export declare class RegisterModelFact extends ContractFact {
    readonly option: "crypto" | "biz";
    readonly policy: DAOPolicy;
    constructor(votingPowerToken: string, sender: string | Address, contract: string | Address, option: "crypto" | "biz", policy: DAOPolicy, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
