"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EtherKeys = exports.Keys = exports.PubKey = exports.Key = void 0;
const bs58_1 = __importDefault(require("bs58"));
const js_sha3_1 = __importDefault(require("js-sha3"));
const address_js_1 = require("./address.js");
const index_js_1 = require("../common/index.js");
const index_js_2 = require("../node/index.js");
const index_js_3 = require("../alias/index.js");
const index_js_4 = require("../utils/index.js");
const index_js_5 = require("../error/index.js");
const index_js_6 = require("../types/index.js");
const { keccak256: keccak256js } = js_sha3_1.default;
class Key {
    constructor(s) {
        index_js_5.StringAssert.with(s, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEY, "invalid key"))
            .empty().not()
            .chainOr(s.endsWith(index_js_3.SUFFIX.KEY.MITUM.PRIVATE) && index_js_2.Config.KEY.MITUM.PRIVATE.satisfy(s.length), s.endsWith(index_js_3.SUFFIX.KEY.ETHER.PRIVATE) && index_js_2.Config.KEY.ETHER.PRIVATE.satisfy(s.length), s.endsWith(index_js_3.SUFFIX.KEY.MITUM.PUBLIC) && index_js_2.Config.KEY.MITUM.PUBLIC.satisfy(s.length), s.endsWith(index_js_3.SUFFIX.KEY.ETHER.PUBLIC) && index_js_2.Config.KEY.ETHER.PUBLIC.satisfy(s.length))
            .excute();
        this.key = s.substring(0, s.length - index_js_2.Config.SUFFIX.DEFAULT.value);
        this.suffix = s.substring(s.length - index_js_2.Config.SUFFIX.DEFAULT.value);
        this.type = s.endsWith(index_js_3.SUFFIX.KEY.ETHER.PRIVATE) || s.endsWith(index_js_3.SUFFIX.KEY.ETHER.PUBLIC) ? "ether" : "btc";
        this.isPriv = s.endsWith(index_js_3.SUFFIX.KEY.MITUM.PRIVATE) || s.endsWith(index_js_3.SUFFIX.KEY.ETHER.PRIVATE);
    }
    static from(s) {
        return s instanceof Key ? s : new Key(s);
    }
    get noSuffix() {
        return this.key;
    }
    toBuffer() {
        return Buffer.from(this.toString());
    }
    toString() {
        return this.key + this.suffix;
    }
}
exports.Key = Key;
class PubKey extends Key {
    constructor(key, weight) {
        super(typeof key === "string" ? key : key.toString());
        this.weight = index_js_6.Big.from(weight);
        index_js_5.Assert.check(index_js_2.Config.WEIGHT.satisfy(this.weight.v), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_PUBLIC_KEY, "weight out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.weight.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        return {
            _hint: PubKey.hint.toString(),
            weight: this.weight.v,
            key: this.toString(),
        };
    }
}
exports.PubKey = PubKey;
PubKey.hint = new index_js_1.Hint(index_js_3.HINT.CURRENCY.KEY);
class Keys {
    constructor(keys, threshold) {
        index_js_5.Assert.check(index_js_2.Config.KEYS_IN_ACCOUNT.satisfy(keys.length), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEYS, "keys length out of range"));
        this._keys = keys.map(k => {
            if (k instanceof PubKey) {
                return k;
            }
            const [key, weight] = k;
            return new PubKey(key instanceof Key ? key.toString() : key, weight);
        });
        this.threshold = threshold instanceof index_js_6.Big ? threshold : new index_js_6.Big(threshold);
        index_js_5.Assert.check(index_js_2.Config.THRESHOLD.satisfy(this.threshold.v), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEYS, "threshold out of range"));
        index_js_5.Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get address() {
        return new address_js_1.Address(bs58_1.default.encode((0, index_js_4.sha3)(this.toBuffer())) + index_js_3.SUFFIX.ADDRESS.MITUM);
    }
    toBuffer() {
        return Buffer.concat([
            Buffer.concat(this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        return {
            _hint: Keys.hint.toString(),
            hash: bs58_1.default.encode((0, index_js_4.sha3)(this.toBuffer())),
            keys: this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
exports.Keys = Keys;
Keys.hint = new index_js_1.Hint(index_js_3.HINT.CURRENCY.KEYS);
class EtherKeys {
    constructor(keys, threshold) {
        index_js_5.Assert.check(index_js_2.Config.KEYS_IN_ACCOUNT.satisfy(keys.length), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEYS, "keys length out of range"));
        this._keys = keys.map(k => {
            if (k instanceof PubKey) {
                return k;
            }
            const [key, weight] = k;
            return new PubKey(key instanceof Key ? key.toString() : key, weight);
        });
        this.threshold = threshold instanceof index_js_6.Big ? threshold : new index_js_6.Big(threshold);
        index_js_5.Assert.check(index_js_2.Config.THRESHOLD.satisfy(this.threshold.v), index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEYS, "threshold out of range"));
        index_js_5.Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, index_js_5.MitumError.detail(index_js_5.ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get etherAddress() {
        return new address_js_1.Address((0, index_js_4.keccak256)(this.toBuffer()).subarray(12).toString('hex') + index_js_3.SUFFIX.ADDRESS.ETHER);
    }
    toBuffer() {
        return Buffer.concat([
            Buffer.concat(this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        const eHash = keccak256js(this.toBuffer());
        return {
            _hint: EtherKeys.hint.toString(),
            hash: eHash.slice(24),
            keys: this._keys
                .sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer())))
                .map((k) => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
exports.EtherKeys = EtherKeys;
EtherKeys.hint = new index_js_1.Hint(index_js_3.HINT.CURRENCY.ETH_KEYS);
//# sourceMappingURL=pub.js.map