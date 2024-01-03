/// <reference types="node" />
import { CurrencyItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Amount } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
import { Keys, AddressType, Address, EtherKeys } from "../../key/index.js";
export declare class CreateContractAccountItem extends CurrencyItem {
    readonly keys: Keys | EtherKeys;
    private addressSuffix;
    constructor(keys: Keys | EtherKeys, amounts: Amount[], addressType: AddressType);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class CreateContractAccountFact extends OperationFact<CreateContractAccountItem> {
    constructor(token: string, sender: string | Address, items: CreateContractAccountItem[]);
    get operationHint(): string;
}
