import { HintedObject, IBytes, IHintedObject, IString } from "../../types";
export declare abstract class Item implements IBytes, IString, IHintedObject {
    private hint;
    protected constructor(hint: string);
    abstract toBytes(): Uint8Array;
    abstract toString(): string;
    toHintedObject(): HintedObject;
}
