/// <reference types="node" />
import { Fact } from "./fact";
import { GeneralFactSign, NodeFactSign } from "./factsign";
import { Operation } from "./operation";
import { Hint } from "../../common";
import { Address, Key } from "../../key";
import { HintedObject, IHintedObject } from "../../types";
import { FactJson } from "./types";
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
export declare class UserOperation<T extends Fact> extends Operation<T> {
    readonly id: string;
    readonly hint: Hint;
    readonly fact: T;
    protected auth: Authentication;
    protected proxyPayer: null | ProxyPayer;
    protected settlement: Settlement;
    protected _factSigns: FactSign[];
    protected _hash: Buffer;
    constructor(networkID: string, fact: T | FactJson, auth: Authentication, proxyPayer: null | ProxyPayer, settlement: Settlement);
    static restoreFactFromJson<T extends Fact>(factJson: FactJson): T;
    get hash(): Buffer;
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    private toHintedExtension;
    private isSenderDidOwner;
    /**
     * Add alternative signature for userOperation, fill `proof_data` item of `authentication` object.
     * @param {string | Key | KeyPair} [privateKey] - The private key or key pair for signing.
     * @returns void
     */
    addAlterSign(privateKey: string | Key): void;
    /**
     * Updates the settlement details of a userOperation.
     * @param {string | Address} opSender - The opseration sender's address (Bundler's address).
     * @returns void.
     **/
    setSettlement(opSender: string | Address): void;
    /**
     * Updates the proxy payer details of a userOperation.
     * @param {string | Address} proxyPayer - The proxy payer's address. (address of CA)
     * @returns void.
     **/
    setProxyPayer(proxyPayer: string | Address): void;
    /**
     * Sign the given userOperation in JSON format using given private key.
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @returns void.
     */
    sign(privatekey: string | Key): void;
}
export {};
