import { Fact, UserOperation } from "../base";
import { Generator, HintedObject, IP } from "../../types";
import { Key, Address } from "../../key";
export declare class AccountAbstraction extends Generator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    /**
     * Creates a `UserOperation` for account abstraction.
     * @param {Fact} fact - The operation fact.
     * @param {string | Address} contract - The did contract address.
     * @param {string} authentication_id - The authentication ID for the did contract.
     * @returns {UserOperation<Fact>} - The created `UserOperation` instance.
     */
    createUserOperation(fact: Fact, contract: string | Address, authentication_id: string): UserOperation<Fact>;
    /**
     * Add alternative signature for userOperation, fill `proof_data` item of `authentication` object.
     * @param {string | Key | KeyPair} [privateKey] - The private key or key pair for signing.
     * @param {UserOperation<Fact> | HintedObject} [userOperation] - The operation to be signed.
     * @returns The user operation fill with authentication.
     */
    addAlterSign(privateKey: string | Key, userOperation: UserOperation<Fact> | HintedObject): HintedObject;
    /**
     * Updates the settlement details of a userOperation and returns a new hinted object of user operation.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update settlement.
     * @param {string | Address} opSender - The operation sender's address (Bundler's address).
     * @returns {HintedObject} A new hinted object representing the updated user operation.
     **/
    setSettlement(userOperation: UserOperation<Fact> | HintedObject, opSender: string | Address): HintedObject;
    /**
     * Updates the proxy payer details of a userOperation and returns a new hinted object of user operation.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update proxy payer.
     * @param {string | Address} proxyPayer - The proxy payer's address. (address of CA)
     * @returns {HintedObject} A new hinted object representing the updated user operation.
     **/
    setProxyPayer(userOperation: UserOperation<Fact> | HintedObject, proxyPayer: string | Address): HintedObject;
    /** Private method to validate and convert userOperation to HintedObject */
    private getHintedUserOperation;
    /** Private method to create an Authentication object */
    private createAuthentication;
    /** Private method to build a HintedObject with the updated extension */
    private buildHintedObject;
}
