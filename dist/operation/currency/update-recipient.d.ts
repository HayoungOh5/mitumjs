/// <reference types="node" />
import { Fact, FactJson } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
export declare class UpdateRecipientFact extends Fact {
    readonly sender: Address;
    readonly contract: Address;
    readonly recipients: Address[];
    readonly currency: CurrencyID;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, recipients: (string | Address)[]);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
