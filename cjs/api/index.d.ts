import { AxiosResponse } from "axios";
import account from "./account.js";
import block from "./block.js";
import node from "./node.js";
import operation from "./operation.js";
declare const currency: {
    getCurrencies: (api: string | import("../types/string.js").IP, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    getCurrency: (api: string | import("../types/string.js").IP, currency: string | import("../common/id.js").CurrencyID, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
};
declare const contract: {
    nft: {
        getNFT: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, nftID: string | number | import("../types/math.js").Big, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getNFTs: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getCollection: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getAccountOperators: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, account: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    credential: {
        getIssuer: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getCredential: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, templateID: string, credentialID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getTemplate: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, templateID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getCredentials: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, templateID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getCredentialByHolder: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    dao: {
        getService: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getProposal: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getDelegator: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegator: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getVoter: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getVotingResult: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    kyc: {};
    sto: {
        getService: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getPartitions: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getBalanceByHolder: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, partition: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getOperatorsByHolder: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, partition: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getPartitionBalance: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, partition: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getAuthorized: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, operator: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    timestamp: {
        getService: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getTimeStamp: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, projectID: string, tid: string | number | import("../types/math.js").Big, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    token: {
        getToken: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getTokenBalance: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, account: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    point: {
        getPoint: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getPointBalance: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, account: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
};
export { account, block, node, operation, currency, contract, };
declare const _default: {
    account: {
        getAccount: (api: string | import("../types/string.js").IP, address: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getAccountByPublicKey: (api: string | import("../types/string.js").IP, publicKey: string | import("../key/pub.js").Key, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    block: {
        getBlocks: (api: string | import("../types/string.js").IP, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getBlockByHeight: (api: string | import("../types/string.js").IP, height: string | number | import("../types/math.js").Big, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getBlockByHash: (api: string | import("../types/string.js").IP, hash: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    node: {
        getNode: (api: string | import("../types/string.js").IP, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    operation: {
        getOperations: (api: string | import("../types/string.js").IP, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getOperation: (api: string | import("../types/string.js").IP, hash: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getBlockOperationsByHeight: (api: string | import("../types/string.js").IP, height: string | number | import("../types/math.js").Big, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getBlockOperationsByHash: (api: string | import("../types/string.js").IP, hash: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getAccountOperations: (api: string | import("../types/string.js").IP, address: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        send: (api: string | import("../types/string.js").IP, operation: string | import("../types/hinted.js").HintedObject, delegateIP: string | import("../types/string.js").IP, config?: {
            [i: string]: any;
        } | undefined) => Promise<AxiosResponse<any, any>>;
    };
    currency: {
        getCurrencies: (api: string | import("../types/string.js").IP, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        getCurrency: (api: string | import("../types/string.js").IP, currency: string | import("../common/id.js").CurrencyID, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
    };
    contract: {
        nft: {
            getNFT: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, nftID: string | number | import("../types/math.js").Big, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getNFTs: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getCollection: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getAccountOperators: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, account: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
        credential: {
            getIssuer: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getCredential: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, templateID: string, credentialID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getTemplate: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, templateID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getCredentials: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, templateID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getCredentialByHolder: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
        dao: {
            getService: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getProposal: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getDelegator: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegator: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getVoter: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getVotingResult: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, proposalID: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
        kyc: {};
        sto: {
            getService: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getPartitions: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getBalanceByHolder: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, partition: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getOperatorsByHolder: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, holder: string | import("../key/address.js").Address, partition: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getPartitionBalance: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, partition: string, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getAuthorized: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, operator: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
        timestamp: {
            getService: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getTimeStamp: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, projectID: string, tid: string | number | import("../types/math.js").Big, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
        token: {
            getToken: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getTokenBalance: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, account: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
        point: {
            getPoint: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
            getPointBalance: (api: string | import("../types/string.js").IP, contract: string | import("../key/address.js").Address, account: string | import("../key/address.js").Address, delegateIP: string | import("../types/string.js").IP) => Promise<AxiosResponse<any, any>>;
        };
    };
};
export default _default;
export declare function getAPIData(f: () => Promise<AxiosResponse>): Promise<any>;
