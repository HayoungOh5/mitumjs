
import { ContractFact, FactJson } from "../base"

import { HINT } from "../../alias"
import { Config } from "../../node"
import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { Bool, ShortDate } from "../../types"
import { Assert, ECODE, MitumError } from "../../error"

export class AddTemplateFact extends ContractFact {
    readonly templateID: string
    readonly templateName: string
    readonly serviceDate: ShortDate
    readonly expirationDate: ShortDate
    readonly templateShare: Bool
    readonly multiAudit: Bool
    readonly displayName: string
    readonly subjectKey: string
    readonly description: string
    readonly creator: Address

    constructor(
        token: string, 
        sender: string | Address, 
        contract: string | Address, 
        templateID: string,
        templateName: string,
        serviceDate: string | ShortDate,
        expirationDate: string | ShortDate,
        templateShare: boolean | Bool,
        multiAudit: boolean | Bool,
        displayName: string,
        subjectKey: string,
        description: string,
        creator: string | Address,
        currency: string | CurrencyID,
    ) {
        super(HINT.CREDENTIAL.ADD_TEMPLATE.FACT, token, sender, contract, currency)
        this.templateID = templateID
        this.templateName = templateName
        this.serviceDate = ShortDate.from(serviceDate)
        this.expirationDate = ShortDate.from(expirationDate)
        this.templateShare = Bool.from(templateShare)
        this.multiAudit = Bool.from(multiAudit)
        this.displayName = displayName
        this.subjectKey = subjectKey
        this.description = description
        this.creator = Address.from(creator)

        Assert.check(
            contract.toString() !== sender.toString(),
            MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")
        )

        Assert.check(
            contract.toString() !== creator.toString(),
            MitumError.detail(ECODE.INVALID_ITEMS, "creator is same with contract address")
        )

        Assert.check(
            Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length),
            MitumError.detail(ECODE.INVALID_FACT, "template id length out of range"),
        )

        Assert.check(
            Config.CREDENTIAL.TEMPLATE_NAME.satisfy(templateName.length),
            MitumError.detail(ECODE.INVALID_FACT, "template name length out of range"),
        )

        Assert.check(
            Config.CREDENTIAL.DISPLAY_NAME.satisfy(displayName.length),
            MitumError.detail(ECODE.INVALID_FACT, "display name length out of range"),
        )

        Assert.check(
            Config.CREDENTIAL.SUBJECT_KEY.satisfy(subjectKey.length),
            MitumError.detail(ECODE.INVALID_FACT, "subject key length out of range"),
        )

        Assert.check(
            Config.CREDENTIAL.DESCRIPTION.satisfy(description.length),
            MitumError.detail(ECODE.INVALID_FACT, "description length out of range"),
        )

        Assert.check(
            Date.parse(serviceDate.toString()) <= Date.parse(expirationDate.toString()), 
            MitumError.detail(ECODE.INVALID_FACT, "expire date < service date"),
        )

        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.templateName),
            this.serviceDate.toBuffer(),
            this.expirationDate.toBuffer(),
            this.templateShare.toBuffer(),
            this.multiAudit.toBuffer(),
            Buffer.from(this.displayName),
            Buffer.from(this.subjectKey),
            Buffer.from(this.description),
            this.creator.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            template_id: this.templateID,
            template_name: this.templateName,
            service_date: this.serviceDate.toString(),
            expiration_date: this.expirationDate.toString(),
            template_share: this.templateShare.v,
            multi_audit: this.multiAudit.v,
            display_name: this.displayName,
            subject_key: this.subjectKey,
            description: this.description,
            creator: this.creator.toString(),
        }
    }

    get operationHint() {
        return HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION
    }
}