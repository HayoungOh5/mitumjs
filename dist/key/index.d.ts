import { KeyPairType, AddressType, Account } from "./types";
import { randomN } from "./random";
import { Keys, Key, PubKey } from "./pub";
import { BaseKeyPair, KeyPair } from "./keypair";
import { Address, ZeroAddress, NodeAddress } from "./address";
import { Big, Generator, IP } from "../types";
export { KeyPairType, AddressType, Account, Address, ZeroAddress, NodeAddress, Key, Keys, PubKey, BaseKeyPair, KeyPair, randomN, };
type keysType = ({
    key: string | Key | PubKey;
    weight: string | number | Big;
} | PubKey)[] | Array<{
    key: string | Key | PubKey;
    weight: string | number | Big;
}>;
export declare class KeyG extends Generator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    /**
     * Generate a key pair randomly or from the given seed phrase.
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @returns An `Account` object with following properties:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     */
    key(seed?: string): Account;
    /**
     * Generate `n` length of array with randomly generated key pairs.
     * @param {number} [n] - The number of accounts to generate.
     * @returns An array of `Account` objects.
     * Properties of `Account`:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     */
    keys(n: number): Array<Account>;
    /**
     * Generate a key pair from the given private key.
     * @param {string | Key} [key] - The private key.
     * @returns An `Account` object with following properties:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     */
    fromPrivateKey(key: string | Key): Account;
    /**
     * Generate an address from the given public key.
     * @param {string | Key} [key] - The public key.
     * @returns The address.
     */
    address(key: string | Key): string;
    /**
     * Returns a checksummed address for given address string. For invalid address, an error is returned.
     * @param {string} [address] - An address.
     * @returns A checksummed address.
     */
    checksummedAddress(address: string): string;
    /**
     * Generate a multi-signature address from the given keys.
     * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
     * @returns The multi-signature address.
     * @example
     * const pubkey01 = {
     *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14fpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22fpu",
     *     weight: 50
     * };
     * const mutiSigAddress = mitum.account.addressForMultiSig([pubkey01, pubkey02], 100);
     */
    addressForMultiSig(keys: keysType, threshold: string | number | Big): string;
}
