import { KeyPairType } from "./types.js";
import { Keys } from "./pub.js";
import { BaseKeyPair } from "./keypair.js";
export declare const randomN: (n: number, option?: KeyPairType) => {
    keys: Keys;
    keypairs: BaseKeyPair[];
};
