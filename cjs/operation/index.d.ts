import { SignOption, Operation as OP, Fact } from "./base/index.js";
import { Currency, Account, Contract } from "./currency/index.js";
import { NFT } from "./nft/index.js";
import { Credential } from "./credential/index.js";
import { DAO } from "./dao/index.js";
import { STO } from "./sto/index.js";
import { KYC } from "./kyc/index.js";
import { TimeStamp } from "./timestamp/index.js";
import { Token } from "./token/index.js";
import { Point } from "./point/index.js";
import { Signer } from "./signer.js";
import { Key, KeyPair } from "../key/index.js";
import { Generator, HintedObject, IP } from "../types/index.js";
import * as Base from "./base/index.js";
export declare class Operation extends Generator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    getAllOperations(): Promise<import("axios").AxiosResponse<any, any>>;
    getOperation(hash: string): Promise<import("axios").AxiosResponse<any, any>>;
    sign(privatekey: string | Key | KeyPair, operation: OP<Fact>, option?: SignOption): OP<Fact>;
    send(operation: string | HintedObject, headers?: {
        [i: string]: any;
    }): Promise<import("axios").AxiosResponse<any, any>>;
}
export { Currency, Account, Contract, NFT, Credential, DAO, STO, KYC, TimeStamp, Token, Point, Signer, Base, };
