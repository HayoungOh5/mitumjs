/// <reference types="node" />
import { NFTItem } from "./item.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, HintedObject } from "../../types/index.js";
export declare class SignItem extends NFTItem {
    readonly nft: Big;
    constructor(contract: string | Address, nft: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class SignFact extends OperationFact<SignItem> {
    constructor(token: string, sender: string | Address, items: SignItem[]);
    get operationHint(): string;
}
