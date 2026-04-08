import { DAOPolicy } from "./policy";
import { Address } from "../../key/address";
import { Amount } from "../../common";
import { Big, HintedObject, IBytes, IHintedObject, LongString } from "../../types";
declare abstract class Calldata implements IBytes, IHintedObject {
    private hint;
    constructor(hint: string);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class TransferCalldata extends Calldata {
    readonly sender: Address;
    readonly receiver: Address;
    readonly amount: Amount;
    constructor(sender: string | Address, receiver: string | Address, amount: Amount);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class GovernanceCalldata extends Calldata {
    readonly policy: DAOPolicy;
    constructor(policy: DAOPolicy);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
declare abstract class Proposal implements IBytes, IHintedObject {
    private hint;
    readonly proposer: Address;
    readonly startTime: Big;
    constructor(hint: string, proposer: string | Address, startTime: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class CryptoProposal extends Proposal {
    readonly calldata: TransferCalldata | GovernanceCalldata;
    constructor(proposer: string | Address, startTime: string | number | Big, calldata: TransferCalldata | GovernanceCalldata);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class BizProposal extends Proposal {
    readonly url: LongString;
    readonly hash: LongString;
    readonly options: Big;
    constructor(proposer: string | Address, startTime: string | number | Big, url: string | LongString, hash: string | LongString, options: string | number | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export {};
