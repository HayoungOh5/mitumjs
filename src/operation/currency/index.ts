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

import api from "../../api"
import { Amount, CurrencyID } from "../../common"
import { Assert, ECODE, MitumError } from "../../error"
import { Big, Generator, IP, TimeStamp } from "../../types"
import { Address, Key, KeyPair, Keys, PubKey, Account as AccountType, KeyG } from "../../key"

type createData = {
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
    ) {
        super(networkID, api)
    }

    create(data: createData) {
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

    setPolicy(data: createData) {
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

    async getAllCurrencies() {
        return await api.currency.getCurrencies(this.api)
    }

    async getCurrency(cid: string | CurrencyID) {
        return await api.currency.getCurrency(this.api, cid)
    }
}

export class Account extends KeyG {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

    createWallet(
        sender: string | Address,
        currency: string | CurrencyID,
        amount: string | number | Big,
        seed?: string,
        weight?: string | number | Big,
    ): { wallet: AccountType, operation: Operation<CreateAccountFact> } {
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
                new CreateAccountFact(
                    TimeStamp.new().UTC(),
                    sender,
                    [
                        new CreateAccountItem(
                            ks,
                            [new Amount(currency, amount)],
                            "btc",
                        )
                    ],
                ),
            ),
        }
    }

    create(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new Keys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "btc",
                    )
                ],
            )
        )
    }

    createEtherAccount(
        sender: string | Address,
        key: string | Key | PubKey,
        currency: string | CurrencyID,
        amount: string | number | Big,
    ) {
        return new Operation(
            this.networkID,
            new CreateAccountFact(
                TimeStamp.new().UTC(),
                sender,
                [
                    new CreateAccountItem(
                        new Keys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ],
            )
        )
    }

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
                        "btc",
                    )
                ]
            ),
        )
    }

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
                        new Keys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ]
            ),
        )
    }

    update(
        target: string | Address,
        newKey: string | Key | PubKey,
        currency: string | CurrencyID,
    ) {
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

    updateMultiSig(
        target: string | Address,
        newKeys: keysType,
        currency: string | CurrencyID,
        threshold: string | number | Big,
    ) {
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

    async touch(
        privatekey: string | Key,
        wallet: { wallet: AccountType, operation: Operation<CreateAccountFact> }
    ) {
        const op = wallet.operation
        op.sign(privatekey)

        const res = await api.operation.send(this.api, op)

        return res.data
    }

    async getAccountInfo(address: string | Address) {
        return await api.account.getAccount(this.api, address)
    }

    async getOperation(address: string | Address) {
        return await api.operation.getAccountOperations(this.api, address)
    }

    async getByPublickey(publickey: string | Key | PubKey) {
        return await api.account.getAccountByPublicKey(this.api, publickey)
    }

    async balance(address: string | Address) {
        const info = await api.account.getAccount(this.api, address)
        return info.data._embedded.balance
    }
}

export class Contract extends Generator {
    constructor(
        networkID: string,
        api?: string | IP,
    ) {
        super(networkID, api)
    }

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
                            "btc",
                        )
                    ],
                ),
            ),
        }
    }

    create(
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
                        [new Amount(currency, amount)],
                        "btc",
                    )
                ],
            )
        )
    }

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
                        new Keys([new PubKey(key, 100)], 100),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ],
            )
        )
    }

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
                        "btc",
                    )
                ]
            ),
        )
    }

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
                        new Keys(
                            keys.map(k =>
                                k instanceof PubKey ? k : new PubKey(k.key, k.weight)
                            ),
                            threshold,
                        ),
                        [new Amount(currency, amount)],
                        "ether",
                    )
                ]
            ),
        )
    }

    updateOperator(
        sender: string | Address,
        contract: string | Address,
        operators: (string | Address)[],
        currency: string | CurrencyID,
    ) {
        return new Operation(
            this.networkID,
            new UpdateOperatorFact(
                TimeStamp.new().UTC(),
                sender,
                contract,
                operators,
                currency,
            )
        );
    }

    async touch(
        privatekey: string | Key,
        wallet: { wallet: AccountType, operation: Operation<CreateContractAccountFact> }
    ) {
        const op = wallet.operation
        op.sign(privatekey)

        const res = await api.operation.send(this.api, op)

        return res.data
    }

    async getContractInfo(address: string | Address) {
        return await api.account.getAccount(this.api, address);
    }
}