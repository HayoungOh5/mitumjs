import { Address } from "../../key";
import { Big, IP } from "../../types";
declare function getNFT(api: string | IP, contract: string | Address, nftID: string | number | Big, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getNFTs(api: string | IP, contract: string | Address, delegateIP: string | IP, factHash?: string, limit?: number, offset?: number, reverse?: true): Promise<import("axios").AxiosResponse<any, any>>;
declare function getNFTCount(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getCollection(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getAccountOperators(api: string | IP, contract: string | Address, account: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getNFT: typeof getNFT;
    getNFTs: typeof getNFTs;
    getNFTCount: typeof getNFTCount;
    getCollection: typeof getCollection;
    getAccountOperators: typeof getAccountOperators;
};
export default _default;
