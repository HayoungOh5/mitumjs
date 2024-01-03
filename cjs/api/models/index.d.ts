declare const _default: {
    currency: {
        getCurrencies: (api: string | import("../../types/string.js").IP, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        getCurrency: (api: string | import("../../types/string.js").IP, currency: string | import("../../common/id.js").CurrencyID, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    contract: {
        nft: {
            getNFT: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, nftID: string | number | import("../../types/math.js").Big, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getNFTs: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCollection: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getAccountOperators: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, account: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        credential: {
            getIssuer: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredential: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, templateID: string, credentialID: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getTemplate: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, templateID: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredentials: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, templateID: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredentialByHolder: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, holder: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        dao: {
            getService: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getProposal: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, proposalID: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getDelegator: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, proposalID: string, delegator: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getVoter: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, proposalID: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getVotingResult: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, proposalID: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        kyc: {};
        sto: {
            getService: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getPartitions: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, holder: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getBalanceByHolder: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, holder: string | import("../../key/address.js").Address, partition: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getOperatorsByHolder: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, holder: string | import("../../key/address.js").Address, partition: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getPartitionBalance: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, partition: string, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getAuthorized: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, operator: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        timestamp: {
            getService: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getTimeStamp: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, projectID: string, tid: string | number | import("../../types/math.js").Big, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        token: {
            getToken: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getTokenBalance: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, account: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        point: {
            getPoint: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getPointBalance: (api: string | import("../../types/string.js").IP, contract: string | import("../../key/address.js").Address, account: string | import("../../key/address.js").Address, delegateIP: string | import("../../types/string.js").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
    };
};
export default _default;
