import { ContractFact, FactJson } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
export declare abstract class TimeStampFact extends ContractFact {
    protected constructor(hint: string, token: string, sender: string | Address, target: string | Address, currency: string | CurrencyID);
    toHintedObject(): FactJson;
}
