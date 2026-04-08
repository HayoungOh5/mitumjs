import { IBytes, IString } from "../types";
export declare class Big implements IBytes, IString {
    readonly big: bigint;
    constructor(big: string | number | bigint | Uint8Array | Big);
    static from(big: string | number | bigint | Uint8Array | Big): Big;
    private bytesToBig;
    toBytes(option?: "fill"): Uint8Array;
    byteLen(): number;
    get v(): number;
    toString(): string;
    overZero(): boolean;
    compare(n: string | number | Big): 1 | 0 | -1;
}
export declare class Float implements IBytes, IString {
    readonly n: number;
    constructor(n: number);
    static from(n: number | Float): Float;
    toBytes(): Uint8Array;
    toString(): string;
}
export declare class Uint8 implements IBytes, IString {
    readonly n: number;
    constructor(n: number);
    static from(n: number | Uint8): Uint8;
    toBytes(): Uint8Array;
    get v(): number;
    toString(): string;
}
export declare class Bool implements IBytes, IString {
    private b;
    constructor(b: boolean);
    static from(b: boolean | Bool): Bool;
    toBytes(): Uint8Array;
    get v(): boolean;
}
