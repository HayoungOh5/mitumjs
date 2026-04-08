import { Address } from "./address";
import { KeyPairType } from "./types";
import { Big, HintedObject, IBytes, IHintedObject, IString } from "../types";
type BigArg = string | number | Big;
type Pub = [string | Key, BigArg] | PubKey;
export declare class Key implements IBytes, IString {
    private readonly key;
    private readonly suffix;
    readonly type: KeyPairType;
    readonly isPriv: boolean;
    constructor(s: string);
    static from(s: string | Key): Key;
    get noSuffix(): string;
    toBytes(): Uint8Array;
    toString(): string;
}
export declare class PubKey extends Key implements IHintedObject, IBytes {
    private static hint;
    readonly weight: Big;
    constructor(key: string | Key, weight: number | string | Big);
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export declare class Keys implements IBytes, IHintedObject {
    private static hint;
    private readonly _keys;
    readonly threshold: Big;
    constructor(keys: Pub[], threshold: BigArg);
    get keys(): PubKey[];
    private sortKeys;
    get checksum(): Address;
    toBytes(): Uint8Array;
    toHintedObject(): HintedObject;
}
export {};
