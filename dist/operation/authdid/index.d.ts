import { RegisterModelFact } from "./register-model";
import { CreateFact } from "./create-did";
import { UpdateDocumentFact } from "./update_did_document";
import { ContractGenerator, Operation } from "../base";
import { Address, Key } from "../../key";
import { CurrencyID } from "../../common";
import { IP, LongString } from "../../types";
type asymkeyAuth = {
    _hint: string;
    id: string | LongString;
    authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019";
    controller: string | LongString;
    publicKey: string | Key;
};
type socialLoginAuth = {
    _hint: string;
    id: string | LongString;
    authType: "VerifiableCredential";
    controller: string | LongString;
    serviceEndpoint: string | LongString;
    proof: {
        verificationMethod: string | LongString;
    };
};
type document = {
    _hint: string;
    "@context": string | LongString;
    id: string | LongString;
    authentication: (asymkeyAuth | socialLoginAuth)[];
    verificationMethod: [];
    service: {
        id: string | LongString;
        type: string | LongString;
        service_end_point: string | LongString;
    };
};
export declare class AuthDID extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    private validateDocument;
    private isSenderDidOwner;
    /**
     * Creates an AsymKeyAuth object with the provided authentication details.
     * @param {string} id - The unique identifier for the authentication.
     * @param {"EcdsaSecp256k1VerificationKey2019"} authType - The type of the asymmetric key used for verification.
     * @param {string} controller - The controller responsible for the authentication.
     * @param {string} publicKey - The public key associated with the authentication.
     * @returns {object} An asymkeyAuth object.
     */
    writeAsymkeyAuth(id: string, authType: "EcdsaSecp256k1VerificationKey2019", controller: string, publicKey: string): asymkeyAuth;
    /**
     * Creates a SocialLoginAuth object with the provided authentication details.
     * @param {string} id - The unique identifier for the authentication.
     * @param {string} controller - The controller responsible for the authentication.
     * @param {string} serviceEndpoint - The endpoint URL for the social login service.
     * @param {string} verificationMethod - The verification method used for authentication.
     * @returns {object} A socialLoginAuth object.
     */
    writeSocialLoginAuth(id: string, controller: string, serviceEndpoint: string, verificationMethod: string): socialLoginAuth;
    /**
     * Creates a DID Document with the provided context, DID ID, authentications, and service details.
     * Use return value of this method for updateDocument()
     * @param {string} didContext - The context for the DID document.
     * @param {string} didID - The unique identifier for the DID.
     * @param {(asymkeyAuth | socialLoginAuth)[]} authentications - An array of authentication objects.
     *        Each object must be either an instance of `asymkeyAuth` or `socialLoginAuth`.
     * @param {string} serviceID - The identifier for the associated service.
     * @param {string} serviceType - The type of the service (e.g., `LinkedDataProof`, `BlockchainService`).
     * @param {string} serviceEndPoint - The endpoint URL of the service.
     * @returns {object} A hinted object representation of the created DID Document. Use it for updateDocument().
     */
    writeDocument(didContext: string, didID: string, authentications: (asymkeyAuth | socialLoginAuth)[], serviceID: string, serviceType: string, serviceEndPoint: string): document;
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
     * @param {"ECDSA"} [authType] - The encryption method to use for authentication.
     * @param {publicKey} [publicKey] - The public key to use for authentication.
     * @param {serviceType} [serviceType] - The serivce type.
     * @param {serviceEndpoints} [serviceEndpoints] - The service end point.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(contract: string | Address, sender: string | Address, authType: "ECDSA", //"ECDSA" | "EdDSA"
    publicKey: string, serviceType: string, serviceEndpoints: string, currency: string | CurrencyID): Operation<CreateFact>;
    /**
     * Generate `update-did-document` operation to update the did document.
     * `document` must comply with document type
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {document} [document] - The did document to be updated.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-did-document` operation
     */
    updateDocument(contract: string | Address, sender: string | Address, document: document, currency: string | CurrencyID): Operation<UpdateDocumentFact>;
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
     * @returns `data` of `SuccessResponse` is did document:
     * - `did_document`: object
     * - - `'@context'`: The context of did,
     * - - `id`: The did value,
     * - - `authentication`: object,
     * - - - `id`: The did value,
     * - - - `type`: The type of authentication
     * - - - `controller`: The did value
     * - - - `publicKey`: The publickey used when did create,
     * - - `service`: object
     * - - - `id`: The did value
     * - - - `type`: The type of did service,
     * - - - `service_end_point`: The end point of did service,
     */
    getDocument(contract: string | Address, did: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
export {};
