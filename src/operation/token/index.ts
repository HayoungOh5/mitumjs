import { RegisterModelFact } from "./register-model"
import { MintFact } from "./mint"
import { BurnFact } from "./burn"
import { TransferFact } from "./transfer"
import { ApproveFact } from "./approve"
import { TransferFromFact } from "./transfer-from"

import { ContractGenerator, Operation } from "../base"

import { Address } from "../../key"
import { CurrencyID } from "../../common"
import { contractApi, getAPIData } from "../../api"
import { Big, IP, LongString, TimeStamp } from "../../types"
import { calculateAllowance } from "../../utils/contractUtils"
import { isSuccessResponse } from "../../utils"

export class Token extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate a `register-model` operation to register new token model on a contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | LongString} [name] - The name of the token to register.
     * @param {string | CurrencyID} [symbol] - The symbol of the token to register.
     * @param {string | number | Big} [initialSupply] - (Optional) The initial supply of the token to register. If not provided, the default value is 0.
     * @returns `register-model` operation.
     */
    registerModel(
        contract: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        name: string | LongString,
        symbol: string | CurrencyID,
        initialSupply?: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new RegisterModelFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                currency,
                symbol,
                name,
                initialSupply ?? 0,
            )
        )
    }

    /**
     * Generate a `mint` operation for minting tokens and allocating them to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address. 
     * @param {string | number | Big} [amount] - The amount to mint.
     * @returns `mint` operation.
     */
    mint(
        contract: string | Address,
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
                contract,
                currency,
                receiver,
                amount,
            )
        )
    }

    /**
     * Generate a `burn` operation for burning tokens from sender account.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to burn.
     * @returns `burn` operation
     */
    burn(
        contract: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new BurnFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                currency,
                amount,
            )
        )
    }

    /**
     * Generate an `transfer` operation for transferring tokens from the sender to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer` operation.
     */
    transfer(
        contract: string | Address,
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
                contract,
                currency,
                receiver,
                amount,
            )
        )
    }

    /**
     * Generate a `transfer-from` operation for transferring tokens from target account to receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | Address} [target] - The target account's address.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer-from` operation.
     */
    transferFrom(
        contract: string | Address,
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
                contract,
                currency,
                receiver,
                target,
                amount,
            )
        )
    }

    /**
     * Generate an `approve` operation for approving certain amount tokens to approved account.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [approved] - The address to approve.
     * @param {string | number | Big} [amount] - The amount to approve.
     * @returns `approve` operation
     */
    approve(
        contract: string | Address,
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
                contract,
                currency,
                approved,
                amount,
            )
        )
    }

    /**
     * Get information about the specific token model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is token information:
     * - `_hint`: Hint for token design,
     * - `symbol`: Symbol of the token,
     * - `name`: Name of the token,
     * - `policy`: Token policy object including `_hint`, `total_supply`, `approve_list`
     */
    async getModelInfo(contract: string | Address) {
        Address.from(contract);
        return await getAPIData(() => contractApi.token.getModel(this.api, contract, this.delegateIP))
    }

    /**
     * Get the allowance information granted by the owner for a specific token.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [owner] - The token owner's address.
     * @param {string | Address} [approved] - Address of approved account.
     * @returns `data` of `SuccessResponse` is token allowance information:
     * - `amount`: String of allowance amount
     */
    async getAllowance(contract: string | Address, owner: string | Address, approved: string | Address) {
        Address.from(contract);
        Address.from(owner);
        Address.from(approved);
        const response = await getAPIData(() => contractApi.token.getModel(this.api, contract, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = calculateAllowance(response, owner, approved);
        }
        return response
    }

    /**
     * Get token balance for given account.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [account] - The token owner's address.
     * @returns`data` of `SuccessResponse` is token balance information:
     * - `amount`: String of amount
     */
    async getBalance(contract: string | Address, account: string | Address) {
        Address.from(contract);
        Address.from(account);
        return await getAPIData(() => contractApi.token.getTokenBalance(this.api, contract, account, this.delegateIP))
    }
}