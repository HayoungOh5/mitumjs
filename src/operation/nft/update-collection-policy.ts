import { ContractFact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { SortFunc } from "../../utils"
import { CurrencyID } from "../../common"
import { Big, LongString } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class UpdateCollectionPolicyFact extends ContractFact {
    readonly name: LongString
    readonly royalty: Big
    readonly uri: LongString
    readonly whitelist: Address[]

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        name: string | LongString,
        royalty: string | number | Big,
        uri: string | LongString,
        whitelist: (string | Address)[] | null,
        currency: string | CurrencyID,
    ) {
        super(HINT.NFT.UPDATE_COLLECTION_POLICY.FACT, token, sender, contract, currency)
        this.name = LongString.from(name)
        this.royalty = Big.from(royalty)
        this.uri = LongString.from(uri)
        this.whitelist = whitelist ? whitelist.map(w => Address.from(w)) : []

        Assert.check(
            Config.NFT.ROYALTY.satisfy(this.royalty.v), 
            MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"),
        )

        Assert.check(
            Config.NFT.ADDRESS_IN_WHITELIST.satisfy(this.whitelist.length),
            MitumError.detail(ECODE.INVALID_FACT, "whitelist length out of range"),
        )

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.whitelist.sort(SortFunc).map(w => w.toBuffer())),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            name: this.name.toString(),
            royalty: this.royalty.v,
            uri: this.uri.toString(),
            whitelist: this.whitelist.sort(SortFunc).map(w => w.toString()),
        }
    }

    get operationHint() {
        return HINT.NFT.UPDATE_COLLECTION_POLICY.OPERATION
    }
}