"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFT = void 0;
const create_collection_js_1 = require("./create-collection.js");
const update_collection_policy_js_1 = require("./update-collection-policy.js");
const mint_js_1 = require("./mint.js");
const approve_js_1 = require("./approve.js");
const delegate_js_1 = require("./delegate.js");
const transfer_js_1 = require("./transfer.js");
const sign_js_1 = require("./sign.js");
const signer_js_1 = require("./signer.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../api/index.js");
const index_js_3 = require("../../types/index.js");
const index_js_4 = require("../../error/index.js");
class NFT extends index_js_1.ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createCollection(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            index_js_4.Assert.check(data[key] !== undefined, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new index_js_1.Operation(this.networkID, new create_collection_js_1.CreateCollectionFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    setPolicy(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            index_js_4.Assert.check(data[key] !== undefined, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new index_js_1.Operation(this.networkID, new update_collection_policy_js_1.UpdateCollectionPolicyFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    mint(contractAddr, sender, receiver, uri, hash, currency, creator) {
        return new index_js_1.Operation(this.networkID, new mint_js_1.MintFact(index_js_3.TimeStamp.new().UTC(), sender, [new mint_js_1.MintItem(contractAddr, receiver, hash, uri, new signer_js_1.Signers(100, [new signer_js_1.Signer(creator, 100, false)]), currency)]));
    }
    mintForMultiCreators(contractAddr, sender, receiver, uri, hash, currency, creators) {
        const keysToCheck = ['account', 'share'];
        keysToCheck.forEach((key) => {
            creators.forEach((creator) => {
                index_js_4.Assert.check(creator[key] !== undefined, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the Creator structure`));
            });
        });
        return new index_js_1.Operation(this.networkID, new mint_js_1.MintFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new mint_js_1.MintItem(contractAddr, receiver, hash, uri, new signer_js_1.Signers(creators.reduce((prev, next) => prev + index_js_3.Big.from(next.share).v, 0), creators.map(a => new signer_js_1.Signer(a.account, a.share, false))), currency)
        ]));
    }
    transfer(contractAddr, sender, receiver, nftID, currency) {
        const fact = new transfer_js_1.TransferFact(index_js_3.TimeStamp.new().UTC(), sender, [
            new transfer_js_1.TransferItem(contractAddr, receiver, nftID, currency)
        ]);
        return new index_js_1.Operation(this.networkID, fact);
    }
    approve(contractAddr, owner, operator, nftID, currency) {
        return new index_js_1.Operation(this.networkID, new approve_js_1.ApproveFact(index_js_3.TimeStamp.new().UTC(), owner, [
            new approve_js_1.ApproveItem(contractAddr, operator, nftID, currency)
        ]));
    }
    setApprovalForAll(contractAddr, owner, operator, mode, currency) {
        return new index_js_1.Operation(this.networkID, new delegate_js_1.DelegateFact(index_js_3.TimeStamp.new().UTC(), owner, [
            new delegate_js_1.DelegateItem(contractAddr, operator, mode, currency)
        ]));
    }
    signNFT(contractAddr, creator, nftID, currency) {
        return new index_js_1.Operation(this.networkID, new sign_js_1.SignFact(index_js_3.TimeStamp.new().UTC(), creator, [
            new sign_js_1.SignItem(contractAddr, nftID, currency)
        ]));
    }
    getCollectionInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getCollection(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    /**
     * @deprecated use getCollectionInfo()
     */
    getCollectionPolicy(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const design = yield this.getCollectionInfo(contractAddr);
            return design ? design.policy : null;
        });
    }
    ownerOf(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
            return data ? data._embedded.owner : null;
        });
    }
    getApproved(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
            return data ? data._embedded.approved : null;
        });
    }
    totalSupply(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getNFTs(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded.length : null;
        });
    }
    tokenURI(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
            return data ? data._embedded.uri : null;
        });
    }
    isApprovedForAll(contractAddr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getAccountOperators(this.api, contractAddr, owner, this.delegateIP));
        });
    }
    getNFTInfo(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
        });
    }
    getNFTs(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_2.getAPIData)(() => index_js_2.contract.nft.getNFTs(this.api, contractAddr, this.delegateIP));
        });
    }
}
exports.NFT = NFT;
//# sourceMappingURL=index.js.map