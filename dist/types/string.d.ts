/// <reference types="node" />
import { IBuffer, IString } from "../types";
import { Buffer } from "buffer";
export declare class LongString implements IBuffer, IString {
    private s;
    constructor(s: string);
    static from(s: string | LongString): LongString;
    toBuffer(): Buffer;
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
export declare class URIString implements IBuffer, IString {
    private s;
    constructor(s: string, name: string);
    toBuffer(): Buffer;
    toString(): string;
}
