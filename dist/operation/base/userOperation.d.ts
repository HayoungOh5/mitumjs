/// <reference types="node" />
import { Fact } from "./fact";
import { GeneralFactSign, NodeFactSign } from "./factsign";
import { Operation } from "./operation";
import { Hint } from "../../common";
import { Address, Key } from "../../key";
import { HintedObject, IBuffer, IHintedObject } from "../../types";
import { FactJson } from "./types";
type FactSign = GeneralFactSign | NodeFactSign;
export declare class Authentication implements IBuffer, IHintedObject {
    readonly contract: Address;
    readonly authenticationId: string;
    readonly proofData: string;
    constructor(contract: string | Address, authenticationId: string, proofData: string | undefined);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class Settlement implements IBuffer, IHintedObject {
    readonly opSender: Address | "";
    readonly proxyPayer: Address | "";
    constructor(opSender: string | Address | undefined, proxyPayer: string | Address | undefined);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class UserOperation<T extends Fact> extends Operation<T> {
    readonly id: string;
    readonly hint: Hint;
    readonly fact: T;
    protected auth: Authentication;
    protected settlement: Settlement;
    protected _factSigns: FactSign[];
    protected _hash: Buffer;
    constructor(networkID: string, fact: T, auth: Authentication, settlement: Settlement);
    get hash(): Buffer;
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toHintedObjectWithOutFact(_hint: string | undefined, fact: FactJson): HintedObject;
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
     * @param {string | Address} proxyPayer - The proxy payer's address. (address of CA)
     * @returns void.
     **/
    setSettlement(opSender: string | Address, proxyPayer: string | Address | undefined): void;
    /**
     * Sign the given userOperation in JSON format using given private key.
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @returns void.
     */
    sign(privatekey: string | Key): void;
}
export {};
