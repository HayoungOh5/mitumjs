import { Fact } from "./fact";
import { BaseOperation } from "./operation";
import { GeneralFactSign, NodeFactSign } from "./factsign";
import { HintedFactObject, OperationJson } from "./types";
import { Hint } from "../../common";
import { Address, Key } from "../../key";
import { HintedObject, IHintedObject } from "../../types";
type FactSign = GeneralFactSign | NodeFactSign;
export declare class Authentication implements IHintedObject {
    readonly contract: Address;
    readonly authenticationId: string;
    readonly proofData: string;
    private hint;
    constructor(contract: string | Address, authenticationId: string, proofData: string | undefined);
    toHintedObject(): HintedObject;
}
export declare class ProxyPayer implements IHintedObject {
    readonly proxyPayer: Address;
    private hint;
    constructor(proxyPayer: string | Address);
    toHintedObject(): HintedObject;
}
export declare class Settlement implements IHintedObject {
    readonly opSender: Address | "";
    private hint;
    constructor(opSender: string | Address | undefined);
    toHintedObject(): HintedObject;
}
export declare class UserOperation<T extends Fact> extends BaseOperation<T> {
    readonly id: string;
    readonly hint: Hint;
    readonly fact: T;
    protected auth: Authentication;
    protected proxyPayer: null | ProxyPayer;
    protected settlement: Settlement;
    protected _factSigns: FactSign[];
    protected _hash: Uint8Array;
    constructor(networkID: string, fact: T | HintedFactObject, auth: Authentication, proxyPayer: null | ProxyPayer, settlement: Settlement);
    static restoreFactFromJson<T extends Fact>(factJson: HintedFactObject): T;
    get hash(): Uint8Array;
    toBytes(): Uint8Array;
    toHintedObject(): OperationJson;
    private toHintedExtension;
    private isSenderDidOwner;
    /**
     * Adds an alternative signature to the user operation.
     * This fills the `proof_data` field of the `authentication` object using the provided private key.
     *
     * @param {string | Key} privateKey - The private key used to generate the alternative signature.
     * @returns {Promise<void>} Resolves when the alternative signature has been generated and applied.
     */
    addAlterSign(privateKey: string | Key): Promise<void>;
    /**
     * Sets settlement information for the userOperation.
     * `op_sender` is the account address that will **sign this UserOperation**.
     * When signatures are added later, the operation **must be signed using the private key of `op_sender`**.
     * If no `proxyPayer` is specified, `op_sender` will also act as the **fee payer** for this UserOperation.
     * @param {string | Address} opSender - The account address that acts as the signer .
     * @returns void.
     **/
    setSettlement(opSender: string | Address): void;
    /**
     * Sets a proxy payer for the UserOperation.
     *
     * `proxyPayer` is an address of a **CA (Contract Account)** that pays the transaction fee
     * from its own balance when this userOperation is executed.
     * The proxy payer **must be preconfigured** to allow this operation:
     * the `sender` of the UserOperation's Fact must be registered as a
     * permitted recipient in the proxy payer contract.
     *
     * This setting is optional. If not set, the fee will be paid by `settlement.op_sender`.
     * @param {string | Address} proxyPayer - The CA address that will pay the transaction fee.
     * @returns void.
     **/
    setProxyPayer(proxyPayer: string | Address): void;
    /**
     * Signs the user operation using the provided private key.
     *
     * This method validates required fields, generates a signature, and updates the internal
     * factSigns and operation hash. The signing process is asynchronous and must be awaited.
     *
     * @param {string | Key} privatekey - The private key used for signing the operation.
     * @returns {Promise<void>} Resolves when the operation has been successfully signed.
     */
    sign(privatekey: string | Key): Promise<void>;
}
export {};
