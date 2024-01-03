/// <reference types="node" />
import { CurrencyItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Amount } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
import { Keys, EtherKeys, Address, AddressType } from "../../key/index.js";
export declare class CreateAccountItem extends CurrencyItem {
    readonly keys: Keys | EtherKeys;
    private addressSuffix;
    constructor(keys: Keys | EtherKeys, amounts: Amount[], addressType: AddressType);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class CreateAccountFact extends OperationFact<CreateAccountItem> {
    constructor(token: string, sender: string | Address, items: CreateAccountItem[]);
    get operationHint(): string;
}
