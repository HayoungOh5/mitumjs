import { AxiosResponse } from "axios";
import account from "./account";
import block from "./block";
import node from "./node";
import operation from "./operation";
import { SuccessResponse, ErrorResponse } from "../types";
declare const currency: {
    getCurrencies: (api: string | undefined, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    getCurrency: (api: string | undefined, currency: string | import("../common").CurrencyID, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
};
declare const contractApi: {
    dmile: {
        getModel: (api: string | undefined, contract: string | import("../key").Address, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getByMerkleRoot: (api: string | undefined, contract: string | import("../key").Address, merkleRoot: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getByTxHash: (api: string | undefined, contract: string | import("../key").Address, txId: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    };
    did: {
        getModel: (api: string | undefined, contract: string | import("../key").Address, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getByAccount: (api: string | undefined, contract: string | import("../key").Address, account: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getByDID: (api: string | undefined, contract: string | import("../key").Address, did: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    };
};
export { account, block, node, operation, currency, contractApi, };
declare const _default: {
    account: {
        getAccount: (api: string | undefined, address: string | import("../key").Address, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getAccountByPublicKey: (api: string | undefined, publicKey: string | import("../key").Key, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    };
    block: {
        getBlocks: (api: string | undefined, delegateIP: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getBlockByHeight: (api: string | undefined, height: string | number | import("../types").Big, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getBlockByHash: (api: string | undefined, hash: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    };
    node: {
        getNode: (api: string | undefined, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    };
    operation: {
        getOperations: (api: string | undefined, delegateIP: string | undefined, limit?: number | undefined, offset?: [number, number] | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getOperation: (api: string | undefined, hash: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getBlockOperationsByHeight: (api: string | undefined, height: string | number | import("../types").Big, delegateIP: string | undefined, limit?: number | undefined, offset?: number | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        getAccountOperations: (api: string | undefined, address: string | import("../key").Address, delegateIP: string | undefined, limit?: number | undefined, offset?: [number, number] | undefined, reverse?: true | undefined) => Promise<AxiosResponse<any, any>>;
        send: (api: string | undefined, operation: string | import("../types").HintedObject, delegateIP: string | undefined, config?: {
            [i: string]: any;
        } | undefined) => Promise<AxiosResponse<any, any>>;
    };
    currency: {
        getCurrencies: (api: string | undefined, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        getCurrency: (api: string | undefined, currency: string | import("../common").CurrencyID, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
    };
    contractApi: {
        dmile: {
            getModel: (api: string | undefined, contract: string | import("../key").Address, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
            getByMerkleRoot: (api: string | undefined, contract: string | import("../key").Address, merkleRoot: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
            getByTxHash: (api: string | undefined, contract: string | import("../key").Address, txId: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        };
        did: {
            getModel: (api: string | undefined, contract: string | import("../key").Address, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
            getByAccount: (api: string | undefined, contract: string | import("../key").Address, account: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
            getByDID: (api: string | undefined, contract: string | import("../key").Address, did: string, delegateIP: string | undefined) => Promise<AxiosResponse<any, any>>;
        };
    };
};
export default _default;
export declare function getAPIData(f: () => Promise<AxiosResponse>, _links?: boolean): Promise<SuccessResponse | ErrorResponse>;
