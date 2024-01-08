import { ErrorCode, ECODE } from "./code"
import { RangeConfig } from "../node"

export class MitumError extends Error {
    readonly code: ErrorCode
    
    private constructor(code: ErrorCode, msg?: string) {
        super(msg)
        this.code = code
    }

    static new() {
        return new MitumError(ECODE.UNKNOWN)
    }

    static detail(code?: ErrorCode, msg?: string) {
        return new MitumError(code ?? ECODE.UNKNOWN, msg)
    }
}

export class Assert {
    private condition: boolean
    private error: MitumError

    private constructor(condition: boolean, error: MitumError) {
        this.condition = condition
        this.error = error
    }

    static get(condition: boolean, error?: MitumError) {
        return new Assert(condition, error ?? MitumError.new())
    }

    static check(condition: boolean, error?: MitumError) {
        Assert.get(condition, error).excute()
    }

    not() {
        this.condition = !this.condition
        return this
    }

    true() {
        return this
    }

    false() {
        return this.not()
    }

    excute() {
        if (!this.condition) {
            throw this.error
        }
    }
}

export class StringAssert {
    private readonly s: string
    private condition: boolean | undefined
    private error: MitumError

    private constructor(s: string,  error: MitumError) {
        this.s = s
        this.error = error
        this.condition = undefined
    }

    static with(s: string, error?:MitumError) {
        return new StringAssert(s, error ?? MitumError.new())
    }

    private union(condition: boolean) {
        if (this.condition !== undefined) {
            this.condition = this.condition && condition
        } else {
            this.condition = condition
        }
    }

    not() {
        if (this.condition !== undefined) {
            this.condition = !this.condition
        }
        return this
    }

    empty() {
        this.union(this.s === "")
        return this
    }

    equal(s: string) {
        this.union(this.s === s)
        return this
    }

    startsWith(...pre: string[]) {
        this.union(pre.reduce((prev, curr) => prev || this.s.startsWith(curr), false))
        return this
    }

    endsWith(...suf: string[]) {
        this.union(suf.reduce((prev, curr) => prev || this.s.endsWith(curr), false))
        return this
    }

    satisfyConfig(config: RangeConfig) {
        this.union(config.satisfy(this.s.length))
        return this
    }

    chainAnd(...conditions: boolean[]) {
        this.union(conditions.reduce((prev, curr) => prev && curr, true))
        return this
    }

    chainOr(...conditions: boolean[]) {
        this.union(conditions.reduce((prev, curr) => prev || curr, false))
        return this
    }

    excute() {
        if (!this.condition) {
            throw this.error
        }
    }
}