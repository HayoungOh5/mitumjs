/// <reference types="node" />
import { Buffer } from "buffer";
import { Address } from "../../key/address";
import type { HintedObject } from "../../types";
import { LongString, URIString } from "../../types";
import { CurrencyID } from "../../common";
import { Item, OperationFact } from "../base";
export declare class CreateDataItem extends Item {
    readonly contract: Address;
    readonly currency: CurrencyID;
    readonly dataKey: URIString;
    readonly dataValue: LongString;
    constructor(contract: string | Address, currency: string | CurrencyID, dataKey: string, dataValue: string | LongString);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class CreateDataFact extends OperationFact<CreateDataItem> {
    constructor(token: string, sender: string | Address, items: CreateDataItem[]);
    get operationHint(): string;
}
