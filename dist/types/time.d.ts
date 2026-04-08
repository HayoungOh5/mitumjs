import { IBytes, IString } from "./interface";
export declare class TimeStamp implements IBytes, IString {
    private t;
    constructor(t?: string | number | Date);
    static new(): TimeStamp;
    static from(t?: string | number | Date | TimeStamp): TimeStamp;
    toBytes(): Uint8Array;
    toString(): string;
    ISO(): string;
    UTC(): string;
}
export declare class FullTimeStamp extends TimeStamp {
    private r;
    constructor(s: string);
    static from(t: string | FullTimeStamp): FullTimeStamp;
    toBytes(option?: "super"): Uint8Array;
    ISO(): string;
    UTC(): string;
}
