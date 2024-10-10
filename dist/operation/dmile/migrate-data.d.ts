/// <reference types="node" />
import { Item } from "../base";
import { LongString } from "../../types";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { OperationFact } from "../base";
import { HintedObject } from "../../types";
export declare class MigrateDataItem extends Item {
    readonly contract: Address;
    readonly currency: CurrencyID;
    readonly merkleRoot: LongString;
    readonly txId: LongString;
    constructor(contract: Address | string, currency: CurrencyID | string, merkleRoot: string, txId: string);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class MigrateDataFact extends OperationFact<MigrateDataItem> {
    constructor(token: string, sender: string | Address, items: MigrateDataItem[]);
    get operationHint(): string;
}
