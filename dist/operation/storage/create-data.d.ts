/// <reference types="node" />
import { FactJson } from "../base";
import { StorageFact } from "./fact";
import { LongString } from "../../types";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare class CreateDataFact extends StorageFact {
    readonly dataValue: LongString;
    constructor(token: string, sender: string | Address, contract: string | Address, dataKey: string | LongString, dataValue: string | LongString, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
