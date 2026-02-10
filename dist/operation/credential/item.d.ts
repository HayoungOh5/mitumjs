/// <reference types="node" />
import { Item } from "../base";
import { Buffer } from "buffer";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { HintedObject, URIString } from "../../types";
export declare abstract class CredentialItem extends Item {
    readonly contract: Address;
    readonly holder: Address;
    readonly templateID: URIString;
    readonly credentialID: URIString;
    readonly currency: CurrencyID;
    protected constructor(hint: string, contract: string | Address, holder: string | Address, templateID: string, credentialID: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
