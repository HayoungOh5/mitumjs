import { Address } from "../../key";
declare function getModel(api: string | undefined, contract: string | Address, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare function getByPubKey(api: string | undefined, contract: string | Address, publicKey: string, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare function getByDID(api: string | undefined, contract: string | Address, did: string, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getModel: typeof getModel;
    getByPubKey: typeof getByPubKey;
    getByDID: typeof getByDID;
};
export default _default;
