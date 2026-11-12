import { Address } from "../../key/address";
declare function query(api: string | undefined, contract: string | Address, data: Record<string, string>, delegateIP: string | undefined, config?: {
    [i: string]: any;
}): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    query: typeof query;
};
export default _default;
