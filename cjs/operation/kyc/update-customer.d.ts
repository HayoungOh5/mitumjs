/// <reference types="node" />
import { KYCItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Bool, HintedObject } from "../../types/index.js";
export declare class UpdateCustomerItem extends KYCItem {
    readonly customer: Address;
    readonly status: Bool;
    constructor(contract: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class UpdateCustomerFact extends OperationFact<UpdateCustomerItem> {
    constructor(token: string, sender: string | Address, items: UpdateCustomerItem[]);
    get operationHint(): string;
}
