import { KYCItem } from "./item";
import { OperationFact } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { Bool, HintedObject } from "../../types";
export declare class UpdateCustomerItem extends KYCItem {
    readonly customer: Address;
    readonly status: Bool;
    constructor(contract: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class UpdateCustomerFact extends OperationFact<UpdateCustomerItem> {
    constructor(token: string, sender: string | Address, items: UpdateCustomerItem[]);
    get operationHint(): string;
}
