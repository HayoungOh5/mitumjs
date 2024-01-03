/// <reference types="node" />
import { PointFact } from "./fact.js";
import { FactJson } from "../base/index.js";
import { Big } from "../../types/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class BurnFact extends PointFact {
    readonly target: Address;
    readonly amount: Big;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, target: string | Address, amount: string | number | Big);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
