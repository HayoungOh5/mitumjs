declare const _default: {
    currency: {
        getCurrencies: (api: string | import("../../types").IP, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        getCurrency: (api: string | import("../../types").IP, currency: string | import("../../common").CurrencyID, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    contract: {
        nft: {
            getNFT: (api: string | import("../../types").IP, contract: string | import("../../key").Address, nftIdx: string | number | import("../../types").Big, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getNFTs: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP, factHash?: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
            getNFTCount: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getModel: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getAccountOperators: (api: string | import("../../types").IP, contract: string | import("../../key").Address, account: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        credential: {
            getModel: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredential: (api: string | import("../../types").IP, contract: string | import("../../key").Address, templateID: string, credentialID: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getTemplate: (api: string | import("../../types").IP, contract: string | import("../../key").Address, templateID: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredentials: (api: string | import("../../types").IP, contract: string | import("../../key").Address, templateID: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getCredentialByHolder: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        dao: {
            getModel: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getProposal: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getApproved: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string, registrant: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getVoters: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getVotingStatus: (api: string | import("../../types").IP, contract: string | import("../../key").Address, proposalID: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        kyc: {};
        sto: {
            getService: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getPartitions: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getBalanceByHolder: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address, partition: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getOperatorsByHolder: (api: string | import("../../types").IP, contract: string | import("../../key").Address, holder: string | import("../../key").Address, partition: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getPartitionBalance: (api: string | import("../../types").IP, contract: string | import("../../key").Address, partition: string, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getAuthorized: (api: string | import("../../types").IP, contract: string | import("../../key").Address, operator: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        timestamp: {
            getModel: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getTimeStamp: (api: string | import("../../types").IP, contract: string | import("../../key").Address, projectID: string, timestampIdx: string | number | import("../../types").Big, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        token: {
            getModel: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getTokenBalance: (api: string | import("../../types").IP, contract: string | import("../../key").Address, account: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        point: {
            getModel: (api: string | import("../../types").IP, contract: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
            getPointBalance: (api: string | import("../../types").IP, contract: string | import("../../key").Address, account: string | import("../../key").Address, delegateIP: string | import("../../types").IP) => Promise<import("axios").AxiosResponse<any, any>>;
        };
    };
};
export default _default;
