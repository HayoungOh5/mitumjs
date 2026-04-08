import type { Operation, Fact, OperationJson, SignOption } from "./base";
import { Key } from "../key/pub";
import { Generator, HintedObject, IP } from "../types";
export declare class Signer extends Generator {
    constructor(networkID: string, api?: string | IP);
    /**
     * Signs the given operation using the provided private key.
     *
     * This method supports both raw Operation instances and JSON representations.
     * Internally, all inputs are normalized into OperationJson format before signing.
     *
     * @param {string | Key} privatekey - The private key used for signing.
     * @param {Operation<Fact> | OperationJson | string} operation - The operation to sign.
     *        Accepts:
     *          - Operation instance
     *          - OperationJson object
     *          - JSON string (parsable to OperationJson)
     * @param {SignOption} [option] - Optional signing options (e.g. node address for NodeFactSign).
     *
     * @returns {Promise<OperationJson>} The signed operation in OperationJson format.
     *
     * @throws {MitumError} If the operation format is invalid or signing fails.
     */
    sign(privatekey: string | Key, operation: Operation<Fact> | HintedObject | string, option?: SignOption): Promise<OperationJson>;
    private accSign;
    private nodeSign;
    private FillUserOpHash;
    private validateUserOpFields;
    /**
     * Signs a personal message using the provided private key.
     *
     * @param {string | Key} privatekey - The private key used for signing.
     * @param {string} message - The message to sign.
     * @returns {Promise<string>} Base58-encoded signature.
     */
    signMessage(privatekey: string | Key, message: string): Promise<string>;
    /**
     * Verifies a personal message signature using the provided public key.
     *
     * @param {string | Key} publickey - The public key of the signer.
     * @param {string} message - The original message.
     * @param {string} signature - The base58-encoded signature.
     * @returns {Promise<boolean>} True if valid, otherwise false.
     */
    verifyMessage(publickey: string | Key, message: string, signature: string): Promise<boolean>;
}
