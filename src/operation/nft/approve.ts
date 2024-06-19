import { NFTItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class ApproveItem extends NFTItem {
    readonly approved: Address
    readonly nftIdx: Big

    constructor(
        contract: string | Address, 
        approved: string | Address, 
        nftIdx: string | number | Big, 
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.APPROVE.ITEM, contract, currency)

        this.approved = Address.from(approved)
        this.nftIdx = Big.from(nftIdx)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.nftIdx.toBuffer("fill"),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            nft_idx: this.nftIdx.v,
        }
    }

    toString(): string {
        return `${super.toString()}-${this.approved.toString()}`
    }
}

export class ApproveFact extends OperationFact<ApproveItem> {
    constructor(token: string, sender: string | Address, items: ApproveItem[]) {
        super(HINT.NFT.APPROVE.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approve found in items")
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
            }
        )
    }

    get operationHint() {
        return HINT.NFT.APPROVE.OPERATION
    }
}