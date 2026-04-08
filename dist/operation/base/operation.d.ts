import { Fact } from "./fact";
import { OperationJson, SignOption } from "./types";
import { GeneralFactSign, NodeFactSign } from "./factsign";
import { Hint } from "../../common";
import { Key } from "../../key/pub";
import { IBytes, IHintedObject } from "../../types";
type FactSign = GeneralFactSign | NodeFactSign;
type SigType = "FactSign" | "NodeFactSign" | null;
export declare class Operation<T extends Fact> implements IBytes, IHintedObject {
    readonly id: string;
    readonly hint: Hint;
    readonly fact: T;
    protected _factSigns: FactSign[];
    protected _hash: Uint8Array;
    constructor(networkID: string, fact: T);
    setFactSigns(factSigns: FactSign[]): void;
    get factSigns(): FactSign[];
    get hash(): Uint8Array;
    get factSignType(): SigType;
    private getSigType;
    hashing(force?: "force"): Uint8Array;
    sign(privateKey: string | Key, option?: SignOption): Promise<void>;
    private signWithSigType;
    toBytes(): Uint8Array;
    toHintedObject(): OperationJson;
}
export {};
