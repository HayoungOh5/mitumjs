/// <reference types="node" />
import { Whitelist } from "./whitelist";
import { CurrencyID, Fee } from "../../common";
import { Big, HintedObject, IBuffer, IHintedObject } from "../../types";
export declare class DAOPolicy implements IBuffer, IHintedObject {
    private hint;
    readonly votingPowerToken: CurrencyID;
    readonly threshold: Big;
    readonly fee: Fee;
    readonly whitelist: Whitelist;
    readonly proposalReviewPeriod: Big;
    readonly registrationPeriod: Big;
    readonly preSnapshotPeriod: Big;
    readonly votingPeriod: Big;
    readonly postSnapshotPeriod: Big;
    readonly executionDelayPeriod: Big;
    readonly turnout: Big;
    readonly quorum: Big;
    constructor(votingPowerToken: string | CurrencyID, threshold: string | number | Big, fee: Fee, whitelist: Whitelist, proposalReviewPeriod: string | number | Big, registrationPeriod: string | number | Big, preSnapshotPeriod: string | number | Big, votingPeriod: string | number | Big, postSnapshotPeriod: string | number | Big, executionDelayPeriod: string | number | Big, turnout: string | number | Big, quorum: string | number | Big);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
