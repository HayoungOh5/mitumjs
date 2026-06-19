import { Fact, HintedFactObject } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
export declare class UpdateHandlerFact extends Fact {
    readonly sender: Address;
    readonly contract: Address;
    readonly handlers: Address[];
    readonly currency: CurrencyID;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, handlers: (string | Address)[]);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
