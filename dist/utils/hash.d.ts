type Bytes = Uint8Array;
type HashInput = string | Uint8Array;
export declare const sha256: (msg: HashInput) => Bytes;
export declare const sha3: (msg: HashInput) => Bytes;
export declare const keccak256: (msg: HashInput) => Bytes;
export declare const getChecksum: (hex: string) => string;
export {};
