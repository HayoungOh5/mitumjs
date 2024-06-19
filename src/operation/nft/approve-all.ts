import { NFTItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class ApproveAllItem extends NFTItem {
    readonly approved: Address
    readonly mode: "allow" | "cancel"

    constructor(
        contract: string | Address, 
        approved: string | Address, 
        mode: "allow" | "cancel",
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.APPROVE_ALL.ITEM, contract, currency)

        this.approved = Address.from(approved)
        this.mode = mode
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            Buffer.from(this.mode),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            mode: this.mode,
        }
    }

    toString(): string {
        return `${super.toString()}-${this.approved.toString()}`
    }
}

export class ApproveAlleFact extends OperationFact<ApproveAllItem> {
    constructor(token: string, sender: string | Address, items: ApproveAllItem[]) {
        super(HINT.NFT.APPROVE_ALL.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approved found in items")
        )

        this.items.forEach(
            it => {
                Assert.check(
                    this.sender.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
                )
                Assert.check(
                    it.approved.toString() != it.contract.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "approved is same with contract address"),
                )
                Assert.check(
                    this.sender.toString() != it.approved.toString(),
                    MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with approved address"),
                )
            }
        )
    }

    get operationHint() {
        return HINT.NFT.APPROVE_ALL.OPERATION
    }
}