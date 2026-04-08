import { PaymentFact } from "./fact";
import { FactJson } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { Big } from "../../types";
export declare class TransferFact extends PaymentFact {
    readonly amount: Big;
    readonly receiver: Address;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, receiver: string | Address, amount: string | number);
    toBytes(): Uint8Array;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
