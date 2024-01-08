import { Address } from "../key";
import { Big, HintedObject, IP } from "../types";
declare function getOperations(api: string | IP, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getOperation(api: string | IP, hash: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getBlockOperationsByHeight(api: string | IP, height: string | number | Big, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getBlockOperationsByHash(api: string | IP, hash: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getAccountOperations(api: string | IP, address: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function send(api: string | IP, operation: HintedObject | string, delegateIP: string | IP, config?: {
    [i: string]: any;
}): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getOperations: typeof getOperations;
    getOperation: typeof getOperation;
    getBlockOperationsByHeight: typeof getBlockOperationsByHeight;
    getBlockOperationsByHash: typeof getBlockOperationsByHash;
    getAccountOperations: typeof getAccountOperations;
    send: typeof send;
};
export default _default;
