import { IP } from "../types/index.js";
declare function getNode(api: string | IP, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getNode: typeof getNode;
};
export default _default;
