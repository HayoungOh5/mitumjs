/// <reference types="node" />
import { Fact, FactJson } from "../base/index.js";
import { CurrencyID } from "../../common/index.js";
import { Address, EtherKeys, Keys } from "../../key/index.js";
export declare class UpdateKeyFact extends Fact {
    readonly target: Address;
    readonly keys: Keys | EtherKeys;
    readonly currency: CurrencyID;
    constructor(token: string, target: string | Address, keys: Keys | EtherKeys, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
