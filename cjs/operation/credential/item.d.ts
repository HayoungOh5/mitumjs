/// <reference types="node" />
import { Item } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { HintedObject } from "../../types/index.js";
export declare abstract class CredentialItem extends Item {
    readonly contract: Address;
    readonly holder: Address;
    readonly templateID: string;
    readonly id: string;
    readonly currency: CurrencyID;
    protected constructor(hint: string, contract: string | Address, holder: string | Address, templateID: string, id: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
