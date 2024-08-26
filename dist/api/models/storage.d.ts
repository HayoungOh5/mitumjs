import { Address } from "../../key";
declare function getModel(api: string | undefined, contract: string | Address, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare function getData(api: string | undefined, contract: string | Address, dataKey: string, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare function getDataHistory(api: string | undefined, contract: string | Address, dataKey: string, delegateIP: string | undefined, limit?: number, offset?: number, reverse?: true): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getModel: typeof getModel;
    getData: typeof getData;
    getDataHistory: typeof getDataHistory;
};
export default _default;
