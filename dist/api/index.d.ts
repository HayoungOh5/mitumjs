import { AxiosResponse } from "axios";
import account from "./account";
import block from "./block";
import node from "./node";
import operation from "./operation";
import { SuccessResponse, ErrorResponse } from "../types";
declare const currency: {
    getCurrencies: (api: string | import("../types").IP, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    getCurrency: (api: string | import("../types").IP, currency: string | import("../common").CurrencyID, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
};
declare const contractApi: {
    nft: {
        getNFT: (api: string | import("../types").IP, contract: string | import("../key").Address, nftIdx: string | number | import("../types").Big, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getNFTs: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP, factHash?: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getNFTCount: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getAccountOperators: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    credential: {
        getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getCredential: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, credentialID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getTemplate: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getCredentials: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getCredentialByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    dao: {
        getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getProposal: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getApproved: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, registrant: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getVoters: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getVotingStatus: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    kyc: {};
    sto: {
        getService: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getPartitions: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getBalanceByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getOperatorsByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getPartitionBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, partition: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getAuthorized: (api: string | import("../types").IP, contract: string | import("../key").Address, operator: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    timestamp: {
        getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getTimeStamp: (api: string | import("../types").IP, contract: string | import("../key").Address, projectID: string, timestampIdx: string | number | import("../types").Big, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    token: {
        getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getTokenBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    point: {
        getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getPointBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
};
export { account, block, node, operation, currency, contractApi, };
declare const _default: {
    account: {
        getAccount: (api: string | import("../types").IP, address: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getAccountByPublicKey: (api: string | import("../types").IP, publicKey: string | import("../key").Key, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    block: {
        getBlocks: (api: string | import("../types").IP, delegateIP: string | import("../types").IP, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getBlockByHeight: (api: string | import("../types").IP, height: string | number | import("../types").Big, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getBlockByHash: (api: string | import("../types").IP, hash: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    node: {
        getNode: (api: string | import("../types").IP, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    operation: {
        getOperations: (api: string | import("../types").IP, delegateIP: string | import("../types").IP, limit?: number | undefined, offset?: [number, number] | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getOperation: (api: string | import("../types").IP, hash: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getBlockOperationsByHeight: (api: string | import("../types").IP, height: string | number | import("../types").Big, delegateIP: string | import("../types").IP, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getAccountOperations: (api: string | import("../types").IP, address: string | import("../key").Address, delegateIP: string | import("../types").IP, limit?: number | undefined, offset?: [number, number] | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        send: (api: string | import("../types").IP, operation: string | import("../types").HintedObject, delegateIP: string | import("../types").IP, config?: {
            [i: string]: any;
        } | undefined) => Promise<AxiosResponse<any, any>>;
    };
    currency: {
        getCurrencies: (api: string | import("../types").IP, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        getCurrency: (api: string | import("../types").IP, currency: string | import("../common").CurrencyID, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
    };
    contractApi: {
        nft: {
            getNFT: (api: string | import("../types").IP, contract: string | import("../key").Address, nftIdx: string | number | import("../types").Big, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getNFTs: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP, factHash?: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
            getNFTCount: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getAccountOperators: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
        credential: {
            getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getCredential: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, credentialID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getTemplate: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getCredentials: (api: string | import("../types").IP, contract: string | import("../key").Address, templateID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getCredentialByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
        dao: {
            getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getProposal: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getApproved: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, registrant: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getVoters: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getVotingStatus: (api: string | import("../types").IP, contract: string | import("../key").Address, proposalID: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
        kyc: {};
        sto: {
            getService: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getPartitions: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getBalanceByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getOperatorsByHolder: (api: string | import("../types").IP, contract: string | import("../key").Address, holder: string | import("../key").Address, partition: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getPartitionBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, partition: string, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getAuthorized: (api: string | import("../types").IP, contract: string | import("../key").Address, operator: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
        timestamp: {
            getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getTimeStamp: (api: string | import("../types").IP, contract: string | import("../key").Address, projectID: string, timestampIdx: string | number | import("../types").Big, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
        token: {
            getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getTokenBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
        point: {
            getModel: (api: string | import("../types").IP, contract: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
            getPointBalance: (api: string | import("../types").IP, contract: string | import("../key").Address, account: string | import("../key").Address, delegateIP: string | import("../types").IP) => Promise<AxiosResponse<any, any>>;
        };
    };
};
export default _default;
export declare function getAPIData(f: () => Promise<AxiosResponse>, _links?: boolean): Promise<SuccessResponse | ErrorResponse>;
