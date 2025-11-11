/// <reference types="node" />
import { Buffer } from "buffer";
import type { FactJson } from "../base";
import { StorageFact } from "./fact";
import type { LongString } from "../../types";
import type { Address } from "../../key/address";
import type { CurrencyID } from "../../common";
export declare class DeleteDataFact extends StorageFact {
    constructor(token: string, sender: string | Address, contract: string | Address, dataKey: string | LongString, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
