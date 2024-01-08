import { CurrencyItem } from "./item"
import { OperationFact } from "../base"

import { Amount } from "../../common"
import { SortFunc } from "../../utils"
import { HintedObject } from "../../types"
import { HINT, SUFFIX } from "../../alias"
import { Address, ZeroAddress } from "../../key"
import { Assert, ECODE, MitumError } from "../../error"

export class TransferItem extends CurrencyItem {
    readonly receiver: Address | ZeroAddress

    constructor(receiver: string | Address | ZeroAddress, amounts: Amount[]) {
        super(HINT.CURRENCY.TRANSFER.ITEM, amounts)

        if (typeof receiver === "string") {
            if (receiver.endsWith(SUFFIX.ADDRESS.ZERO)) {
                this.receiver = new ZeroAddress(receiver)
            } else {
                this.receiver = new Address(receiver)
            }
        } else {
            this.receiver = receiver
        } 

        if (this.receiver.type === "zero") {
            for (const am of amounts) {
                Assert.check(
                    am.currency.equal((this.receiver as ZeroAddress).currency), 
                    MitumError.detail(ECODE.INVALID_AMOUNT, "invalid amount currency for given zero address"),
                )
            }
        }
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.receiver.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
        }
    }

    toString(): string {
        return this.receiver.toString()
    }
}

export class TransferFact extends OperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[]) {
        super(HINT.CURRENCY.TRANSFER.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver found in items")
        )

        this.items.forEach(
            it => Assert.check(
                this.sender.toString() != it.receiver.toString(),
                MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with receiver address"),
            )
        )
    }

    get operationHint() {
        return HINT.CURRENCY.TRANSFER.OPERATION
    }
}