import { NFTItem } from "./item"
import { OperationFact } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Big, HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class TransferItem extends NFTItem {
    readonly receiver: Address
    readonly nft: Big

    constructor(
        contract: string | Address, 
        receiver: string | Address, 
        nft: string | number | Big, 
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.TRANSFER.ITEM, contract, currency)

        this.receiver = Address.from(receiver)
        this.nft = Big.from(nft)
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            nft: this.nft.v,
        }
    }

    toString(): string {
        return `${super.toString()}-${this.nft.toString()}`
    }
}

export class TransferFact extends OperationFact<TransferItem> {
    constructor(token: string, sender: string | Address, items: TransferItem[]) {
        super(HINT.NFT.TRANSFER.FACT, token, sender, items)

        Assert.check(
            new Set(items.map(it => it.toString())).size === items.length,
            MitumError.detail(ECODE.INVALID_ITEMS, "duplicate nft found in items")
        )

        this.items.forEach(
            it => Assert.check(
                this.sender.toString() != it.contract.toString(),
                MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"),
            )
        )
    }

    get operationHint() {
        return HINT.NFT.TRANSFER.OPERATION
    }
}