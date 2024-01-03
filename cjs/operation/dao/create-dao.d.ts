/// <reference types="node" />
import { Whitelist } from "./whitelist.js";
import { ContractFact, FactJson } from "../base/index.js";
import { Big } from "../../types/index.js";
import { Address } from "../../key/index.js";
import { Amount } from "../../common/index.js";
import { CurrencyID } from "../../common/index.js";
export declare class CreateDAOFact extends ContractFact {
    readonly option: "crypto" | "biz";
    readonly votingPowerToken: CurrencyID;
    readonly threshold: Big;
    readonly fee: Amount;
    readonly whitelist: Whitelist;
    readonly proposalReviewPeriod: Big;
    readonly registrationPeriod: Big;
    readonly preSnapshotPeriod: Big;
    readonly votingPeriod: Big;
    readonly postSnapshotPeriod: Big;
    readonly executionDelayPeriod: Big;
    readonly turnout: Big;
    readonly quorum: Big;
    constructor(token: string, sender: string | Address, contract: string | Address, option: "crypto" | "biz", votingPowerToken: string | CurrencyID, threshold: string | number | Big, fee: Amount, whitelist: Whitelist, proposalReviewPeriod: string | number | Big, registrationPeriod: string | number | Big, preSnapshotPeriod: string | number | Big, votingPeriod: string | number | Big, postSnapshotPeriod: string | number | Big, executionDelayPeriod: string | number | Big, turnout: string | number | Big, quorum: string | number | Big, currency: string | CurrencyID);
    toBuffer(): Buffer;
    toHintedObject(): FactJson;
    get operationHint(): string;
}
