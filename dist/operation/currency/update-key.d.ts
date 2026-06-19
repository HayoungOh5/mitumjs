import { Fact, HintedFactObject } from "../base";
import { CurrencyID } from "../../common";
import { Address } from "../../key/address";
import { Keys } from "../../key/pub";
export declare class UpdateKeyFact extends Fact {
    readonly sender: Address;
    readonly keys: Keys;
    readonly currency: CurrencyID;
    constructor(token: string, sender: string | Address, keys: Keys, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
