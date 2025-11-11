/// <reference types="node" />
import { Buffer } from "buffer";
type HashFunction = (msg: string | Buffer) => Buffer;
export declare const sha256: HashFunction;
export declare const sha3: HashFunction;
export declare const keccak256: HashFunction;
export declare const getChecksum: (hex: string) => string;
export {};
