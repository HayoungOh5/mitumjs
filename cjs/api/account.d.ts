import { IP } from "../types/index.js";
import { Address, Key } from "../key/index.js";
declare function getAccount(api: string | IP, address: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getAccountByPublicKey(api: string | IP, publicKey: string | Key, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getAccount: typeof getAccount;
    getAccountByPublicKey: typeof getAccountByPublicKey;
};
export default _default;
