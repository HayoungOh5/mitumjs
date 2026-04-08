import { Hint } from "../../common";
import { Address } from "../../key";
import { Allowed } from "./types";
export declare class AllowedOperation {
    readonly contract?: Address;
    readonly operationHint: Hint;
    constructor(operationHint: string, contract?: string | Address, requireContract?: boolean);
    toBytes(): Uint8Array;
    toHintedObject(): Allowed;
}
