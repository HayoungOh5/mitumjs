/**
 * @file The BrowserProvider class, which provides a standard interface for
 * interacting with browser-based wallets that follow the EIP-1193 standard.
 */
/**
 * Represents the arguments for an request.
 * @interface RequestArguments
 */
interface RequestArguments {
    readonly method: string;
    readonly params?: unknown[];
}
/**
 * Represents the provider object injected by a browser wallet (e.g., window.imfact).
 * This interface is based on the EIP-1193 specification.
 * @interface InjectedProvider
 */
export interface InjectedProvider {
    request(args: RequestArguments): Promise<unknown>;
    on?(eventName: string, listener: (...args: any[]) => void): void;
    removeListener?(eventName: string, listener: (...args: any[]) => void): void;
}
/**
 * @class BrowserProvider
 * @description A provider class for interacting with browser-based wallets
 * that inject a provider object (like window.imfact) into the window.
 * It wraps the injected provider to offer a consistent, high-level API familiar to web3 developers.
 */
export declare class BrowserProvider {
    #private;
    /**
     * Creates an instance of BrowserProvider.
     * @param {InjectedProvider} injectedProvider The provider object injected by the browser wallet (e.g., `window.imfact`).
     * @throws {Error} If the injectedProvider is invalid or does not have a 'request' method.
     */
    constructor(injectedProvider: InjectedProvider);
    /**
     * Sends a raw request to the injected wallet provider.
     * This is the core method used by all other convenience methods.
     * @template T The expected return type of the method.
     * @param {RequestArguments} args The request arguments, including method and parameters.
     * @returns {Promise<T>} A promise that resolves with the result of the call.
     */
    request<T>(args: RequestArguments): Promise<T>;
    /**
     * Subscribes to an event emitted by the wallet.
     * This passes the call directly to the injected provider's `on` method.
     * @param {string} eventName The name of the event to subscribe to (e.g., "accountsChanged").
     * @param {function} listener The function to execute when the event is emitted.
     */
    on(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Unsubscribes from an event.
     * This passes the call directly to the injected provider's `removeListener` method.
     * @param {string} eventName The name of the event to unsubscribe from.
     * @param {function} listener The original callback function used to subscribe.
     */
    removeListener(eventName: string, listener: (...args: any[]) => void): void;
    /**
     * Requests that the user provides an account address to the dApp.
     * This will trigger a connection prompt from the wallet if the dApp is not already connected.
     * This is the standard method for connecting a dApp to a wallet.
     * @returns {Promise<string[]>} A promise that resolves to an array containing a single account address.
     */
    requestAccounts(): Promise<string[]>;
    /**
     * Returns a list of addresses owned by client that the dApp is permitted to access.
     * Does not open any popups. Returns an empty array if no accounts are connected.

     * @returns {Promise<string[]>} A promise that resolves to an array of permitted account addresses.
     */
    getAccounts(): Promise<string[]>;
    /**
     * Requests the wallet to sign and broadcast a transaction to the Mitum network.
     * This will trigger a signing confirmation prompt from the wallet.
     * @param {object} transactionObject A transaction object created by the Mitum SDK.
     * @returns {Promise<string>} A promise that resolves to the transaction hash upon successful broadcast.
     * @throws {Error} If the transactionObject is null or undefined.
     */
    sendTransaction(transactionObject: object): Promise<string>;
    /**
     * Requests the chain ID of the network the wallet is currently connected to.
     * @returns {Promise<string>} A promise that resolves to the chain ID string.
     */
    getChainId(): Promise<string>;
    /**
     * Requests the wallet to switch its active network.
     * This will trigger a network switch confirmation prompt from the wallet.
     * @param {string} chainId The chain ID string to switch to (e.g., 'mainnet').
     * @returns {Promise<null>} A promise that resolves to null if the switch was successful.
     */
    switchChain(chainId: string): Promise<null>;
}
export {};
