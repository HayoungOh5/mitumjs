import { IBuffer } from "../types"

export const SortFunc = <T extends IBuffer, U extends IBuffer>(a: T, b: U) =>
    Buffer.compare(a.toBuffer(), b.toBuffer())