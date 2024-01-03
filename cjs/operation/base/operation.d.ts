/// <reference types="node" />
import { Fact } from "./fact.js";
import { SignOption } from "./types.js";
import { GeneralFactSign, NodeFactSign } from "./factsign.js";
import { Hint } from "../../common/index.js";
import { Key } from "../../key/index.js";
import { HintedObject, IBuffer, IHintedObject } from "../../types/index.js";
type FactSign = GeneralFactSign | NodeFactSign;
type SigType = "FactSign" | "NodeFactSign" | null;
export declare class Operation<T extends Fact> implements IBuffer, IHintedObject {
    readonly id: string;
    readonly hint: Hint;
    readonly memo: string;
    readonly fact: T;
    private _factSigns;
    private _hash;
    constructor(networkID: string, fact: T, memo?: string);
    setFactSigns(factSigns: FactSign[]): void;
    get factSigns(): FactSign[];
    get hash(): Buffer;
    get factSignType(): SigType;
    private getSigType;
    hashing(force?: "force"): Buffer;
    sign(privateKey: string | Key, option?: SignOption): void;
    private signWithSigType;
    toBuffer(): Buffer;
    toHintedObject(): HintedObject;
    export(filePath: string): void;
}
export {};
