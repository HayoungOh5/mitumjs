import { Address } from "../../key";
declare function getModel(api: string | undefined, contract: string | Address, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare function getByMerkleRoot(api: string | undefined, contract: string | Address, merkleRoot: string, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare function getByTxId(api: string | undefined, contract: string | Address, txId: string, delegateIP: string | undefined): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getModel: typeof getModel;
    getByMerkleRoot: typeof getByMerkleRoot;
    getByTxId: typeof getByTxId;
};
export default _default;
