import { IP } from "../../types/index.js";
import { CurrencyID } from "../../common/index.js";
declare function getCurrencies(api: string | IP, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getCurrency(api: string | IP, currency: string | CurrencyID, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getCurrencies: typeof getCurrencies;
    getCurrency: typeof getCurrency;
};
export default _default;
