import { Buffer } from "buffer"
import { HINT } from "../../alias"
import { ContractFact, FactJson } from "../base"
import type { Address } from "../../key/address"
import type { CurrencyID } from "../../common"
import { LongString } from "../../types"
import { sha3 } from "../../utils"
import { Assert, ECODE, MitumError } from "../../error"
import { Config } from "../../node"

export type CallData = Record<string, string>

export function callDataToHash(callData: CallData): Buffer {
    const sortedKeys = Object.keys(callData).sort()
    const json = JSON.stringify(callData, sortedKeys)
        .replace(/&/g, "\\u0026")
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029")
    return sha3(Buffer.from(json))
}

export class RegisterFact extends ContractFact {
    readonly code: LongString
    readonly callData: CallData

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        code: string | LongString,
        callData: Record<string, string | LongString> | undefined,
        currency: string | CurrencyID,
    ) {
        super(HINT.PROGRAM.REGISTER.FACT, token, sender, contract, currency)
        this.code = LongString.from(code)
        this.callData = {}
        if (callData !== undefined) {
            const entries = Object.entries(callData)
            Assert.check(
                entries.length <= Config.CALLDATA_ENTRIES.max,
                MitumError.detail(
                    ECODE.INVALID_FACT,
                    `register callData cannot exceed ${Config.CALLDATA_ENTRIES.max} entries`,
                ),
            )
            for (const key of Object.keys(callData).sort()) {
                const value = callData[key]

                this.callData[key] =
                    value === ""
                        ? ""
                        : LongString.from(value).toString()
            }
        }

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.code.toBuffer(),
            callDataToHash(this.callData),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            code: this.code.toString(),
            call_data: this.callData,
        }
    }

    get operationHint() {
        return HINT.PROGRAM.REGISTER.OPERATION
    }
}
