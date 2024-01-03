/// <reference types="node" />
import { NFTItem } from "./item.js";
import { Signers } from "./signer.js";
import { OperationFact } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { HintedObject, LongString } from "../../types/index.js";
export declare class MintItem extends NFTItem {
    readonly receiver: Address;
    readonly hash: LongString;
    readonly uri: LongString;
    readonly creators: Signers;
    constructor(contract: string | Address, receiver: string | Address, hash: string | LongString, uri: string | LongString, creators: Signers, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class MintFact extends OperationFact<MintItem> {
    constructor(token: string, sender: string | Address, items: MintItem[]);
    get operationHint(): string;
}
