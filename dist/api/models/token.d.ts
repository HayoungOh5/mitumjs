import { Address } from "../../key";
import { IP } from "../../types";
declare function getModel(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getTokenBalance(api: string | IP, contract: string | Address, account: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getModel: typeof getModel;
    getTokenBalance: typeof getTokenBalance;
};
export default _default;
