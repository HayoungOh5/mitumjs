/// <reference types="node" />
import { FactJson } from "../base/index.js";
import { TimeStampFact } from "./fact.js";
import { Big } from "../../types/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class AppendFact extends TimeStampFact {
    readonly projectID: string;
    readonly requestTimeStamp: Big;
    readonly data: string;
    constructor(token: string, sender: string | Address, target: string | Address, projectID: string, requestTimeStamp: string | number | Big, data: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
