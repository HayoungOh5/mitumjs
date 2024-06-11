import { ContractFact, FactJson } from "../base"
import { HINT } from "../../alias"
import { Address } from "../../key"
import { CurrencyID, Hint } from "../../common"
import { DAOPolicy } from "./policy"
import { Assert, ECODE, MitumError } from "../../error"

export class UpdatePolicyFact extends ContractFact {
    readonly option: "crypto" | "biz"
    readonly policy: DAOPolicy

    constructor(
        token: string,
        sender: string | Address,
        contract: string | Address,
        option: "crypto" | "biz",
        policy: DAOPolicy,
        currency: string | CurrencyID,
    ) {
        super(HINT.DAO.UPDATE_POLICY.FACT, token, sender, contract, currency)
        this.option = option
        this.policy = policy

        this.policy.whitelist.accounts.forEach(
            account => Assert.check(
                this.contract.toString() !== account.toString(),
                MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")
            )
        )
        
        this._hash = this.hashing()
    }

    toBuffer(): Buffer {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.option),
            this.policy.toBuffer(),
            this.currency.toBuffer(),
        ])
    }

    toHintedObject(): FactJson {
        return {
            ...super.toHintedObject(),
            option: this.option,
            ...this.policy.toHintedObject(),
            _hint: new Hint(HINT.DAO.UPDATE_POLICY.FACT).toString()
        }
    }

    get operationHint() {
        return HINT.DAO.UPDATE_POLICY.OPERATION
    }
}