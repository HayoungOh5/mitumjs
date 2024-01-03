/// <reference types="node" />
import { PointFact } from "./fact.js";
import { Big } from "../../types/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { FactJson } from "../base/index.js";
export declare class ApproveFact extends PointFact {
    readonly approved: Address;
    readonly amount: Big;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, approved: string | Address, amount: string | number | Big);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
