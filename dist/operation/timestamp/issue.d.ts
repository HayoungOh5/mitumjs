/// <reference types="node" />
import type { FactJson } from "../base";
import { ContractFact } from "../base";
import { Big } from "../../types";
import type { Address } from "../../key/address";
import type { CurrencyID } from "../../common";
export declare class IssueFact extends ContractFact {
    readonly projectID: string;
    readonly requestTimeStamp: Big;
    readonly data: string;
    constructor(token: string, sender: string | Address, contract: string | Address, projectID: string, requestTimeStamp: string | number | Big, data: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
