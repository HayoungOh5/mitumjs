import { Fact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Address } from "../../key"
import { SortFunc, hasOverlappingAddress } from "../../utils"
import { CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"

export class UpdateHandlerFact extends Fact {
    readonly sender: Address
    readonly contract: Address
    readonly handlers: Address[]
    readonly currency: CurrencyID

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        handlers: (string | Address)[],
    ) {
        super(HINT.CURRENCY.UPDATE_HANDLER.FACT, token)
        this.sender = Address.from(sender)
        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
        this.handlers = handlers.map(a => Address.from(a))
        this._hash = this.hashing()
        
        Assert.check(
            (this.handlers.length !== 0),
            MitumError.detail(ECODE.INVALID_FACT, "empty handlers"),
        )
        Assert.check(
            hasOverlappingAddress(this.handlers),
            MitumError.detail(ECODE.INVALID_FACT, "duplicate address found in handlers"),
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.handlers.sort(SortFunc).map(a => a.toBuffer())),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            handlers: this.handlers.sort(SortFunc).map((w) => w.toString()),
        }
    }

    get operationHint() {
        return HINT.CURRENCY.UPDATE_HANDLER.OPERATION
    }
}