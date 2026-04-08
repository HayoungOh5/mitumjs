import { IBytes, IString } from "../types";
export declare class LongString implements IBytes, IString {
    private s;
    constructor(s: string);
    static from(s: string | LongString): LongString;
    toBytes(): Uint8Array;
    toString(): string;
}
export declare class ShortDate extends LongString {
    constructor(s: string);
    static from(s: string | ShortDate): ShortDate;
}
export declare class IP extends LongString {
    constructor(s: string);
    static from(s: string | IP): IP;
}
export declare class URIString implements IBytes, IString {
    private s;
    constructor(s: string, name: string);
    toBytes(): Uint8Array;
    toString(): string;
}
