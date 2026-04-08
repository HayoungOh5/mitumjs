/// <reference types="node" />
export type Bytes = Uint8Array;
export declare function isBytes(data: unknown): data is Uint8Array;
export declare function toBytes(data: Bytes | Buffer | string): Bytes;
export declare function concatBytes(arrays: Bytes[]): Bytes;
export declare function hexToBytes(hex: string): Bytes;
