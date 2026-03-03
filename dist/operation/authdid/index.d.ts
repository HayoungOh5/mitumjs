import { RegisterModelFact } from "./register-model";
import { CreateFact } from "./create-did";
import { UpdateDocumentFact } from "./update-did-document";
import { AsymKeyAuth, LinkedAuth, Document } from "./document";
import { ContractGenerator, Operation, AllowedOperation } from "../base";
import { Address, Key } from "../../key";
import { CurrencyID } from "../../common";
import { IP, LongString } from "../../types";
type verificationKeyType = "Ed25519VerificationKey2020" | "EcdsaSecp256k1VerificationKey2019" | "EcdsaSecp256k1VerificationKeyImFact2025";
type asymKeyAuthOpt = "SECP256K1_2019" | "SECP256K1_IMFACT_2025";
type asymkeyAuth = {
    _hint: string;
    id: string | LongString;
    type: verificationKeyType;
    controller: string | LongString;
    publicKeyImFact: string | Key;
};
type linkedAuth = {
    _hint: string;
    id: string | LongString;
    type: "LinkedVerificationMethod";
    controller: string | LongString;
    targetId: string | LongString;
    allowed: AllowedOperation[];
};
type document = {
    _hint: string;
    "@context": string[] | LongString[];
    id: string | LongString;
    authentication: (asymkeyAuth | linkedAuth)[];
    verificationMethod: [];
    service?: {
        id: string | LongString;
        type: string | LongString;
        service_end_point: string | LongString;
    }[];
};
export declare class AuthDID extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    private normalizeDocument;
    private validateDocument;
    private isSenderDidOwner;
    private mapAuth;
    private mapAuthToClass;
    /**
     * Creates an AsymKeyAuth object with the provided authentication details.
     * @param {string} id - The unique identifier for the authentication. <did>#<key-id> format.
     * @param {"SECP256K1_2019" | "SECP256K1_IMFACT_2025"} option - Short identifier for verification key type.
     *  - SECP256K1_2019 → EcdsaSecp256k1VerificationKey2019
     *  - SECP256K1_IMFACT_2025 → EcdsaSecp256k1VerificationKeyImFact2025
     * @param {string} controller - The controller responsible for the authentication.
     * @param {string} publicKeyImFact - The public key associated with the authentication.
     * @returns {AsymKeyAuth} An AsymKeyAuth Instance.
     */
    writeAsymkeyAuth(id: string, option: asymKeyAuthOpt, controller: string, publicKeyImFact: string): AsymKeyAuth;
    /**
     * Creates a LinkedAuth object that allows another authentication method
     * (e.g. OAuth provider, biometric service, custody service)
     * to act on behalf of the DID subject with restricted operation capabilities.
     * @param {string} id - The unique identifier of this linked authentication method. <did>#<key-id> format.
     * @param {string} controller - The DID controller that authorizes this linked authentication.
     * @param {string} targetId - The identifier of the authentication method that performs verification on behalf of the DID subject.
     * @param {AllowedOperation[]} allowedOperations - A list of operation capabilities that this linked authentication is permitted to execute on behalf of the DID subject.
     *   Each allowedOperation must be created using {@link Mitum.allowedOperation}, which provides a safe, typed registry of core-supported operations.
     *   Example:
     *   ```ts
     *   const allowed = [
     *     Mitum.allowedOperation.currency.transfer(),
     *     Mitum.allowedOperation.authdid.create(contract),
     *   ];
     *   ```
     * @returns {LinkedAuth} LinkedAuth instance.
     */
    writeLinkedAuth(id: string, controller: string, targetId: string, allowedOperations: AllowedOperation[]): LinkedAuth;
    /**
     * The returned Document can be passed directly to `updateDocument()`.
     * @param {Array<string | LongString>} didContext - DID document contexts (e.g. DID Core context, service-specific context).
     * @param {string} didID - DID identifier.
     * @param {Array<AsymKeyAuth | LinkedAuth>} authentications - Authentication methods for the DID.
     * @param {Array<AsymKeyAuth | LinkedAuth>} [verificationMethods] - Verification methods for the DID.
     * @param {Array<Object>} [services] - Optional service definitions.
     * @param {string} services[].id - Service identifier. <did>#<key-id> format.
     * @param {string} services[].type - Service type.
     * @param {string} services[].service_end_point - Service endpoint URL.
     * @returns {Document} DID Document instance.
     */
    writeDocument(didContext: string[], didID: string, authentications: (AsymKeyAuth | LinkedAuth)[], verificationMethods?: (AsymKeyAuth | LinkedAuth)[], service?: {
        id: string;
        type: string;
        service_end_point: string;
    }[]): Document;
    /**
     * Generate a `register-model` operation to register new did registry model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [didMethod] - The did method
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract: string | Address, sender: string | Address, didMethod: string, currency: string | CurrencyID): Operation<RegisterModelFact>;
    /**
     * Generate `create-did` operation to create new did and did document.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(contract: string | Address, sender: string | Address, currency: string | CurrencyID): Operation<CreateFact>;
    /**
     * Update an Auth DID document using a strongly-typed document object.
     *
     * This method expects the `document` parameter to conform to the SDK's
     * internal `document` type. All authentication entries must already be
     * validated and structurally correct, and will be converted into
     * corresponding class instances (`AsymKeyAuth`, `LinkedAuth`, etc.).
     *
     * Ownership checks are enforced:
     * - The sender must be the owner of the document DID.
     * - The sender must also own any controller or service DID referenced
     *   in the document
     * @param contract - The Auth DID contract address.
     * @param sender - The transaction sender; must be the owner of the document DID.
     * @param document - A validated document object matching the SDK `document` type.
     * @param currency - Currency ID used for the operation fee.
     * @returns An `Operation` instance that can be signed and submitted to the network.
     */
    updateDocument(contract: string | Address, sender: string | Address, document: Document, currency: string | CurrencyID): Operation<UpdateDocumentFact>;
    /**
     * Update an Auth DID document from a raw JSON object.
     *
     * This method accepts an untyped document (e.g. parsed JSON), validates
     * its structure and authentication entries, and converts it into internal
     * SDK classes before creating the operation.
     *
     * Use this method when the document comes from external or untrusted sources.
     * @param contract - The Auth DID contract address.
     * @param sender - The transaction sender; must own the document DID.
     * @param documentJson - A raw JSON object representing an Auth DID document.
     * @param currency - Currency ID used for the operation fee.
     * @returns An `Operation` instance ready to be signed and submitted.
     */
    updateDocumentByDocumentJson(contract: string | Address, sender: string | Address, documentJson: document, currency: string | CurrencyID): Operation<UpdateDocumentFact>;
    /**
     * Get information for did-registry model.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of did model:
     * - `_hint`: hint for did model design,
     * - `didMethod`: The did method
     */
    getModelInfo(contract: string | Address): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get did by account address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [account] - The account address.
     * @returns `data` of `SuccessResponse` is did:
     * - `did`: The did value,
     */
    getDID(contract: string | Address, account: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get did document by did.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [did] - The did value.
     * @returns `data` of `SuccessResponse` is did document.
     */
    getDocument(contract: string | Address, did: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
export declare const authdid: {
    registerModel(contract: string | Address): AllowedOperation;
    create(contract: string | Address): AllowedOperation;
    updateDocument(contract: string | Address): AllowedOperation;
};
export {};
