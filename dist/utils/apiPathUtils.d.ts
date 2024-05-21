import { IP } from "../types";
export declare const delegateUri: (delegateIP: string | IP) => string;
export declare const apiPathWithParams: (apiPath: string, limit?: number, offset?: number, reverse?: true) => string;
export declare const apiPathWithHashParams: (apiPath: string, factHash?: string, limit?: number, offset?: number, reverse?: true) => string;
export declare const apiPathWithParamsExt: (apiPath: string, limit?: number, offset?: [number, number], reverse?: true) => string;
