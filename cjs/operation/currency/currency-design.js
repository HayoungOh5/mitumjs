"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatioFeeer = exports.FixedFeeer = exports.NilFeeer = exports.CurrencyPolicy = exports.CurrencyDesign = void 0;
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../key/index.js");
const index_js_3 = require("../../common/index.js");
const index_js_4 = require("../../types/index.js");
class CurrencyDesign {
    constructor(amount, genesisAccount, policy) {
        this.amount = amount;
        this.genesisAccount = index_js_2.Address.from(genesisAccount);
        this.policy = policy;
        this.aggregate = amount.big;
    }
    toBuffer() {
        return Buffer.concat([
            this.amount.toBuffer(),
            this.genesisAccount.toBuffer(),
            this.policy.toBuffer(),
            this.aggregate.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: CurrencyDesign.hint.toString(),
            amount: this.amount.toHintedObject(),
            genesis_account: this.genesisAccount.toString(),
            policy: this.policy.toHintedObject(),
            aggregate: this.aggregate.toString(),
        };
    }
}
exports.CurrencyDesign = CurrencyDesign;
CurrencyDesign.hint = new index_js_3.Hint(index_js_1.HINT.CURRENCY.DESIGN);
class CurrencyPolicy {
    constructor(newAccountMinBalance, feeer) {
        this.newAccountMinBalance = index_js_4.Big.from(newAccountMinBalance);
        this.feeer = feeer;
    }
    toBuffer() {
        return Buffer.concat([
            this.newAccountMinBalance.toBuffer(),
            this.feeer.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: CurrencyPolicy.hint.toString(),
            new_account_min_balance: this.newAccountMinBalance.toString(),
            feeer: this.feeer.toHintedObject(),
        };
    }
}
exports.CurrencyPolicy = CurrencyPolicy;
CurrencyPolicy.hint = new index_js_3.Hint(index_js_1.HINT.CURRENCY.POLICY);
class Feeer {
    constructor(hint, exchangeMinAmount) {
        this.hint = new index_js_3.Hint(hint);
        if (exchangeMinAmount) {
            this.exchangeMinAmount = exchangeMinAmount instanceof index_js_4.Big ? exchangeMinAmount : new index_js_4.Big(exchangeMinAmount);
        }
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString()
        };
    }
}
class NilFeeer extends Feeer {
    constructor() {
        super(index_js_1.HINT.CURRENCY.FEEER.NIL);
    }
    toBuffer() {
        return Buffer.from([]);
    }
}
exports.NilFeeer = NilFeeer;
class FixedFeeer extends Feeer {
    constructor(receiver, amount) {
        super(index_js_1.HINT.CURRENCY.FEEER.FIXED);
        this.receiver = index_js_2.Address.from(receiver);
        this.amount = index_js_4.Big.from(amount);
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
            this.exchangeMinAmount ? this.exchangeMinAmount.toBuffer() : Buffer.from([])
        ]);
    }
    toHintedObject() {
        const feeer = Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString() });
        if (this.exchangeMinAmount) {
            return Object.assign(Object.assign({}, feeer), { exchange_min_amount: this.exchangeMinAmount.toString() });
        }
        return feeer;
    }
}
exports.FixedFeeer = FixedFeeer;
class RatioFeeer extends Feeer {
    constructor(receiver, ratio, min, max) {
        super(index_js_1.HINT.CURRENCY.FEEER.RATIO);
        this.receiver = index_js_2.Address.from(receiver);
        this.ratio = new index_js_4.Float(ratio);
        this.min = min instanceof index_js_4.Big ? min : new index_js_4.Big(min);
        this.max = max instanceof index_js_4.Big ? max : new index_js_4.Big(max);
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            this.ratio.toBuffer(),
            this.min.toBuffer(),
            this.max.toBuffer(),
            this.exchangeMinAmount ? this.exchangeMinAmount.toBuffer() : Buffer.from([])
        ]);
    }
    toHintedObject() {
        const feeer = Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), ratio: this.ratio.n, min: this.min.toString(), max: this.max.toString() });
        if (this.exchangeMinAmount) {
            return Object.assign(Object.assign({}, feeer), { exchange_min_amount: this.exchangeMinAmount.toString() });
        }
        return feeer;
    }
}
exports.RatioFeeer = RatioFeeer;
//# sourceMappingURL=currency-design.js.map