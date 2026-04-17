import { Address } from "../../key/address";
import type { HintedObject } from "../../types";
import { LongString, URIString } from "../../types";
import { CurrencyID } from "../../common";
import { Item, ItemOperationFact } from "../base";
export declare class UpdateDataItem extends Item {
    readonly contract: Address;
    readonly dataKey: URIString;
    readonly dataValue: LongString;
    constructor(contract: string | Address, dataKey: string, dataValue: string | LongString);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class UpdateDataFact extends ItemOperationFact<UpdateDataItem> {
    constructor(token: string, sender: string | Address, items: UpdateDataItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
