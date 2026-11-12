import type { IBytes, IString } from "../../types";
export declare class Partition implements IBytes, IString {
    private s;
    constructor(s: string);
    static from(s: string | Partition): Partition;
    toBytes(): Uint8Array;
    toString(): string;
}
