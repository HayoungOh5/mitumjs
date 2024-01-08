import { Item } from "../base"

import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { HintedObject } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export abstract class CredentialItem extends Item {
    readonly contract: Address
    readonly holder: Address
    readonly templateID: string
    readonly id: string
    readonly currency: CurrencyID

    protected constructor(
        hint: string, 
        contract: string | Address, 
        holder: string | Address,
        templateID: string, 
        id: string,
        currency: string | CurrencyID,
    ) {
        super(hint)

        this.contract = Address.from(contract)
        this.holder = Address.from(holder)
        this.templateID = templateID
        this.id = id
        this.currency = CurrencyID.from(currency)

        Assert.check(
            Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length),
            MitumError.detail(ECODE.INVALID_ITEM, "template id length out of range"),
        )

        Assert.check(
            Config.CREDENTIAL.ID.satisfy(id.length),
            MitumError.detail(ECODE.INVALID_ITEM, "credential id length out of range"),
        )

        Assert.check(
            this.contract.toString() !== this.holder.toString(),
            MitumError.detail(ECODE.INVALID_ITEM, "contract is same with holder address")
        )
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.holder.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.id),
        ])
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            holder: this.holder.toString(),
            template_id: this.templateID,
            id: this.id,
            currency: this.currency.toString(),
        }
    }

    toString(): string {
        return this.contract.toString()
    }
}