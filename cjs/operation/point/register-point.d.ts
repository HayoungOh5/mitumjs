/// <reference types="node" />
import { PointFact } from "./fact.js";
import { FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, LongString } from "../../types/index.js";
export declare class RegisterPointFact extends PointFact {
    readonly symbol: CurrencyID;
    readonly name: LongString;
    readonly initialSupply: Big;
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID, symbol: string | CurrencyID, name: string | LongString, initialSupply: string | number | Big);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
