/// <reference types="node" />
import { IBuffer, IString } from "../types";
import { Buffer } from "buffer";
export declare class Token implements IBuffer, IString {
    private s;
    constructor(s: string);
    static from(s: string | Token): Token;
    toBuffer(): Buffer;
    toString(): string;
}
