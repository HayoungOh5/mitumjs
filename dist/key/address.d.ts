import { AddressType } from "./types";
import { CurrencyID } from "../common";
import { IBytes, IString } from "../types";
declare abstract class BaseAddress implements IBytes, IString {
    private s;
    readonly type: AddressType;
    constructor(s: string, type?: AddressType);
    toBytes(): Uint8Array;
    toString(): string;
}
export declare class Address extends BaseAddress {
    constructor(s: string);
    static from(s: string | Address): Address;
}
export declare class NodeAddress extends BaseAddress {
    constructor(s: string);
    static from(s: string | NodeAddress): NodeAddress;
}
export declare class ZeroAddress extends BaseAddress {
    readonly currency: CurrencyID;
    constructor(s: string);
    static from(s: string | ZeroAddress): ZeroAddress;
}
export {};
