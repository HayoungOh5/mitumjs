import { RegisterPointFact } from "./register-point"
import { MintFact } from "./mint"
import { BurnFact } from "./burn"
import { TransferFact } from "./transfer"
import { ApproveFact } from "./approve"
import { TransferFromFact } from "./transfer-from"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contract, getAPIData } from "../../api"
import { Big, IP, LongString, TimeStamp } from "../../types"

export class Point extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    registerPoint(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        name: string | LongString,
        symbol: string | CurrencyID,
        initialSupply?: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new RegisterPointFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                symbol,
                name,
                initialSupply ?? 0,
            )
        )
    }

    mint(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new MintFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                receiver,
                amount,
            )
        )
    }

    burn(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        target: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new BurnFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                target,
                amount,
            )
        )
    }

    transfer(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                receiver,
                amount,
            )
        )
    }

    transferFrom(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        receiver: string | Address,
        target: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new TransferFromFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                receiver,
                target,
                amount,
            )
        )
    }

    approve(
        contractAddr: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        approved: string | Address,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new ApproveFact(
                TimeStamp.new().UTC(),
                sender,
                contractAddr,
                currency,
                approved,
                amount,
            )
        )
    }

    async getPointInfo(contractAddr: string | Address) {
        const data = await getAPIData(() => contract.point.getPoint(this.api, contractAddr, this.delegateIP))
        return data ? data._embedded : null
    }

    async getAllowance(contractAddr: string | Address, owner: string | Address, spender: string | Address) {
        const data = await getAPIData(() => contract.point.getPoint(this.api, contractAddr, this.delegateIP))
        if (data) {
            const approve_list = data._embedded.policy.approve_list;
            let amount;
            for (let i=0; i < approve_list.length; i++) {
                if (approve_list[i].account === owner) {
                    const approved = approve_list[i].approved;
                    for (let j=0; j < approved.length; j++) {
                        if (approved[j].account === spender) {
                            amount = {
                                'amount' : approved[j].amount
                            };
                        }
                    }
                }
            }
            return amount
        } else {
            return null
        }
    }

    async getPointBalance(contractAddr: string | Address, owner: string | Address) {
        const data = await getAPIData(() => contract.point.getPointBalance(this.api, contractAddr, owner, this.delegateIP))
        return data ? data._embedded : null
    }
}