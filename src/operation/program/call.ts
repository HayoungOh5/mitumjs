import { Buffer } from "buffer"
import { HINT } from "../../alias"
import { ContractFact, FactJson } from "../base"
import type { Address } from "../../key/address"
import type { CurrencyID } from "../../common"
import { LongString } from "../../types"
import { CallData, callDataToHash } from "./register"
import { Assert, ECODE, MitumError } from "../../error"
import { Config } from "../../node"

export class CallFact extends ContractFact {
    readonly callData: CallData

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        func: string | LongString,
        callData: Record<string, string | LongString>,
        currency: string | CurrencyID,
    ) {
        super(HINT.PROGRAM.CALL.FACT, token, sender, contract, currency)

        const funcStr = LongString.from(func).toString()
        Assert.check(
            funcStr.length > 0,
            MitumError.detail(
                ECODE.INVALID_FACT,
                "call operation requires non-empty 'func' in callData",
            ),
        )

        this.callData = { function: funcStr }
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
            callDataToHash(this.callData),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            call_data: this.callData,
        }
    }

    get operationHint() {
        return HINT.PROGRAM.CALL.OPERATION
    }
}
