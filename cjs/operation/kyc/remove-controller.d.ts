/// <reference types="node" />
import { KYCItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare class RemoveControllerItem extends KYCItem {
    readonly controller: Address;
    constructor(contract: string | Address, controller: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class RemoveControllerFact extends OperationFact<RemoveControllerItem> {
    constructor(token: string, sender: string | Address, items: RemoveControllerItem[]);
    get operationHint(): string;
}
