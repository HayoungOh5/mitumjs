import { IString } from "../types";
export declare class Hint implements IString {
    private s;
    constructor(s: string);
    toString(): string;
    static hasVersion(s: string): boolean;
    static fromString(s: string): Hint;
}
