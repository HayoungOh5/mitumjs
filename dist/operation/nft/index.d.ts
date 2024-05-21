import { CreateCollectionFact } from "./create-collection";
import { UpdateCollectionPolicyFact } from "./update-collection-policy";
import { MintFact } from "./mint";
import { ApproveFact } from "./approve";
import { DelegateFact } from "./delegate";
import { TransferFact } from "./transfer";
import { SignFact } from "./sign";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { Big, IP, LongString } from "../../types";
type collectionData = {
    name: string | LongString;
    uri: string | LongString;
    royalty: string | number | Big;
    whitelist: (string | Address)[];
};
type Creator = {
    account: string | Address;
    share: string | number | Big;
};
export declare class NFT extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    /**
     * Generate `create-collection` operation for creating a new NFT collection on the contract.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The collection data to be registed. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `whitelist` - Accounts who have permissions to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-collection` operation
     */
    createCollection(contractAddr: string | Address, sender: string | Address, data: collectionData, currency: string | CurrencyID): Operation<CreateCollectionFact>;
    /**
     * Generate `update-collection` operation for updating the policy of an existing NFT collection on the contract.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The collection data to be registed. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `whitelist` - Accounts who have permissions to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-collection` operation.
     */
    setPolicy(contractAddr: string | Address, sender: string | Address, data: collectionData, currency: string | CurrencyID): Operation<UpdateCollectionPolicyFact>;
    /**
     * Generate `mint` operation for minting a new NFT and assigns it to a receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    mint(contractAddr: string | Address, sender: string | Address, receiver: string | Address, uri: string | LongString, hash: string | LongString, currency: string | CurrencyID, creator: string | Address): Operation<MintFact>;
    /**
     * Generate `mint` operation with multiple item for minting N number of NFT and assigns it to a receiver.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {number} [n] - The number of NFT to be minted.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    multiMint(contractAddr: string | Address, sender: string | Address, receiver: string | Address, n: number, uri: string | LongString, hash: string | LongString, currency: string | CurrencyID, creator: string | Address): Operation<MintFact>;
    /**
     * Generate `mint` operation in case of multiple creators.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {Creator[]} [creators] - An array of Creator object which has address of the creator of the artwork for NFT with their respective shares. The properties of `Creator` include:
     * - {string | Address} `account` - The creator's address.
     * - {string | number | Big} `share` - The share for the artworks. The total share can not over 100.
     * @returns `mint` operation.
     */
    mintForMultiCreators(contractAddr: string | Address, sender: string | Address, receiver: string | Address, uri: string | LongString, hash: string | LongString, currency: string | CurrencyID, creators: Creator[]): Operation<MintFact>;
    /**
     * Generate `transfer` operation for transferring an NFT from one address to another.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the NFT.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer` operation.
     */
    transfer(contractAddr: string | Address, sender: string | Address, receiver: string | Address, nftID: string | number | Big, currency: string | CurrencyID): Operation<TransferFact>;
    /**
     * Generate `approve` operation to approves NFT to another account (operator).
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [owner] - The address of the owner of the NFT.
     * @param {string | Address} [operator] - The address being granted approval to manage the NFT.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve` operation.
     */
    approve(contractAddr: string | Address, owner: string | Address, operator: string | Address, nftID: string | number | Big, currency: string | CurrencyID): Operation<ApproveFact>;
    /**
     * Generate `delegate` operation to sets or cancels the approval for an operator to manage all NFTs of the owner.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [owner] - The address of the owner of the NFT.
     * @param {string | Address} [operator] - The address being granted or denied approval to manage all NFTs.
     * @param {"allow" | "cancel"} [mode] - The mode indicating whether to allow or cancel the approval.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `delegate` operation.
     */
    setApprovalForAll(contractAddr: string | Address, owner: string | Address, operator: string | Address, mode: "allow" | "cancel", currency: string | CurrencyID): Operation<DelegateFact>;
    /**
     * Generate `sign` operation to signs an NFT as creator of the artwork.
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | Address} [creator] - The address of the creator signing the NFT.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `sign` operation.
     */
    sign(contractAddr: string | Address, creator: string | Address, nftID: string | number | Big, currency: string | CurrencyID): Operation<SignFact>;
    /**
     * Get information about an NFT collection on the contract.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the NFT collection:
     * - `_hint`: Hint for NFT design,
     * - `parent`: Address of the contract account,
     * - `creator`: Address of the creator,
     * - `active`: Bool represents activation,
     * - `policy`:
     * - - `_hint`: Hint for the NFT collection policy,
     * - - `name`: Name of the NFT collection,
     * - - `royalty`: Royalty of the NFT collection,
     * - - `uri`: URI of the NFT collection,
     * - - `whitelist`: Array of the addresses of accounts who have permissions to mint
     */
    getCollectionInfo(contractAddr: string | Address): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get the owner of a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string | number | Big} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the address of the NFT owner.
     */
    ownerOf(contractAddr: string | Address, nftID: string | number | Big): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get the address approved to manage a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is an address of the approved account to manage the NFT.
     */
    getApproved(contractAddr: string | Address, nftID: number): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get the total supply of NFTs in a collection on the contract.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @returns `data` of `SuccessResponse` is the total supply of NFTs in the collection.
     */
    totalSupply(contractAddr: string | Address): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get the URI of a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the URI of the NFT.
     */
    tokenURI(contractAddr: string | Address, nftID: number): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get the address is approved to manage all NFTs of a sepecfic owner.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {string} [owner] - The address of the NFT owner.
     * @returns `data` of `SuccessResponse` is approval information:
     * - `_hint`: Hint for NFT operators book,
     * - `operators`: Array of the addresses of accounts that have been delegated authority over all of the owner’s NFTs
     */
    isApprovedForAll(contractAddr: string | Address, owner: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get detailed information about a specific NFT.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [nftID] - The ID of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is detailed information about the NFT:
     * - `_hint`: Hint for NFT,
     * - `id`: Index of the NFT,
     * - `active`: Bool represents activation,
     * - `owner`: Address of the owner,
     * - `hash`: Hash for the NFT,
     * - `uri`: URI for the NFT,
     * - `approved`: Address of the approved account for the NFT,
     * - `creators`: Creator object,
     */
    getNFTInfo(contractAddr: string | Address, nftID: number): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get information of all NFTs in a collection. If the optional parameter factHash is given, only the nft created by the operation is searched.
     * @async
     * @param {string | Address} [contractAddr] - The contract's address.
     * @param {number} [factHash] - (Optional) The hash of fact in the operation that minted NFT.
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns `data` of `SuccessResponse` is an array of the information about all NFTs in the NFT collection:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `_hint`: Hint for NFT,
     * - - `id`: Index of the NFT,
     * - - `active`: Bool represents activation,
     * - - `owner`: Address of the owner,
     * - - `hash`: Hash for the NFT,
     * - - `uri`: URI for the NFT,
     * - - `approved`: Address of the approved account for the NFT,
     * - - `creators`: Creator object,
     * - `_links`: Links for additional information
     */
    getNFTs(contractAddr: string | Address, factHash?: string, limit?: number, offset?: number, reverse?: true): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
export {};
