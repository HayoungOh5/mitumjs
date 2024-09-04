declare const _default: {
    currency: {
        getCurrencies: (api: string | undefined, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        getCurrency: (api: string | undefined, currency: string | import("../../common").CurrencyID, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
    };
    contract: {
        prescription: {
            getModel: (api: string | undefined, contract: string | import("../../key").Address, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
            getPrescription: (api: string | undefined, contract: string | import("../../key").Address, hash: string, delegateIP: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
        };
    };
};
export default _default;
