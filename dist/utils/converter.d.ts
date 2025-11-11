import { Buffer } from "buffer";
export declare const privateKeyToPublicKey: (privateKey: string | Buffer) => Uint8Array;
export declare const compress: (publicKey: Uint8Array) => string;
