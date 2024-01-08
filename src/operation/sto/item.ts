import { Item } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { HintedObject } from "../../types"

export abstract class STOItem extends Item {
    readonly contract: Address
    readonly currency: CurrencyID

    protected constructor(
        hint: string, 
        contract: string | Address, 
        currency: string | CurrencyID,
    ) {
        super(hint)

        this.contract = Address.from(contract)
        this.currency = CurrencyID.from(currency)
    }

    toBuffer(): Buffer {
        return this.contract.toBuffer()
    }

    toHintedObject(): HintedObject {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
        }
    }

    toString(): string {
        return this.contract.toString()
    }
}