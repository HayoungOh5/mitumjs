import { Big, IP } from "../types";
declare function getBlocks(api: string | IP, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getBlockByHeight(api: string | IP, height: string | number | Big, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getBlockByHash(api: string | IP, hash: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getBlocks: typeof getBlocks;
    getBlockByHeight: typeof getBlockByHeight;
    getBlockByHash: typeof getBlockByHash;
};
export default _default;
