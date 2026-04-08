import { Fact, UserOperation, OperationJson } from "../base";
import { Generator, HintedObject, IP } from "../../types";
import { Key, Address } from "../../key";
import { FactJson } from "../base";
export declare class AccountAbstraction extends Generator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    /**
     * Creates a `UserOperation` for account abstraction.
     * @param {Fact | FactJson} fact - The operation fact or fact property (json) of HintedObject of operation.
     * @param {string | Address} contract - The did contract address.
     * @param {string} authentication_id - The authentication ID for the did contract.
     * @returns {UserOperation<Fact>} The created `UserOperation` instance.
     */
    createUserOperation(fact: Fact | FactJson, contract: string | Address, authentication_id: string): UserOperation<Fact>;
    /**
     * Adds an alternative signature to a user operation by filling the `proof_data`
     * field of the `authentication` object.
     *
     * This method accepts either a `UserOperation` instance or a JSON-formatted
     * hinted object. The operation is normalized internally and returned in
     * hinted-object (JSON) format after the signature is applied.
     *
     * @param {string | Key} privateKey - The private key used to generate the signature.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update.
     * @returns {Promise<HintedObject | OperationJson>} A hinted-object representation of the user operation
     * with the `authentication.proof_data` field populated.
     */
    addAlterSign(privateKey: string | Key, userOperation: UserOperation<Fact> | HintedObject): Promise<HintedObject | OperationJson>;
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
