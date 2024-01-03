/// <reference types="node" />
import { Address } from "../../key/index.js";
import { ContractFact } from "../base/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class CreateServiceFact extends ContractFact {
    constructor(token: string, sender: string | Address, contract: string | Address, currency: string | CurrencyID);
    toBuffer(): Buffer;
    get operationHint(): string;
}
