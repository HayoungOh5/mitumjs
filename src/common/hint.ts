import { Version } from "../node"
import { IString } from "../types"

export class Hint implements IString {
    private s: string

    constructor(s: string) {
        this.s = s
    }

    toString(): string {
        return `${this.s}-${Version.get()}`
    }
}