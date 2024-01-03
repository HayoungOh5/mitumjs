"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.Account = exports.Currency = void 0;
const create_account_js_1 = require("./create-account.js");
const update_key_js_1 = require("./update-key.js");
const transfer_js_1 = require("./transfer.js");
const create_contract_account_js_1 = require("./create-contract-account.js");
const withdraw_js_1 = require("./withdraw.js");
const update_operator_js_1 = require("./update-operator.js");
const register_currency_js_1 = require("./register-currency.js");
const update_currency_js_1 = require("./update-currency.js");
const mint_js_1 = require("./mint.js");
const currency_design_js_1 = require("./currency-design.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = __importStar(require("../../api/index.js"));
const index_js_3 = require("../../common/index.js");
const index_js_4 = require("../../types/index.js");
const index_js_5 = require("../../key/index.js");
const index_js_6 = require("../../error/index.js");
class Currency extends index_js_4.Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    create(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            index_js_6.Assert.check(data[key] !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        const amount = new index_js_3.Amount(data.currency, data.totalSupply);
        const design = new currency_design_js_1.CurrencyDesign(amount, data.genesisAddress, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee));
        return new index_js_1.Operation(this.networkID, new register_currency_js_1.RegisterCurrencyFact(index_js_4.TimeStamp.new().UTC(), design));
    }
    setPolicy(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            index_js_6.Assert.check(data[key] !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        return new index_js_1.Operation(this.networkID, new update_currency_js_1.UpdateCurrencyFact(index_js_4.TimeStamp.new().UTC(), data.currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee)));
    }
    buildPolicy(feeType, minBalance, receiver, fee, ratio, min, max) {
        switch (feeType) {
            case "nil":
                return new currency_design_js_1.CurrencyPolicy(minBalance, new currency_design_js_1.NilFeeer());
            case "fixed":
                index_js_6.Assert.check(fee !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee"));
                return new currency_design_js_1.CurrencyPolicy(minBalance, new currency_design_js_1.FixedFeeer(receiver, fee));
            case "ratio":
                index_js_6.Assert.check(ratio !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no ratio"));
                index_js_6.Assert.check(min !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no min fee"));
                index_js_6.Assert.check(max !== undefined, index_js_6.MitumError.detail(index_js_6.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no max fee"));
                return new currency_design_js_1.CurrencyPolicy(minBalance, new currency_design_js_1.RatioFeeer(receiver, ratio, min, max));
            default:
                throw index_js_6.MitumError.detail(index_js_6.ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "invalid fee type");
        }
    }
    transfer(sender, receiver, currency, amount) {
        return new index_js_1.Operation(this.networkID, new transfer_js_1.TransferFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new transfer_js_1.TransferItem(receiver, [new index_js_3.Amount(currency, amount)])
        ]));
    }
    withdraw(sender, target, currency, amount) {
        return new index_js_1.Operation(this.networkID, new withdraw_js_1.WithdrawFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new withdraw_js_1.WithdrawItem(target, [new index_js_3.Amount(currency, amount)])
        ]));
    }
    mint(receiver, currency, amount) {
        return new index_js_1.Operation(this.networkID, new mint_js_1.MintFact(index_js_4.TimeStamp.new().UTC(), [
            new mint_js_1.MintItem(receiver, new index_js_3.Amount(currency, amount))
        ]));
    }
    getAllCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield (0, index_js_2.getAPIData)(() => index_js_2.default.currency.getCurrencies(this.api, this.delegateIP));
            return datas
                ? Object.keys(datas._links).filter(c => !(c === "self" || c === "currency:{currencyid}")).map(c => c)
                : null;
        });
    }
    getCurrency(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.default.currency.getCurrency(this.api, cid, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}
exports.Currency = Currency;
class Account extends index_js_5.KeyG {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? index_js_5.KeyPair.fromSeed(seed) : index_js_5.KeyPair.random();
        const ks = new index_js_5.Keys([new index_js_5.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
                new create_account_js_1.CreateAccountItem(ks, [new index_js_3.Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? index_js_5.KeyPair.fromSeed(seed, "ether") : index_js_5.KeyPair.random("ether");
        const ks = new index_js_5.EtherKeys([new index_js_5.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            },
            operation: new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
                new create_account_js_1.CreateAccountItem(ks, [new index_js_3.Amount(currency, amount)], "ether")
            ])),
        };
    }
    createBatchWallet(sender, n, currency, amount) {
        const keyArray = this.keys(n);
        const ksArray = keyArray.map((key) => new index_js_5.Keys([new index_js_5.PubKey(key.publickey, 100)], 100));
        const items = ksArray.map((ks) => new create_account_js_1.CreateAccountItem(ks, [new index_js_3.Amount(currency, amount)], "mitum"));
        return {
            wallet: keyArray,
            operation: new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, items)),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_account_js_1.CreateAccountItem(new index_js_5.Keys([new index_js_5.PubKey(key, 100)], 100), [new index_js_3.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_account_js_1.CreateAccountItem(new index_js_5.EtherKeys([new index_js_5.PubKey(key, 100)], 100), [new index_js_3.Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_account_js_1.CreateAccountItem(new index_js_5.Keys(keys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold), [new index_js_3.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new index_js_1.Operation(this.networkID, new create_account_js_1.CreateAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_account_js_1.CreateAccountItem(new index_js_5.EtherKeys(keys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold), [new index_js_3.Amount(currency, amount)], "ether")
        ]));
    }
    update(target, newKey, currency) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new index_js_1.Operation(this.networkID, new update_key_js_1.UpdateKeyFact(index_js_4.TimeStamp.new().UTC(), target, new index_js_5.Keys([new index_js_5.PubKey(newKey, 100)], 100), currency));
        }
        return new index_js_1.Operation(this.networkID, new update_key_js_1.UpdateKeyFact(index_js_4.TimeStamp.new().UTC(), target, new index_js_5.EtherKeys([new index_js_5.PubKey(newKey, 100)], 100), currency));
    }
    updateMultiSig(target, newKeys, currency, threshold) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new index_js_1.Operation(this.networkID, new update_key_js_1.UpdateKeyFact(index_js_4.TimeStamp.new().UTC(), target, new index_js_5.Keys(newKeys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold), currency));
        }
        return new index_js_1.Operation(this.networkID, new update_key_js_1.UpdateKeyFact(index_js_4.TimeStamp.new().UTC(), target, new index_js_5.EtherKeys(newKeys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold), currency));
    }
    getMultiSigAddress(keys, threshold) {
        const keysArray = new index_js_5.Keys(keys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold);
        return keysArray.address.toString(); // btc
    }
    touch(privatekey, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = wallet.operation;
            op.sign(privatekey);
            return yield (0, index_js_2.getAPIData)(() => index_js_2.default.operation.send(this.api, op.toHintedObject(), this.delegateIP));
        });
    }
    getAccountInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.default.account.getAccount(this.api, address, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getOperations(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.default.operation.getAccountOperations(this.api, address, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getByPublickey(publickey) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.default.account.getAccountByPublicKey(this.api, publickey, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    balance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.default.account.getAccount(this.api, address, this.delegateIP));
            return data ? data._embedded.balance : null;
        });
    }
}
exports.Account = Account;
class Contract extends index_js_4.Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? index_js_5.KeyPair.fromSeed(seed) : index_js_5.KeyPair.random();
        const ks = new index_js_5.Keys([new index_js_5.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new index_js_1.Operation(this.networkID, new create_contract_account_js_1.CreateContractAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
                new create_contract_account_js_1.CreateContractAccountItem(ks, [new index_js_3.Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? index_js_5.KeyPair.fromSeed(seed, "ether") : index_js_5.KeyPair.random("ether");
        const ks = new index_js_5.EtherKeys([new index_js_5.PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: new index_js_5.EtherKeys([new index_js_5.PubKey(kp.publicKey, 100)], 100).etherAddress.toString(),
            },
            operation: new index_js_1.Operation(this.networkID, new create_contract_account_js_1.CreateContractAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
                new create_contract_account_js_1.CreateContractAccountItem(ks, [new index_js_3.Amount(currency, amount)], "ether")
            ])),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new index_js_1.Operation(this.networkID, new create_contract_account_js_1.CreateContractAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_contract_account_js_1.CreateContractAccountItem(new index_js_5.Keys([new index_js_5.PubKey(key, 100)], 100), [new index_js_3.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new index_js_1.Operation(this.networkID, new create_contract_account_js_1.CreateContractAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_contract_account_js_1.CreateContractAccountItem(new index_js_5.EtherKeys([new index_js_5.PubKey(key, 100)], 100), [new index_js_3.Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new index_js_1.Operation(this.networkID, new create_contract_account_js_1.CreateContractAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_contract_account_js_1.CreateContractAccountItem(new index_js_5.Keys(keys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold), [new index_js_3.Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new index_js_1.Operation(this.networkID, new create_contract_account_js_1.CreateContractAccountFact(index_js_4.TimeStamp.new().UTC(), sender, [
            new create_contract_account_js_1.CreateContractAccountItem(new index_js_5.EtherKeys(keys.map(k => k instanceof index_js_5.PubKey ? k : new index_js_5.PubKey(k.key, k.weight)), threshold), [new index_js_3.Amount(currency, amount)], "ether")
        ]));
    }
    updateOperator(sender, contract, currency, operators) {
        return new index_js_1.Operation(this.networkID, new update_operator_js_1.UpdateOperatorFact(index_js_4.TimeStamp.new().UTC(), sender, contract, currency, operators));
    }
    touch(privatekey, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = wallet.operation;
            op.sign(privatekey);
            return yield (0, index_js_2.getAPIData)(() => index_js_2.default.operation.send(this.api, op.toHintedObject(), this.delegateIP));
        });
    }
    getContractInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.default.account.getAccount(this.api, address, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}
exports.Contract = Contract;
//# sourceMappingURL=index.js.map