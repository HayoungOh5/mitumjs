/// <reference types="node" />
import { Fact, FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class UpdateOperatorFact extends Fact {
    readonly sender: Address;
    readonly contract: Address;
    readonly operators: Address[];
    readonly currency: CurrencyID;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, operators: (string | Address)[]);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
