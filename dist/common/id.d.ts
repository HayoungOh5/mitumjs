import type { IBytes, IString } from "../types";
declare abstract class ID implements IBytes, IString {
    private s;
    constructor(s: string);
    equal(id: ID): boolean;
    toBytes(): Uint8Array;
    toString(): string;
}
export declare class CurrencyID extends ID {
    constructor(s: string);
    static from(s: string | CurrencyID): CurrencyID;
}
export {};
