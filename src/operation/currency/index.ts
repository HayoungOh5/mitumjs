import { CreateAccountItem, CreateAccountFact } from "./create-account"
import { UpdateKeyFact } from "./update-key"
import { TransferItem, TransferFact } from "./transfer"
import { CreateContractAccountItem, CreateContractAccountFact } from "./create-contract-account"
import { WithdrawItem, WithdrawFact } from "./withdraw"
import { UpdateOperatorFact } from "./update-operator"
import { RegisterCurrencyFact } from "./register-currency"
import { UpdateCurrencyFact } from "./update-currency"
import { MintItem, MintFact } from "./mint"

import { CurrencyDesign, CurrencyPolicy, NilFeeer, FixedFeeer, RatioFeeer } from "./currency-design"

import { Operation } from "../base"
import { Operation as OP } from "../"

import api, { getAPIData } from "../../api"
import { Amount, CurrencyID } from "../../common"
import { Big, Generator, IP, TimeStamp } from "../../types"
import { Address, Key, KeyPair, Keys, PubKey, Account as AccountType, KeyG, EtherKeys } from "../../key"
import { StringAssert, Assert, ECODE, MitumError } from "../../error"
import { isSuccessResponse  } from "../../utils"
import { Config } from "../../node"
import { SUFFIX } from "../../alias"

type currencyPolicyData = {
    currency: string | CurrencyID
    genesisAddress: string | Address
    totalSupply: string | number | Big
    minBalance: string | number | Big
    feeType: "nil" | "fixed" | "ratio"
    feeReceiver: string | Address
    fee?: string | number | Big
    ratio?: number
    minFee?: string | number | Big
    maxFee?: string | number | Big
}

type keysType =
    ({ key: string | Key | PubKey, weight: string | number | Big } | PubKey)[]
    | Array<{ key: string | Key | PubKey; weight: string | number | Big }>

export class Currency extends Generator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate a `register-currency` operation for registering a new currency.
     * **Signature of nodes** is required, not a general account signature.
     * @param {currencyPolicyData} [data] - The currency policy data.
     * @returns `register-currency` operation.
     */
    registerCurrency(data: currencyPolicyData) {
        const keysToCheck: (keyof currencyPolicyData)[] = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`))
        });

        const amount = new Amount(data.currency, data.totalSupply)
        const design = new CurrencyDesign(
            amount,
            data.genesisAddress,
            this.buildPolicy(
                data.feeType,
                data.minBalance,
                data.feeReceiver,
                data.fee,
                data.ratio,
                data.minFee,
                data.maxFee,
            ),
        )

        return new Operation(
            this.networkID,
            new RegisterCurrencyFact(TimeStamp.new().UTC(), design),
        ) 
    }
    
    /**
     * Generate an `update-currency` operation for updating an existing Mitum currency.
     * **Signature of nodes** is required, not a general account signature.
     * @param {currencyPolicyData} [data] - The currency policy data.
     * @returns `update-currency` operation.
     */
    updateCurrency(data: currencyPolicyData) {
        const keysToCheck: (keyof currencyPolicyData)[] = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, 
            MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`))
        });

        return new Operation(
            this.networkID,
            new UpdateCurrencyFact(
                TimeStamp.new().UTC(),
                data.currency,
                this.buildPolicy(
                    data.feeType,
                    data.minBalance,
                    data.feeReceiver,
                    data.fee,
                    data.ratio,
                    data.minFee,
                    data.maxFee,
                ),
            ),
        )
    }

    private buildPolicy(
        feeType: "nil" | "fixed" | "ratio",
        minBalance: string | number | Big,
        receiver: string | Address,
        fee?: string | number | Big,
        ratio?: number,
        min?: string | number | Big,
        max?: string | number | Big,
    ): CurrencyPolicy {
        switch (feeType) {
            case "nil":
                return new CurrencyPolicy(minBalance, new NilFeeer())
            case "fixed":
                Assert.check(
                    fee !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee")
                )
                return new CurrencyPolicy(minBalance, new FixedFeeer(receiver, fee!))
            case "ratio":
                Assert.check(
                    ratio !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no ratio")
                )
                Assert.check(
                    min !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no min fee")
                )
                Assert.check(
                    max !== undefined,
                    MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no max fee")
                )
                return new CurrencyPolicy(
                    minBalance,
                    new RatioFeeer(receiver, ratio!, min!, max!),
                )
            default:
                throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "invalid fee type")
        }
    }

    /**
     * Generate a `transfer` operation for transferring currency between accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer` operation.
     */
    transfer(
        sender: string | Address,
        receiver: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new TransferItem(receiver, [new Amount(currency, amount)])
                ],
            ),
        )
    }

    /**
     * Generate a `transfer` operation for transferring currency to multiple accounts at once.
     * The length of receivers and amounts must be the same.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | Address[]} [receivers] - An array of addresses of receivers.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string[] | number[] | Big[]} [amounts] - An array of amounts to transfer.
     * @returns `transfer` operation.
     */
    batchTransfer(
        sender: string | Address,
        receivers: string[] | Address[],
        currency: string | CurrencyID,
        amounts: string[] | number[] | Big[],
    ) {
        Assert.check(
            receivers.length !== 0 && amounts.length !== 0, 
            MitumError.detail(ECODE.INVALID_LENGTH, "The array must not be empty."),
        )
        Assert.check(
            receivers.length === amounts.length, 
            MitumError.detail(ECODE.INVALID_LENGTH, "The lengths of the receivers and amounts must be the same."),
        )
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                receivers.map((receiver, idx) => new TransferItem(
                    receiver, [new Amount(currency, amounts[idx])]
                    )
                ),
            ),
        )
    }

    /**
     * Generate a `withdraw`operation for withdrawing currency from an contract account.
     * Only the owner account of the contract can execute the operation.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [target] - The target contract account's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The withdrawal amount.
     * @returns `withdraw`operation
     */
    withdraw(
        sender: string | Address,
        target: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new WithdrawFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new WithdrawItem(target, [new Amount(currency, amount)])
                ],
            ),
        )
    }

    /**
     * Generate a `mint` operation for minting currency and allocating it to a receiver.
     * **Signature of nodes** is required, not a general account signature.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {number} [amount] - The amount to mint.
     * @returns `mint` operation.
     */
    mint(
        receiver: string | Address,
        currency: string | CurrencyID,
        amount: number
    ) {
        return new Operation(
            this.networkID,
            new MintFact(
                TimeStamp.new().UTC(),
                [
                    new MintItem(receiver, new Amount(currency, amount))
                ],
            ),
        )
    }

    /**
     * Get a list of all currency in the blockchain network.
     * @async
     * @returns `data` of `SuccessResponse` is a array with currency id.
     */
    async getAllCurrencies(): Promise<any> {
        const response = await getAPIData(() => api.currency.getCurrencies(this.api, this.delegateIP), true);

        if (isSuccessResponse(response) && response.data) {
            response.data = response.data._links ?
            Object.keys(response.data._links)
                .filter(c => !(c === "self" || c === "currency:{currencyid}"))
                .map(c => c)
            : null;
        }
        return response
    }

    /**
     * Get currency information abount given currency ID.
     * @async
     * @param {string | CurrencyID} [currencyID] - The currency ID.
     * @returns `data` of `SuccessResponse` is currency information:
     * - `_hint`: Hint for currency design
     * - `amount`: [Amount]
     * - `genesis_account`: Initial account for the currency.
     * - `policy`: Currency policy information including `new_account_min_balance`, `feeer`
     * - `aggregate`: Aggregate amount of the currency.
     */
    async getCurrency(currencyID: string | CurrencyID) {
        return await getAPIData(() => api.currency.getCurrency(this.api, currencyID, this.delegateIP))
    }
}

export class Account extends KeyG {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate a key pair and the corresponding `transfer` operation to create a single-sig account.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @param {string | number | Big} [weight] - (Optional) The weight for the public key. If not provided, the default value is 100.
     * @returns An object containing the wallet(key pair) and the `transfer` operation.
     */
    createWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<TransferFact> } {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random()
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation(
                this.networkID,
                new TransferFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new TransferItem(
                            ks.address,
                            [new Amount(currency, amount)]
                        )
                    ],
                ),
            ),
        }
    }

    /**
     * Generate a Ethreum style key pair and the corresponding `transfer` operation to create a single-sig account.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @param {string | number | Big} [weight] - (Optional) The weight for the public key. If not provided, the default value is 100.
     * @returns An object containing the wallet (key pair) and the `transfer` operation.
     */
    createEtherWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<TransferFact> } {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether")
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.checksum.toString()
            },
            operation: new Operation(
                this.networkID,
                new TransferFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new TransferItem(
                            ks.checksum,
                            [new Amount(currency, amount)],
                        )
                    ],
                ),
            ),
        }
    }

    /**
     * Generate `n` number of key pairs and the corresponding `transfer` operation to create single-sig accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {number} [n] - The number of account to create.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns An object containing the wallet (key pairs) and the `transfer` operation.
     */
    createBatchWallet(
        sender: string | Address,
        n: number,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ): { wallet: AccountType[], operation: Operation<TransferFact> } {
        const keyArray = this.keys(n);
        const ksArray = keyArray.map((key) => new Keys([new PubKey(key.publickey, 100)], 100));
        const items = ksArray.map((ks) => new TransferItem(ks.address,[new Amount(currency, amount)]));
        return {
            wallet: keyArray,
            operation: new Operation(
                this.networkID,
                new TransferFact(
                    TimeStamp.new().UTC(),
                    sender,
                    items,
                ),
            ),
        }
    }

    /**
     * Generate a `transfer` operation for the given public key.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Key | PubKey} [key] - The public key or key object.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns `transfer` operation.
     */
    createAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        const ks = new Keys([new PubKey(key, 100)], 100);
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new TransferItem(
                        ks.address,
                        [new Amount(currency, amount)]
                    )
                ],
            )
        )
    }

    /**
     * Generate a `transfer` operation for the given Ethereum style public key.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Key | PubKey} [key] - The Ethereum style public key or key object.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns `transfer` operation.
     */
    createEtherAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        const ks = new EtherKeys([new PubKey(key, 100)], 100);
        return new Operation(
            this.networkID,
            new TransferFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new TransferItem(
                        ks.checksum,
                        [new Amount(currency, amount)],
                    )
                ],
            )
        )
    }

    /**
     * Generate a `create-account` operation for the multi-signature account.
     * @param {string | Address} [sender] - The sender's address.
     * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
     * @returns `create-account` operation.
     * @example
     * // Example of parameter keys
     * const pubkey01 = {
     *     key: "p8XReXNcaRkNobtBd61uxeFUeUXJ7vWJkAYk4RuqTFJ2mpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "pTmVEh4VaPPM8iLuZcPm1qJRvhJXq8QcsEX1c3xAh4cPmpu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    createMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new Keys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                    )
                ]
            ),
        )
    }

    /**
     * Generate a `create-account` operation for the multi-signature account in Ethereum style.
     * @param {string | Address} [sender] - The sender's address.
     * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
     * @returns `create-account` operation.
     * @example
     * // Example of parameter keys
     * const pubkey01 = {
     *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14epu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22epu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    createEtherMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new EtherKeys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                    )
                ]
            ),
        )
    }

    /**
     * @deprecated This function is deprecated, use updateMultiSig instead.
     */
    update(
        target: string | Address,
        newKey: string | Key | PubKey,
        currency: string | CurrencyID,
    ) {
        const suffix = target.toString().slice(-3)
        if (suffix === "mca") {
            return new Operation(
                this.networkID,
                new UpdateKeyFact(
                    TimeStamp.new().UTC(),
                    target,
                    new Keys([new PubKey(newKey, 100)], 100),
                    currency,
                ),
            )
        }
        return new Operation(
            this.networkID,
            new UpdateKeyFact(
                TimeStamp.new().UTC(),
                target,
                new EtherKeys([new PubKey(newKey, 100)], 100),
                currency,
            ),
        )
    }

    /**
     * Generate an `update-key` operation for replace the public keys involved in given address.
     * @param {string | Address} [target] - The target account's address.
     * @param {keysType} [newKeys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-key` operation.
     * @example
     * // Example of parameter keys
     * const pubkey01 = {
     *     key: "p8XReXNcaRkNobtBd61uxeFUeUXJ7vWJkAYk4RuqTFJ2mpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "pTmVEh4VaPPM8iLuZcPm1qJRvhJXq8QcsEX1c3xAh4cPmpu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    updateMultiSig(
        target: string | Address,
        newKeys: keysType,
        currency: string | CurrencyID,
        threshold: string | number | Big,
    ) {
        const suffix = target.toString().slice(-3)
        if (suffix === "mca") {
            return new Operation(
                this.networkID,
                new UpdateKeyFact(
                    TimeStamp.new().UTC(),
                    target,
                    new Keys(
                        newKeys.map(k =>
                            k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                        ),
                        threshold,
                    ),
                    currency,
                ),
            )
        } 
        return new Operation(
            this.networkID,
            new UpdateKeyFact(
                TimeStamp.new().UTC(),
                target,
                new EtherKeys(
                    newKeys.map(k =>
                        k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                    ),
                    threshold,
                ),
                currency,
            ),
        )
    }

    /**
     * Sign and send the `transfer` operation to blockchain network to create single-sig account.
     * @async
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @param {Object} [wallet] - The object with properties `wallet` and `operation`. (return value of `createWallet` or `createEtherWallet`)
     * @returns A Promise resolving to a `OperationResponse`. `.wait()` can be used like `operation.send`.
     * 
     * Properties of `OperationResponse`:
     * - response: <SuccessResponse | ErrorResponse>
     * - _api: API URL
     * - _delegateIP: IP address for delegation
     * @example
     * // Send operation and check response and receipt:
     * const wallet = mitum.account.createWallet(...);
     * const touchOperation = async () => {
     *   const data = await mitum.account.touch(privatekey, wallet);
     *   console.log(data.response);
     *   const receipt = await data.wait();
     *   console.log(receipt);
     * };
     * touchOperation();
     */
    async touch(
        privatekey: string | Key,
        wallet: { wallet: AccountType, operation: Operation<TransferFact> }
    ) {
        const op = wallet.operation;
        op.sign(privatekey);

        return await new OP(this.networkID, this.api, this.delegateIP).send(op);
    }

    /**
     * Get account information for the given address.
     * @async
     * @param {string | Address} [address] - The account address to retrieve.
     * @returns `data` of `SuccessResponse` is *null* or account information:
     * - `_hint`: Hint for the account
     * - `hash`: Hash for the account state,
     * - `address`: Address of the account,
     * - `keys`: Object for keys,
     * - `balance`: Array with balance information,
     * - `height`: Latest block height associated with the account,
     * - `contract_account_status`: Object to indicate contract account status and related details
     * 
     * **null means that the account has not yet been recorded in the block.**
     */
    async getAccountInfo(address: string | Address) {
        Address.from(address);
        const response = await getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response)) {
            response.data = response.data? response.data : null;
        }
        return response
    }

    /**
     * Get all operations corresponding the given account.
     * @async
     * @param {string | Address} [address] - The account address to retrieve.
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns The `data` of `SuccessResponse` is *null* or an array of all operations corresponding the given account:
     * - `_hint`: Indicates mitum engine version,
     * - `_embedded`:
     * - - `_hint`: Hint for the operation,
     * - - `hash`: Hash for the fact,
     * - - `operation`: Information of the operation includes `hash`, `fact`, `signs`, `_hint`,
     * - - `height`: Block height containing the operation,
     * - - `confirmed_at`: Timestamp when the block was confirmed,
     * - - `reason`: Reason for operation failure,
     * - - `in_state`: Boolean indicating whether the operation was successful or not,
     * - - `index`: Index of the operation in the block
     * - `_links`: Links to get additional information

     * **null means that the account has not yet been recorded in the block.**
     */
    async getOperations(
        address: string | Address, 
        limit?: number, offset?: [number, number], reverse?: true
    ) {
        Address.from(address);
        const response = await getAPIData(() => api.operation.getAccountOperations(this.api, address, this.delegateIP, limit, offset, reverse));
        if (isSuccessResponse(response)) {
            response.data = response.data? response.data : null;
        }
        return response
    }

    /**
     * Get the account information for the given public key. Only accounts created through `create-account` operations can be retreived.
     * @async
     * @param {string | Key | PubKey} [publickey] - The public key to retrieve.
     * @returns `data` of `SuccessResponse` is a array with account informations:
     * - `_hint`: Indicates mitum engine version,
     * - `_embedded`:
     * - - `_hint`: Hint for the account
     * - - `hash`: Hash for the account state,
     * - - `address`: Address of the account,
     * - - `keys`: Object for keys,
     * - - `height`: Latest block height associated with the account,
     * - - `contract_account_status`: Object to indicate contract account status and related details
     * - `_links`: Links to get additional information
     */
    async getByPublickey(publickey: string | Key | PubKey) {
        const s = typeof (publickey) === 'string' ? publickey : publickey.toString();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid public key"))
            .empty().not()
            .chainAnd(
                s.endsWith(SUFFIX.KEY.ETHER.PUBLIC) && Config.KEY.ETHER.PUBLIC.satisfy(s.length),
                /^[0-9a-f]+$/.test(s.substring(0, s.length - Config.SUFFIX.DEFAULT.value!)),
            )
            .excute()
        return await getAPIData(() => api.account.getAccountByPublicKey(this.api, publickey, this.delegateIP))
    }

    /**
     * Get the currency balance of account for the given address.
     * @async
     * @param {string | Address} [address] - The account address to retrieve.
     * @returns `data` of `SuccessResponse` is *null* or a array with account informations:
     *  - `amount`: String of balance amount,
     *  - `currency`: Currency ID,
     *  - `_hint`: Hint for amount,

     * **null means that the account has not yet been recorded in the block.**
     */
    async balance(address: string | Address) {
        Address.from(address);
        const response = await getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.balance ? response.data.balance : null;
        }
        return response
    }
}

export class Contract extends Generator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate a key pair and the corresponding `create-contract-account` operation.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @param {string | number | Big} [weight] - (Optional) The weight for the public key. If not provided, the default value is 100.
     * @returns An object containing the wallet(key pair) and the `create-contract-account` operation.
     */
    createWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateContractAccountFact> } {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random()
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation(
                this.networkID,
                new CreateContractAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateContractAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                        )
                    ],
                ),
            ),
        }
    }

    /**
     * Generate a Ethreum style key pair and the corresponding `create-contract-account` operation.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @param {string | number | Big} [weight] - (Optional) The weight for the public key. If not provided, the default value is 100.
     * @returns An object containing the wallet (key pair) and the `create-contract-account` operation.
     */
    createEtherWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateContractAccountFact> } {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether")
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100)

        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.checksum.toString()
            },
            operation: new Operation(
                this.networkID,
                new CreateContractAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateContractAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                        )
                    ],
                ),
            ),
        }
    }

    /**
     * Generate a `create-contract-account` operation for the given public key.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Key | PubKey} [key] - The public key or key object.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns `create-contract-account` operation.
     */
    createAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new Keys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)]
                    )
                ],
            )
        )
    }

    /**
     * Generate a `create-contract-account` operation for the given Ethereum style public key.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Key | PubKey} [key] - The Ethereum style public key or key object.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns `create-contract-account` operation.
     */
    createEtherAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new EtherKeys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                    )
                ],
            )
        )
    }

    /**
     * Generate a `create-contract-account` operation for the multi-signature account.
     * @param {string | Address} [sender] - The sender's address.
     * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
     * @returns `create-contract-account` operation.
     * @example
     * // Example of parameter keys
     * const pubkey01 = {
     *     key: "p8XReXNcaRkNobtBd61uxeFUeUXJ7vWJkAYk4RuqTFJ2mpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "pTmVEh4VaPPM8iLuZcPm1qJRvhJXq8QcsEX1c3xAh4cPmpu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    createMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new Keys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                    )
                ]
            ),
        )
    }

    /**
     * Generate a `create-contract-account` operation for the multi-signature account in Ethereum style.
     * @param {string | Address} [sender] - The sender's address.
     * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
     * @returns `create-contract-account` operation.
     * @example
     * // Example of parameter keys
     * const pubkey01 = {
     *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14epu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22epu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    createEtherMultiSig(
        sender: string | Address,
        keys: keysType,
        currency: string | CurrencyID,
        amount: string | number | Big,
        threshold: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateContractAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateContractAccountItem(
                        new EtherKeys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                    )
                ]
            ),
        )
    }

    /**
     * Get contract account information for the given address.
     * @async
     * @param {string | Address} [address] - The contract account address to retrieve.
     * @returns `data` of `SuccessResponse` is *null* or account information:
     * - `_hint`: Hint for the account
     * - `hash`: Hash for the account state,
     * - `address`: Address of the account,
     * - `keys`: Object for keys,
     * - `balance`: Array with balance information,
     * - `height`: Latest block height associated with the account,
     * - `contract_account_status`: Object to indicate contract account status and related details

     * **null means that the contract account has not yet been recorded in the block.**
     */
    async getContractInfo(address: string | Address) {
       Address.from(address);
        const response = await getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response)) {
            response.data = response.data? response.data : null;
        }
        return response
    }

    /**
     * Generate an `update-operator` operation to update operator of contract to given operators.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [contract] - The contract account address.
     * @param {string | CurrencyID} [currency] - The currency ID. 
     * @param {(string | Address)[]} [operators] - The array of addresses to be updated as operators.
     * @returns `update-operator` operation.
     */
    updateOperator(
        sender: string | Address,
        contract: string | Address,
        currency: string | CurrencyID,
        operators: (string | Address)[],
    ) {
        return new Operation(
            this.networkID,
            new UpdateOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                currency,
                operators,
            )
        );
    }

    /**
     * Sign and send the `create-contract-account` operation to blockchain network.
     * @async
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @param {Object} [wallet] - The object with properties `wallet` and `operation`. (return value of `createWallet` or `createEtherWallet`)
     * @returns A Promise resolving to a `OperationResponse`. `.wait()` can be used like `operation.send`.
     * 
     * Properties of `OperationResponse`:
     * - response: <SuccessResponse | ErrorResponse>
     * - _api: API URL
     * - _delegateIP: IP address for delegation
     * @example
     * // Send operation and check response and receipt:
     * const wallet = mitum.contract.createWallet(...);

     * const touchOperation = async () => {
     *   const data = await mitum.contract.touch(privatekey, wallet);
     *   console.log(data.response);
     *   const receipt = await data.wait();
     *   console.log(receipt);
     * };
     * touchOperation();
     */
    async touch(
        privatekey: string | Key,
        wallet: { wallet: AccountType, operation: Operation<CreateContractAccountFact> }
    ) {
        const op = wallet.operation
        op.sign(privatekey)

        return await new OP(this.networkID, this.api, this.delegateIP).send(op);
    }
}