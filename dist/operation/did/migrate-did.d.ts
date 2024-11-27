/// <reference types="node" />
import { Item } from "../base";
import { LongString } from "../../types";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { OperationFact } from "../base";
import { HintedObject } from "../../types";
export declare class MigrateDidItem extends Item {
    readonly contract: Address;
    readonly currency: CurrencyID;
    readonly publicKey: LongString;
    readonly txId: LongString;
    constructor(contract: Address | string, currency: CurrencyID | string, publicKey: string, txId: string);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class MigrateDidFact extends OperationFact<MigrateDidItem> {
    constructor(token: string, sender: string | Address, items: MigrateDidItem[]);
    get operationHint(): string;
}
