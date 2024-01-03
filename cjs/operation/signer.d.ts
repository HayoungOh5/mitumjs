import { OperationJson } from "./base/index.js";
import { Key } from "../key/index.js";
import { Generator, HintedObject, IP } from "../types/index.js";
import { SignOption } from "./base/types.js";
export declare class Signer extends Generator {
    constructor(networkID: string, api?: string | IP);
    sign(privatekey: string | Key, json: HintedObject, option?: SignOption): OperationJson;
    private accSign;
    private nodeSign;
}
