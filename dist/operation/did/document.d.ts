/// <reference types="node" />
import { HintedObject, IBuffer, IHintedObject, LongString } from "../../types";
declare abstract class Authentication implements IBuffer, IHintedObject {
    private hint;
    constructor(hint: string);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class AsymKeyAuth extends Authentication {
    readonly id: LongString;
    readonly authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019";
    readonly controller: LongString;
    readonly publicKey: LongString;
    constructor(id: string | LongString, authType: "Ed25519VerificationKey2018" | "EcdsaSecp256k1VerificationKey2019", controller: string | LongString, publicKey: string | LongString);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export declare class SocialLoginAuth extends Authentication {
    readonly id: LongString;
    readonly authType: "VerifiableCredential";
    readonly controller: LongString;
    readonly serviceEndpoint: LongString;
    readonly proofMethod: LongString;
    constructor(id: string | LongString, controller: string | LongString, serviceEndpoint: string | LongString, proofMethod: string | LongString);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
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
    readonly context: LongString;
    readonly status: LongString;
    readonly created: LongString;
    readonly id: LongString;
    readonly authentication: (AsymKeyAuth | SocialLoginAuth)[];
    readonly verificationMethod: [];
    readonly service_id: LongString;
    readonly service_type: LongString;
    readonly service_end_point: LongString;
    constructor(context: string | LongString, status: string | LongString, created: string | LongString, id: string | LongString, authentication: (AsymKeyAuth | SocialLoginAuth)[], verificationMethod: [], service_id: string | LongString, service_type: string | LongString, service_end_point: string | LongString);
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
}
export {};
