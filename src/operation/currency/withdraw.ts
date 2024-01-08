import { CurrencyItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { Amount } from "../../common"
import { SortFunc } from "../../utils"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class WithdrawItem extends CurrencyItem {
    readonly target: Address

    constructor(target: string | Address, amounts: Amount[]) {
        super(HINT.CURRENCY.WITHDRAW.ITEM, amounts)
        this.target = typeof target === "string" ? new Address(target) : target
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.target.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
        }
    }

    toString(): string {
        return this.target.toString()
    }
}

export class WithdrawFact extends OperationFact<WithdrawItem> {
    constructor(token: string, sender: string | Address, items: WithdrawItem[]) {
        super(HINT.CURRENCY.WITHDRAW.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate target found in items")
        )

        this.items.forEach(
            it => Assert.check(
                this.sender.toString() != it.target.toString(),
                MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with target address"),
            )
        )
    }

    get operationHint() {
        return HINT.CURRENCY.WITHDRAW.OPERATION
    }
}