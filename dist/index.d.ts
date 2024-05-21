import { Generator, IP } from "./types";
import { Block, Node } from "./node";
import { Account, Currency, Contract, NFT, DAO, KYC, STO, TimeStamp, Credential, Token, Point, Operation, Signer } from "./operation";
export declare class Mitum extends Generator {
    private _node;
    private _account;
    private _currency;
    private _contract;
    private _block;
    private _operation;
    private _signer;
    private _nft;
    private _credential;
    private _timestamp;
    private _sto;
    private _kyc;
    private _dao;
    private _token;
    private _point;
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
    get credential(): Credential;
    get timestamp(): TimeStamp;
    get sto(): STO;
    get kyc(): KYC;
    get dao(): DAO;
    get token(): Token;
    get point(): Point;
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
     * @returns {string} The API URL.
    */
    getAPI(): string;
    /**
     * Get the delegate IP in use.
     * @returns {string} The delegate IP address.
     */
    getDelegate(): string;
    /**Get the network ID in use.
     * @returns {string} The network ID (chain).
    */
    getNetworkID(): string;
}
export default Mitum;
