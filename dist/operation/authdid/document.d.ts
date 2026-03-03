/// <reference types="node" />
import { HintedObject, IBuffer, IHintedObject, LongString } from "../../types";
import { Key } from "../../key";
import { AllowedOperation } from "../base";
declare abstract class Authentication implements IBuffer, IHintedObject {
    private hint;
    constructor(hint: string);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class AsymKeyAuth extends Authentication {
    readonly id: LongString;
    readonly type: "Ed25519VerificationKey2020" | "EcdsaSecp256k1VerificationKey2019" | "EcdsaSecp256k1VerificationKeyImFact2025";
    readonly controller: LongString;
    readonly publicKey: Key;
    readonly publicKeyMultibase: undefined | string;
    constructor(id: string | LongString, type: "Ed25519VerificationKey2020" | "EcdsaSecp256k1VerificationKey2019" | "EcdsaSecp256k1VerificationKeyImFact2025", controller: string | LongString, publicKey: string | Key);
    private setPublicKeyMultibase;
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class LinkedAuth extends Authentication {
    readonly id: LongString;
    readonly type: "LinkedVerificationMethod";
    readonly controller: LongString;
    readonly targetId: LongString;
    readonly allowed: AllowedOperation[];
    constructor(id: string | LongString, controller: string | LongString, targetId: string | LongString, allowed: AllowedOperation[]);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    toString(): string;
}
export declare class Service implements IBuffer, IHintedObject {
    readonly id: LongString;
    readonly type: LongString;
    readonly service_end_point: LongString;
    constructor(id: string | LongString, type: string | LongString, service_end_point: string | LongString);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class Document implements IBuffer, IHintedObject {
    private hint;
    readonly context: LongString[];
    readonly id: LongString;
    readonly authentication: (AsymKeyAuth | LinkedAuth)[];
    readonly verificationMethod: (AsymKeyAuth | LinkedAuth)[];
    readonly service?: Service[];
    constructor(context: string | LongString | (string | LongString)[], id: string | LongString, authentication: (AsymKeyAuth | LinkedAuth)[], verificationMethod: (AsymKeyAuth | LinkedAuth)[], service?: Service[]);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export {};
