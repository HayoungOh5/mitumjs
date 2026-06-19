import { Generator } from "./types";
import type { IP } from "./types";
import { Block, Node } from "./node";
import { Utils } from "./utils/transformUnit";
import { Account, Currency, Contract, NFT, DAO, TimeStamp, Token, Storage, Payment, Signer, Did } from "./operation";
import { Operation } from "./operation/api";
import { AccountAbstraction } from "./operation/accountAbstraction";
import { BrowserProvider } from "./providers";
export declare class Mitum extends Generator {
    static allowedOperation: {
        readonly currency: {
            transfer(): import("./operation/base").AllowedOperation;
        };
        readonly account: {
            create(): import("./operation/base").AllowedOperation;
            updateKey(): import("./operation/base").AllowedOperation;
        };
        readonly contract: {
            create(): import("./operation/base").AllowedOperation;
            withdraw(): import("./operation/base").AllowedOperation;
            updateRecipient(): import("./operation/base").AllowedOperation;
            updateHandler(): import("./operation/base").AllowedOperation;
        };
        readonly did: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            create(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateDocument(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly credential: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            addTemplate(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            issue(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            revoke(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly dao: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateModelConfig(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            propose(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            cancelProposal(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            register(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            preSnap(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            postSnap(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            vote(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            execute(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly nft: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateModelConfig(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            mint(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approveAll(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approve(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            addSignature(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly payment: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            deposit(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateAccountSetting(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            withdraw(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly point: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            mint(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approve(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            burn(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transferFrom(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly storage: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            createData(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            deleteData(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateData(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly timestamp: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            issue(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly token: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            mint(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approve(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            burn(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transferFrom(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
    };
    private _node;
    private _account;
    private _currency;
    private _contract;
    private _block;
    private _operation;
    private _signer;
    private _nft;
    private _timestamp;
    private _dao;
    private _token;
    private _storage;
    private _payment;
    private _did;
    private _aa?;
    ECODE: Object;
    PCODE: Object;
    DCODE: Object;
    private _utils;
    constructor(api?: string, delegateIP?: string);
    private refresh;
    get node(): Node;
    get account(): Account;
    get currency(): Currency;
    get block(): Block;
    get operation(): Operation;
    get signer(): Signer;
    get contract(): Contract;
    get nft(): NFT;
    get timestamp(): TimeStamp;
    get dao(): DAO;
    get token(): Token;
    get storage(): Storage;
    get payment(): Payment;
    get did(): Did;
    get utils(): Utils;
    /**
     * Account-abstraction generator. Builds and signs UserOperations.
     *
     * Lazily instantiated: callers that never touch `aa` (e.g. wallets that only
     * use currency/did/nft) never construct an {@link AccountAbstraction}, so it
     * costs nothing at runtime for them.
     */
    get aa(): AccountAbstraction;
    /**
     * Set the API URL to interact with Mitum network.
     * @param {string | IP} [api] - The API URL to set
     */
    setAPI(api: string | IP): void;
    /**
     * Set the delegate IP address.
     * @param {string | IP} [delegateIP] - The delegate IP address to set.
     */
    setDelegate(delegateIP: string | IP): void;
    /**
     * Set the blockchain network ID (chain). The default value is configured to 'mitum'.
     * @param {string} [networkID] - The network ID to set.
     */
    setNetworkID(networkID: string): void;
    /**Get the API URL in use.
     * @returns {string | undefined} The API URL.
    */
    getAPI(): string | undefined;
    /**
     * Get the delegate IP in use.
     * @returns {string} The delegate IP address.
     */
    getDelegate(): string | undefined;
    /**Get the network ID in use.
     * @returns {string} The network ID (chain).
    */
    getNetworkID(): string;
}
export { BrowserProvider };
export { AccountAbstraction } from "./operation/accountAbstraction";
export { UserOperation, Authentication, ProxyPayer, Settlement } from "./operation/base";
export type { Item, Fact, BaseOperation } from "./operation/base";
export type { FeeEstimate } from "./operation/api";
export type { Account, HDAccount, defaultPath } from "./key/types";
export { isOpFact, isHintedObject, isHintedObjectFromUserOp } from "./utils/typeGuard";
