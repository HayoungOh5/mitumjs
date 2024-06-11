import { TokenFact } from "./fact"
import { FactJson } from "../base"

import { Big } from "../../types"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class BurnFact extends TokenFact {
    readonly target: Address
    readonly amount: Big

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        super(HINT.TOKEN.BURN.FACT, token, sender, contract, currency)

        this.target = Address.from(sender)
        this.amount = Big.from(amount)

        // Assert.check(
        //     Address.from(contract).toString() !== this.target.toString(),
        //     MitumError.detail(ECODE.INVALID_FACT, "target is same with contract address")
        // )

        Assert.check(
            this.amount.overZero(),
            MitumError.detail(ECODE.INVALID_FACT, "amount must be over zero"),
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            target:  this.target.toString(),
            amount: this.amount.toString(),
        }
    }

    get operationHint() {
        return HINT.TOKEN.BURN.OPERATION
    }
}