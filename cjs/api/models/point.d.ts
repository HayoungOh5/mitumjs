import { Address } from "../../key/index.js";
import { IP } from "../../types/index.js";
declare function getPoint(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getPointBalance(api: string | IP, contract: string | Address, account: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getPoint: typeof getPoint;
    getPointBalance: typeof getPointBalance;
};
export default _default;
