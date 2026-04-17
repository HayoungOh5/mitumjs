import { NFTItem } from "./item";
import { ItemOperationFact } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { Big, HintedObject } from "../../types";
export declare class AddSignatureItem extends NFTItem {
    readonly nftIdx: Big;
    constructor(contract: string | Address, nftIdx: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class AddSignatureFact extends ItemOperationFact<AddSignatureItem> {
    constructor(token: string, sender: string | Address, items: AddSignatureItem[], currency: string | CurrencyID);
    get operationHint(): string;
}
