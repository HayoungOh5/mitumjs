declare const _default: {
    currency: {
        getCurrencies: (api: string | undefined, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getCurrency: (api: string | undefined, currency: string | import("../../common").CurrencyID, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    contract: {
        dmile: {
            getModel: (api: string | undefined, contract: string | import("../../key").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
            getByMerkleRoot: (api: string | undefined, contract: string | import("../../key").Address, merkleRoot: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
            getByTxHash: (api: string | undefined, contract: string | import("../../key").Address, txId: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        };
        did: {
            getModel: (api: string | undefined, contract: string | import("../../key").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
            getByAccount: (api: string | undefined, contract: string | import("../../key").Address, account: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
            getByDID: (api: string | undefined, contract: string | import("../../key").Address, did: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        };
    };
};
export default _default;
