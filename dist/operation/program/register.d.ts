import { ContractFact, HintedFactObject } from "../base";
import type { Address } from "../../key/address";
import type { CurrencyID } from "../../common";
import { LongString } from "../../types";
export type Data = Record<string, string>;
export declare function dataToHash(data: Data): Uint8Array;
export declare class RegisterFact extends ContractFact {
    readonly code: LongString;
    readonly initData: Data;
    constructor(token: string, sender: string | Address, contract: string | Address, code: string | LongString, initData: Record<string, string | LongString> | undefined, currency: string | CurrencyID);
    toBytes(): Uint8Array;
    toHintedObject(): HintedFactObject;
    get operationHint(): string;
}
