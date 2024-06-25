import { Address } from "../../key";
import { Big, IP } from "../../types";
declare function getModel(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getTimeStamp(api: string | IP, contract: string | Address, projectID: string, timestampIdx: string | number | Big, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getModel: typeof getModel;
    getTimeStamp: typeof getTimeStamp;
};
export default _default;
