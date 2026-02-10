import accountApi from "./account";
import blockApi from "./block";
import nodeApi from "./node";
import operationApi from "./operation";
declare const currencyApi: {
    getCurrencies: (api: string | undefined, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    getCurrency: (api: string | undefined, currency: string | import("../common").CurrencyID, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
};
declare const contractApi: {
    nft: {
        getNFT: (api: string | undefined, contract: string | import("../key/address").Address, nftIdx: string | number | import("../types").Big, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getNFTs: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined, factHash?: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getAccountOperators: (api: string | undefined, contract: string | import("../key/address").Address, account: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    credential: {
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getCredential: (api: string | undefined, contract: string | import("../key/address").Address, templateID: string, credentialID: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getTemplate: (api: string | undefined, contract: string | import("../key/address").Address, templateID: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getCredentials: (api: string | undefined, contract: string | import("../key/address").Address, templateID: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getCredentialByHolder: (api: string | undefined, contract: string | import("../key/address").Address, holder: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    dao: {
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getProposal: (api: string | undefined, contract: string | import("../key/address").Address, proposalID: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getApproved: (api: string | undefined, contract: string | import("../key/address").Address, proposalID: string, registrant: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getVoters: (api: string | undefined, contract: string | import("../key/address").Address, proposalID: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getVotingStatus: (api: string | undefined, contract: string | import("../key/address").Address, proposalID: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    kyc: {};
    sto: {
        getService: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getPartitions: (api: string | undefined, contract: string | import("../key/address").Address, holder: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getBalanceByHolder: (api: string | undefined, contract: string | import("../key/address").Address, holder: string | import("../key/address").Address, partition: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getOperatorsByHolder: (api: string | undefined, contract: string | import("../key/address").Address, holder: string | import("../key/address").Address, partition: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getPartitionBalance: (api: string | undefined, contract: string | import("../key/address").Address, partition: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getAuthorized: (api: string | undefined, contract: string | import("../key/address").Address, operator: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    timestamp: {
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getTimeStamp: (api: string | undefined, contract: string | import("../key/address").Address, projectID: string, timestampIdx: string | number | import("../types").Big, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    token: {
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getTokenBalance: (api: string | undefined, contract: string | import("../key/address").Address, account: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    point: {
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getPointBalance: (api: string | undefined, contract: string | import("../key/address").Address, account: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    storage: {
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getData: (api: string | undefined, contract: string | import("../key/address").Address, dataKey: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getDataHistory: (api: string | undefined, contract: string | import("../key/address").Address, dataKey: string, delegateIP: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getDataCount: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined, deleted?: true | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    payment: {
        getAccountInfo: (api: string | undefined, contract: string | import("../key/address").Address, address: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getModel: (api: string | undefined, contract: string | import("../key/address").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
};
export { accountApi, blockApi, nodeApi, operationApi, currencyApi, contractApi, };
