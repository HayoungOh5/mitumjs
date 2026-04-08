import { IBytes, IString } from "../types";
export declare class Token implements IBytes, IString {
    private s;
    constructor(s: string);
    static from(s: string | Token): Token;
    toBytes(): Uint8Array;
    toString(): string;
}
