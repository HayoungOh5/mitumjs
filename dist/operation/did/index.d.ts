import { RegisterModelFact } from "./register-model";
import { CreateFact } from "./create-did";
import { MigrateDidFact } from "./migrate-did";
import { ReactivateDidFact } from "./reactive-did";
import { DeactivateDidFact } from "./deactive-did";
import { UpdateDocumentFact } from "./update_did_document";
import { AsymKeyAuth, SocialLoginAuth, Document } from "./document";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { IP, LongString } from "../../types";
type asymkeyAuth = {
    _hint: string;
    id: string | LongString;
    authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019";
    controller: string | LongString;
    publicKey: string | LongString;
};
type socialLoginAuth = {
    _hint: string;
    id: string | LongString;
    authType: string | LongString;
    controller: string | LongString;
    serviceEndpoint: string | LongString;
    proof: {
        verificationMethod: string | LongString;
    };
};
type document = {
    _hint: string;
    "@context": string | LongString;
    status: string;
    created: string;
    id: string | LongString;
    authentication: (asymkeyAuth | socialLoginAuth)[];
    verificationMethod: [];
    service: {
        id: string | LongString;
        type: string | LongString;
        service_end_point: string | LongString;
    };
};
export declare class DID extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    writeAsymkeyAuth(id: string, authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019", controller: string, publicKey: string): AsymKeyAuth;
    writeSocialLoginAuth(id: string, controller: string, serviceEndpoint: string, verificationMethod: string): SocialLoginAuth;
    writeDocument(didContext: string, status: string, created: string, didID: string, authentications: (SocialLoginAuth | AsymKeyAuth)[], serivceID: string, serviceType: string, serviceEndPoint: string): Document;
    /**
     * Generate a `register-model` operation to register new did model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [didMethod] - The did method
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract: string | Address, sender: string | Address, didMethod: string, currency: string | CurrencyID): Operation<RegisterModelFact>;
    /**
     * Generate `create-did` operation to create new did.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {document} [document] - DID document to be created when create new did.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(contract: string | Address, sender: string | Address, authType: "EcdsaSecp256k1VerificationKey2019" | "Ed25519VerificationKey2018", publicKey: string, serviceType: string, serviceEndpoints: string, currency: string | CurrencyID): Operation<CreateFact>;
    /**
     * Generate `migrate-did` operation to migrate did with publicKey and tx id to the did model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | LongString[]} [publicKeys] - array with multiple publicKey to record.
     * @param {string[] | LongString[]} [txIds] - array with multiple tx Id.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `migrate-did` operation
     */
    migrateDID(contract: string | Address, sender: string | Address, publicKeys: string[] | LongString[], txIds: string[] | LongString[], currency: string | CurrencyID): Operation<MigrateDidFact>;
    /**
     * Generate `deactivate-did` operation to deactivate the did.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [did] - The did to deactivate.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `deactivate-did` operation
     */
    deactivate(contract: string | Address, sender: string | Address, did: string, currency: string | CurrencyID): Operation<DeactivateDidFact>;
    /**
     * Generate `reactivate-did` operation to reactivate the did.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [did] - The did to reactivate.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `reactivate-did` operation
     */
    reactivate(contract: string | Address, sender: string | Address, did: string, currency: string | CurrencyID): Operation<ReactivateDidFact>;
    updateDIDDocument(contract: string | Address, sender: string | Address, document: document, currency: string | CurrencyID): Operation<UpdateDocumentFact>;
    /**
     * Get information for did model.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of did model:
     * - `_hint`: hint for did model design,
     * - `didMethod`: The did method,
     * - `docContext`: The context of did,
     * - `docAuthType`: The type of authentication,
     * - `docSvcType`: The type of did service,
     * - `docSvcEndPoint`: The end point of did service
     */
    getModelInfo(contract: string | Address): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get did by publickey.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [publicKey] - The publicKey, // Must be longer than 128 digits. If the length over 128, only the 128 characters from the end will be used.
     * @returns `data` of `SuccessResponse` is did:
     * - `did`: The did value,
     */
    getDIDByPublicKey(contract: string | Address, publicKey: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get did document by did.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [did] - The did value.
     * @returns `data` of `SuccessResponse` is did document:
     * - `did_document`: object
     * - - `'@context'`: The context of did,
     * - - `id`: The did value,
     * - - `created`: The fact hash of create-did operation,
     * - - `status`: 0 means deactive, 1 means active,
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
    getDDocByDID(contract: string | Address, did: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
export {};
