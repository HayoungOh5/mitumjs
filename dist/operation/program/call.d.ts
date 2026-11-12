import { ContractFact, HintedFactObject, Item } from "../base";
import type { Address } from "../../key/address";
import type { CurrencyID } from "../../common";
import { HintedObject, LongString } from "../../types";
import { Data } from "./register";
export declare class CallItem extends Item {
    readonly func: LongString;
    readonly callData: Data;
    constructor(func: string | LongString, callData?: Record<string, string | LongString> | undefined);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
    /**
     * Rebuild the legacy single-item callData representation,
     * i.e. the function selector merged back into the callData map
     * under the reserved `function` key. Used for the single-item
     * fact hash path to stay compatible with the node.
     */
    rebuildLegacyCallData(): Data;
    toString(): string;
}
export declare class CallFact extends ContractFact {
    readonly items: CallItem[];
    constructor(token: string, sender: string | Address, contract: string | Address, items: CallItem[], currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
