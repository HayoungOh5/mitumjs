/// <reference types="node" />
import { ContractFact, FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, LongString } from "../../types/index.js";
export declare class UpdateCollectionPolicyFact extends ContractFact {
    readonly name: LongString;
    readonly royalty: Big;
    readonly uri: LongString;
    readonly whitelist: Address[];
    constructor(token: string, sender: string | Address, contract: string | Address, name: string | LongString, royalty: string | number | Big, uri: string | LongString, whitelist: (string | Address)[] | null, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
