import { Address } from "../../key/index.js";
import { IP } from "../../types/index.js";
declare function getToken(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getTokenBalance(api: string | IP, contract: string | Address, account: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getToken: typeof getToken;
    getTokenBalance: typeof getTokenBalance;
};
export default _default;
