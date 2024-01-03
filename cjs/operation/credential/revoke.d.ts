/// <reference types="node" />
import { OperationFact } from "../base/index.js";
import { CredentialItem } from "./item.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class RevokeItem extends CredentialItem {
    constructor(contract: string | Address, holder: string | Address, templateID: string, id: string, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toString(): string;
}
export declare class RevokeFact extends OperationFact<RevokeItem> {
    constructor(token: string, sender: string | Address, items: RevokeItem[]);
    get operationHint(): string;
}
