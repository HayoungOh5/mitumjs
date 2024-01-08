'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Int64 = require('int64-buffer');
var bigInt = require('big-integer');
var axios = require('axios');
var base58 = require('bs58');
var jsSha3 = require('js-sha3');
var ethers = require('ethers');
var secureRandom = require('secure-random');
var eccryptoJs = require('eccrypto-js');
var hmac = require('@noble/hashes/hmac');
var sha256$1 = require('@noble/hashes/sha256');
var secp256k1 = require('@noble/secp256k1');
var crypto = require('crypto');
var elliptic = require('elliptic');
var fs = require('fs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var secp256k1__namespace = /*#__PURE__*/_interopNamespaceDefault(secp256k1);
var crypto__namespace = /*#__PURE__*/_interopNamespaceDefault(crypto);

const ECODE = {
    NO_API: "EC_NO_API",
    UNKNOWN: "EC_UNKNOWN",
    EMPTY_STRING: "EC_EMPTY_STRING",
    INVALID_DATE: "EC_INVALID_DATE",
    INVALID_IP: "EC_INVALID_IP",
    INVALID_SEED: "EC_INVALID_SEED",
    INVALID_KEY: "EC_INVALID_KEY",
    INVALID_KEYS: "EC_INVALID_KEYS",
    INVALID_KEY_PAIR: "EC_INVALID_KEY_PAIR",
    INVALID_PRIVATE_KEY: "EC_INVALID_PRIVATE_KEY",
    INVALID_PUBLIC_KEY: "EC_INVALID_PUBLIC_KEY",
    INVALID_WEIGHT: "EC_INVALID_WEIGHT",
    INVALID_THRESHOLD: "EC_INVALID_THRESHOLD",
    INVALID_ADDRESS: "EC_INVALID_ADDRESS",
    INVALID_ADDRESS_TYPE: "EC_INVALID_ADDRESS_TYPE",
    INVALID_BIG_INTEGER: "EC_INVALID_BIG_INTERGER",
    INVALID_FLOAT: "EC_INVALID_FLOAT",
    INVALID_UINT8: "EC_INVALID_UINT8",
    INVALID_HINT: "EC_INVALID_HINT",
    INVALID_TOKEN: "EC_INVALID_TOKEN",
    INVALID_CURRENCY_ID: "EC_INVALID_CURRENCY_ID",
    INVALID_CONTRACT_ID: "EC_INVALID_CONTRACT_ID",
    INVALID_NETWORK_ID: "EC_INVALID_NETWORK_ID",
    INVALID_VERSION: "EC_INVALID_VERSION",
    INVALID_ITEM: "EC_INVALID_ITEM",
    INVALID_ITEMS: "EC_INVALID_ITEMS",
    INVALID_FACTSIGN: "EC_INVALID_FACTSIGN",
    INVALID_FACTSIGNS: "EC_INVALID_FACTSIGNS",
    INVALID_SIG_TYPE: "EC_INVALID_SIG_TYPE",
    INVALID_FACT: "EC_INVALID_FACT",
    INVALID_OPERATION: "EC_INVALID_OPERATION",
    INVALID_OPERATIONS: "EC_INVALID_OPERATIONS",
    INVALID_SEAL: "EC_INVALID_SEAL",
    INVALID_AMOUNT: "EC_INVALID_AMOUNT",
    INVALID_AMOUNTS: "EC_INVALID_AMOUNTS",
    INVALID_RATIO: "EC_INVALID_RATIO",
    INVALID_DATA_STRUCTURE: "EC_INVALID_DATA_STRUCTURE",
    INVALID_CHARACTER: "EC_NVALID_CHARACTER",
    NOT_IMPLEMENTED_BUFFER: "EC_NOT_IMPLEMENTED_BUFFER",
    NOT_IMPLEMENTED_HINTED_OBJECT: "EC_NOT_IMPLEMENTED_HINTED_OBJECT",
    NOT_IMPLEMENTED_METHOD: "EC_NOT_IMPLEMENTED_METHOD",
    FAIL_FILE_CREATION: "EC_FAIL_FILE_CREATION",
    FAIL_SIGN: "EC_FAIL_SIGN",
    CURRENCY: {
        INVALID_CURRENCY_FEEER: "EC_INVALID_CURRENCY_FEEER",
        INVALID_CURRENCY_POLICY: "EC_INVALID_CURRENCY_POLICY",
        INVALID_CURRENCY_DESIGN: "EC_INVALID_CURRENCY_DESIGN",
    },
    NFT: {
        INVALID_NFT_SIGNER: "EC_INVALID_NFT_SIGNER",
        INVALID_NFT_SIGNERS: "EC_INVALID_NFT_SIGNERS",
    },
    STO: {
        INVALID_PARTITION: "EC_INVALID_PARTITION",
    },
    DAO: {
        INVALID_WHITELIST: "EC_INVALID_WHITELIST",
        UNMATCHED_SENDER: "EC_UNMATCHED_SENDER"
    }
};

class MitumError extends Error {
    constructor(code, msg) {
        super(msg);
        this.code = code;
    }
    static new() {
        return new MitumError(ECODE.UNKNOWN);
    }
    static detail(code, msg) {
        return new MitumError(code !== null && code !== void 0 ? code : ECODE.UNKNOWN, msg);
    }
}
class Assert {
    constructor(condition, error) {
        this.condition = condition;
        this.error = error;
    }
    static get(condition, error) {
        return new Assert(condition, error !== null && error !== void 0 ? error : MitumError.new());
    }
    static check(condition, error) {
        Assert.get(condition, error).excute();
    }
    not() {
        this.condition = !this.condition;
        return this;
    }
    true() {
        return this;
    }
    false() {
        return this.not();
    }
    excute() {
        if (!this.condition) {
            throw this.error;
        }
    }
}
class StringAssert {
    constructor(s, error) {
        this.s = s;
        this.error = error;
        this.condition = undefined;
    }
    static with(s, error) {
        return new StringAssert(s, error !== null && error !== void 0 ? error : MitumError.new());
    }
    union(condition) {
        if (this.condition !== undefined) {
            this.condition = this.condition && condition;
        }
        else {
            this.condition = condition;
        }
    }
    not() {
        if (this.condition !== undefined) {
            this.condition = !this.condition;
        }
        return this;
    }
    empty() {
        this.union(this.s === "");
        return this;
    }
    equal(s) {
        this.union(this.s === s);
        return this;
    }
    startsWith(...pre) {
        this.union(pre.reduce((prev, curr) => prev || this.s.startsWith(curr), false));
        return this;
    }
    endsWith(...suf) {
        this.union(suf.reduce((prev, curr) => prev || this.s.endsWith(curr), false));
        return this;
    }
    satisfyConfig(config) {
        this.union(config.satisfy(this.s.length));
        return this;
    }
    chainAnd(...conditions) {
        this.union(conditions.reduce((prev, curr) => prev && curr, true));
        return this;
    }
    chainOr(...conditions) {
        this.union(conditions.reduce((prev, curr) => prev || curr, false));
        return this;
    }
    excute() {
        if (!this.condition) {
            throw this.error;
        }
    }
}

class LongString {
    constructor(s) {
        Assert.check(s !== "", MitumError.detail(ECODE.EMPTY_STRING, "empty string"));
        this.s = s;
    }
    static from(s) {
        return s instanceof LongString ? s : new LongString(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class ShortDate extends LongString {
    constructor(s) {
        super(s);
        Assert.check(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(s), MitumError.detail(ECODE.INVALID_DATE, "invalid simple string date"));
    }
    static from(s) {
        return s instanceof ShortDate ? s : new ShortDate(s);
    }
}
class IP extends LongString {
    constructor(s) {
        super(s);
        Assert.check(/^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}(?::\d+)?$/.test(s)
            || /^(http|https):\/\/(?:[\w-]+\.)+[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/.test(s), MitumError.detail(ECODE.INVALID_IP, "invalid ip address, ip"));
    }
    static from(s) {
        return s instanceof IP ? s : new IP(s);
    }
}
class URIString {
    constructor(s, name) {
        Assert.check(/^[A-Za-z0-9$\-_.!*'()]+$/.test(s), MitumError.detail(ECODE.INVALID_CHARACTER, `${name} must not contain: space / : ? # [ ] @`));
    }
}

class Generator {
    constructor(networkID, api, delegateIP) {
        this._networkID = networkID;
        this._api = api ? IP.from(api) : undefined;
        this._delegateIP = delegateIP ? IP.from(delegateIP) : undefined;
    }
    /**
     * @deprecated use setNetworkID(networkID: string)
     */
    setChainID(networkID) {
        this.setNetworkID(networkID);
    }
    setNetworkID(networkID) {
        this._networkID = networkID;
    }
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api) {
        this.setAPI(api);
    }
    setAPI(api) {
        this._api = api ? IP.from(api) : undefined;
    }
    setDelegate(delegateIP) {
        this._delegateIP = delegateIP ? IP.from(delegateIP) : undefined;
    }
    get networkID() {
        return this._networkID;
    }
    get api() {
        return this._api ? this._api.toString() : "";
    }
    get delegateIP() {
        return this._delegateIP ? this._delegateIP.toString() : "";
    }
}

class Big {
    constructor(big) {
        switch (typeof big) {
            case "number":
            case "string":
            case "bigint":
                this.big = BigInt(big);
                break;
            case "object":
                if (big instanceof Buffer || big instanceof Uint8Array) {
                    this.big = this.bufferToBig(big);
                }
                else {
                    throw MitumError.detail(ECODE.INVALID_BIG_INTEGER, "wrong big");
                }
                break;
            default:
                throw MitumError.detail(ECODE.INVALID_BIG_INTEGER, "wrong big");
        }
    }
    static from(big) {
        return big instanceof Big ? big : new Big(big);
    }
    bufferToBig(big) {
        const res = [];
        Uint8Array.from(big).forEach((n) => {
            let s = n.toString(16);
            s.length % 2 ? res.push("0" + s) : res.push(s);
        });
        return BigInt("0x" + res.join(""));
    }
    toBuffer(option) {
        const size = this.byteLen();
        if (option === "fill") {
            Assert.check(size <= 8, MitumError.detail(ECODE.INVALID_BIG_INTEGER, "big out of range"));
            return Buffer.from(new Int64.Uint64BE(this.toString()).toBuffer());
        }
        const buf = new Uint8Array(size);
        let n = bigInt(this.big);
        for (let i = size - 1; i >= 0; i--) {
            buf[i] = n.mod(256).valueOf();
            n = n.divide(256);
        }
        return Buffer.from(buf);
    }
    byteLen() {
        const bitLen = bigInt(this.big).bitLength();
        const quotient = bigInt(bitLen).divide(8);
        if (bitLen.valueOf() - quotient.valueOf() * 8 > 0) {
            return quotient.valueOf() + 1;
        }
        return quotient.valueOf();
    }
    get v() {
        if (this.big <= BigInt(Number.MAX_SAFE_INTEGER)) {
            return parseInt(this.toString());
        }
        return -1;
    }
    toString() {
        return this.big.toString();
    }
    isZero() {
        return this.big < 1;
    }
    compare(n) {
        n = Big.from(n);
        if (this.big < n.big) {
            return -1;
        }
        else if (this.big > n.big) {
            return 1;
        }
        return 0;
    }
}
class Float {
    constructor(n) {
        this.n = n;
    }
    static from(n) {
        return n instanceof Float ? n : new Float(n);
    }
    toBuffer() {
        const b = Buffer.allocUnsafe(8);
        b.writeDoubleBE(this.n);
        return b;
    }
    toString() {
        return "" + this.n;
    }
}
class Bool {
    constructor(b) {
        this.b = b;
    }
    static from(b) {
        return b instanceof Bool ? b : new Bool(b);
    }
    toBuffer() {
        return this.b ? Buffer.from([1]) : Buffer.from([0]);
    }
    get v() {
        return this.b;
    }
}

let TimeStamp$1 = class TimeStamp {
    constructor(t) {
        if (t === undefined) {
            this.t = new Date();
        }
        else {
            this.t = new Date(t);
        }
    }
    static new() {
        return new TimeStamp();
    }
    static from(t) {
        if (!t) {
            return this.new();
        }
        return t instanceof TimeStamp ? t : new TimeStamp(t);
    }
    toBuffer() {
        return Buffer.from(this.UTC());
    }
    toString() {
        return this.ISO();
    }
    ISO() {
        return this.t.toISOString();
    }
    UTC() {
        const iso = this.t.toISOString();
        const t = iso.indexOf("T");
        let z = iso.indexOf("Z");
        let rtime;
        if (z < 0) {
            z = iso.indexOf("+");
        }
        Assert.check(0 <= z, MitumError.detail(undefined, "no 'Z' in iso"));
        let _time = iso.substring(t + 1, z);
        const dotIdx = _time.indexOf(".");
        if (dotIdx < 0) {
            rtime = _time;
        }
        else {
            const decimal = _time.substring(9, _time.length);
            const idx = decimal.lastIndexOf("0");
            if (idx < 0 || idx != decimal.length - 1) {
                rtime = _time;
            }
            else {
                let startIdx = decimal.length - 1;
                for (let i = decimal.length - 1; i > -1; i--) {
                    if (decimal[i] == "0") {
                        startIdx = i;
                    }
                    else {
                        break;
                    }
                }
                if (startIdx == 0) {
                    rtime = _time.substring(0, dotIdx);
                }
                else {
                    rtime =
                        _time.substring(0, dotIdx) +
                            "." +
                            decimal.substring(0, startIdx);
                }
            }
        }
        return iso.substring(0, t) + " " + rtime + " +0000 UTC";
    }
};
class FullTimeStamp extends TimeStamp$1 {
    constructor(s) {
        super(s);
        const dot = s.indexOf(".");
        if (dot < 0) {
            this.r = "";
        }
        else {
            this.r = s.substring(dot, s.length);
        }
    }
    static from(t) {
        return t instanceof FullTimeStamp ? t : new FullTimeStamp(t);
    }
    toBuffer(option) {
        return Buffer.from(option === "super" ? super.UTC() : this.UTC());
    }
    ISO() {
        const iso = super.ISO();
        if (this.r) {
            const idx = iso.indexOf(".");
            return iso.substring(0, idx) + this.r;
        }
        return iso;
    }
    UTC() {
        const utc = super.UTC();
        if (this.r) {
            const idx0 = utc.indexOf(".");
            const idx1 = utc.indexOf("+");
            return utc.substring(0, idx0) + this.r + " " + utc.substring(idx1);
        }
        return utc;
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const Version = (() => {
    let v = "v0.0.1";
    return {
        get: () => v,
        set: (val) => {
            v = val;
            return v;
        }
    };
})();
const NetworkID = (() => {
    let v = "mitum";
    return {
        get: () => v,
        set: (val) => {
            v = val;
            return v;
        }
    };
})();
const getRangeConfig = (min, max) => {
    return {
        value: min == (max !== null && max !== void 0 ? max : min) ? min : undefined,
        min,
        max: max !== null && max !== void 0 ? max : min,
        satisfy: (target) => min <= target && target <= (max !== null && max !== void 0 ? max : min),
    };
};
const Config = {
    SUFFIX: {
        DEFAULT: getRangeConfig(3),
        ZERO_ADDRESS: getRangeConfig(5)
    },
    CURRENCY_ID: getRangeConfig(3, 10),
    CONTRACT_ID: getRangeConfig(3, 10),
    SEED: getRangeConfig(36, Number.MAX_SAFE_INTEGER),
    THRESHOLD: getRangeConfig(1, 100),
    WEIGHT: getRangeConfig(1, 100),
    ADDRESS: {
        DEFAULT: getRangeConfig(43, 47),
        ZERO: getRangeConfig(8, 15),
        NODE: getRangeConfig(4, Number.MAX_SAFE_INTEGER),
    },
    KEYS_IN_ACCOUNT: getRangeConfig(1, 100),
    AMOUNTS_IN_ITEM: getRangeConfig(1, 10),
    ITEMS_IN_FACT: getRangeConfig(1, 100),
    OPERATIONS_IN_SEAL: getRangeConfig(1, 10),
    KEY: {
        MITUM: {
            PRIVATE: getRangeConfig(46, 48),
            PUBLIC: getRangeConfig(46, 48),
        },
        ETHER: {
            PRIVATE: getRangeConfig(67),
            PUBLIC: getRangeConfig(69),
        }
    },
    NFT: {
        ROYALTY: getRangeConfig(0, 99),
        SHARE: getRangeConfig(0, 100),
        ADDRESS_IN_WHITELIST: getRangeConfig(0, 10),
        SIGNERS_IN_SIGNERS: getRangeConfig(0, 10),
    },
    CREDENTIAL: {
        ID: getRangeConfig(1, 20),
        VALUE: getRangeConfig(1, 1024),
        TEMPLATE_ID: getRangeConfig(1, 20),
        TEMPLATE_NAME: getRangeConfig(1, 20),
        DISPLAY_NAME: getRangeConfig(1, 20),
        SUBJECT_KEY: getRangeConfig(1, 20),
        DESCRIPTION: getRangeConfig(1, 1024),
    },
    TIMESTAMP: {
        PROJECT_ID: getRangeConfig(1, 10),
        DATA: getRangeConfig(1, 1024),
    },
    STO: {
        PARTITION: getRangeConfig(3, 10),
    },
    DAO: {
        ADDRESS_IN_WHITELIST: getRangeConfig(0, 10),
        QUORUM: getRangeConfig(0, 100),
        VOTE: getRangeConfig(0, 255),
    }
};

var CURRENCY = {
    KEY: "mitum-currency-key",
    KEYS: "mitum-currency-keys",
    ETH_KEYS: "mitum-currency-eth-keys",
    AMOUNT: "mitum-currency-amount",
    DESIGN: "mitum-currency-currency-design",
    POLICY: "mitum-currency-currency-policy",
    FEEER: {
        NIL: "mitum-currency-nil-feeer",
        FIXED: "mitum-currency-fixed-feeer",
        RATIO: "mitum-currency-ratio-feeer",
    },
    CREATE_ACCOUNT: {
        ITEM: "mitum-currency-create-account-multiple-amounts",
        FACT: "mitum-currency-create-account-operation-fact",
        OPERATION: "mitum-currency-create-account-operation",
    },
    UPDATE_KEY: {
        FACT: "mitum-currency-update-key-operation-fact",
        OPERATION: "mitum-currency-update-key-operation",
    },
    TRANSFER: {
        ITEM: "mitum-currency-transfer-item-multi-amounts",
        FACT: "mitum-currency-transfer-operation-fact",
        OPERATION: "mitum-currency-transfer-operation",
    },
    REGISTER_CURRENCY: {
        FACT: "mitum-currency-register-currency-operation-fact",
        OPERATION: "mitum-currency-register-currency-operation",
    },
    UPDATE_CURRENCY: {
        FACT: "mitum-currency-update-currency-operation-fact",
        OPERATION: "mitum-currency-update-currency-operation",
    },
    MINT: {
        ITEM: "mitum-currency-mint-item",
        FACT: "mitum-currency-mint-operation-fact",
        OPERATION: "mitum-currency-mint-operation",
    },
    CREATE_CONTRACT_ACCOUNT: {
        ITEM: "mitum-currency-create-contract-account-multiple-amounts",
        FACT: "mitum-currency-create-contract-account-operation-fact",
        OPERATION: "mitum-currency-create-contract-account-operation",
    },
    WITHDRAW: {
        ITEM: "mitum-currency-contract-account-withdraw-multi-amounts",
        FACT: "mitum-currency-contract-account-withdraw-operation-fact",
        OPERATION: "mitum-currency-contract-account-withdraw-operation",
    },
    UPDATE_OPERATOR: {
        FACT: "mitum-currency-contract-account-update-operator-operation-fact",
        OPERATION: "mitum-currency-contract-account-update-operator-operation",
    }
};

var NFT$1 = {
    NFT_ID: "mitum-nft-nft-id",
    DESIGN: "mitum-nft-design",
    POLICY: "mitum-nft-collection-policy",
    SIGNER: "mitum-nft-signer",
    SIGNERS: "mitum-nft-signers",
    CREATE_COLLECTION: {
        FACT: "mitum-nft-create-collection-operation-fact",
        OPERATION: "mitum-nft-create-collection-operation",
    },
    UPDATE_COLLECTION_POLICY: {
        FACT: "mitum-nft-update-collection-policy-operation-fact",
        OPERATION: "mitum-nft-update-collection-policy-operation",
    },
    MINT: {
        FORM: "mitum-nft-mint-form",
        ITEM: "mitum-nft-mint-item",
        FACT: "mitum-nft-mint-operation-fact",
        OPERATION: "mitum-nft-mint-operation",
    },
    DELEGATE: {
        ITEM: "mitum-nft-delegate-item",
        FACT: "mitum-nft-delegate-operation-fact",
        OPERATION: "mitum-nft-delegate-operation",
    },
    APPROVE: {
        ITEM: "mitum-nft-approve-item",
        FACT: "mitum-nft-approve-operation-fact",
        OPERATION: "mitum-nft-approve-operation",
    },
    TRANSFER: {
        ITEM: "mitum-nft-transfer-item",
        FACT: "mitum-nft-transfer-operation-fact",
        OPERATION: "mitum-nft-transfer-operation",
    },
    SIGN: {
        ITEM: "mitum-nft-sign-item",
        FACT: "mitum-nft-sign-operation-fact",
        OPERATION: "mitum-nft-sign-operation",
    }
};

var CREDENTIAL = {
    CREATE_SERVICE: {
        FACT: "mitum-credential-create-service-operation-fact",
        OPERATION: "mitum-credential-create-service-operation",
    },
    ADD_TEMPLATE: {
        FACT: "mitum-credential-add-template-operation-fact",
        OPERATION: "mitum-credential-add-template-operation",
    },
    ASSIGN: {
        ITEM: "mitum-credential-assign-item",
        FACT: "mitum-credential-assign-operation-fact",
        OPERATION: "mitum-credential-assign-operation",
    },
    REVOKE: {
        ITEM: "mitum-credential-revoke-item",
        FACT: "mitum-credential-revoke-operation-fact",
        OPERATION: "mitum-credential-revoke-operation",
    },
};

var DAO$1 = {
    DESIGN: "mitum-dao-design",
    POLICY: "mitum-dao-policy",
    CALLDATA: {
        TRANSFER: "mitum-dao-transfer-calldata",
        GOVERNANCE: "mitum-dao-governance-calldata",
    },
    PROPOSAL: {
        CRYPTO: "mitum-dao-crypto-proposal",
        BIZ: "mitum-dao-biz-proposal",
    },
    WHITELIST: "mitum-dao-whitelist",
    CREATE_DAO: {
        FACT: "mitum-dao-create-dao-operation-fact",
        OPERATION: "mitum-dao-create-dao-operation",
    },
    UPDATE_POLICY: {
        FACT: "mitum-dao-update-policy-operation-fact",
        OPERATION: "mitum-dao-update-policy-operation",
    },
    PROPOSE: {
        FACT: "mitum-dao-propose-operation-fact",
        OPERATION: "mitum-dao-propose-operation",
    },
    CANCEL_PROPOSAL: {
        FACT: "mitum-dao-cancel-proposal-operation-fact",
        OPERATION: "mitum-dao-cancel-proposal-operation",
    },
    REGISTER: {
        FACT: "mitum-dao-register-operation-fact",
        OPERATION: "mitum-dao-register-operation",
    },
    PRE_SNAP: {
        FACT: "mitum-dao-pre-snap-operation-fact",
        OPERATION: "mitum-dao-pre-snap-operation",
    },
    POST_SNAP: {
        FACT: "mitum-dao-post-snap-operation-fact",
        OPERATION: "mitum-dao-post-snap-operation",
    },
    VOTE: {
        FACT: "mitum-dao-vote-operation-fact",
        OPERATION: "mitum-dao-vote-operation",
    },
    EXECUTE: {
        FACT: "mitum-dao-execute-operation-fact",
        OPERATION: "mitum-dao-execute-operation",
    }
};

var KYC$1 = {
    CREATE_SERVICE: {
        FACT: "mitum-kyc-create-service-operation-fact",
        OPERATION: "mitum-kyc-create-service-operation",
    },
    ADD_CONTROLLER: {
        ITEM: "mitum-kyc-add-controller-item",
        FACT: "mitum-kyc-add-controller-operation-fact",
        OPERATION: "mitum-kyc-add-controller-operation",
    },
    REMOVE_CONTROLLER: {
        ITEM: "mitum-kyc-remove-controller-item",
        FACT: "mitum-kyc-remove-controller-operation-fact",
        OPERATION: "mitum-kyc-remove-controller-operation",
    },
    ADD_CUSTOMER: {
        ITEM: "mitum-kyc-add-customer-item",
        FACT: "mitum-kyc-add-customer-operation-fact",
        OPERATION: "mitum-kyc-add-customer-operation",
    },
    UPDATE_CUSTOMER: {
        ITEM: "mitum-kyc-update-customers-item",
        FACT: "mitum-kyc-update-customers-operation-fact",
        OPERATION: "mitum-kyc-update-customers-operation",
    }
};

var STO$1 = {
    CREATE_SECURITY_TOKEN: {
        ITEM: "mitum-sto-create-security-token-item",
        FACT: "mitum-sto-create-security-token-operation-fact",
        OPERATION: "mitum-sto-create-security-token-operation",
    },
    ISSUE_SECURITY_TOKEN: {
        ITEM: "mitum-sto-issue-item",
        FACT: "mitum-sto-issue-operation-fact",
        OPERATION: "mitum-sto-issue-operation",
    },
    AUTHORIZE_OPERATOR: {
        ITEM: "mitum-sto-authorize-operator-item",
        FACT: "mitum-sto-authorize-operator-operation-fact",
        OPERATION: "mitum-sto-authorize-operator-operation",
    },
    REVOKE_OPERATOR: {
        ITEM: "mitum-sto-revoke-operator-item",
        FACT: "mitum-sto-revoke-operator-operation-fact",
        OPERATION: "mitum-sto-revoke-operator-operation",
    },
    SET_DOCUMENT: {
        FACT: "mitum-sto-set-document-operation-fact",
        OPERATION: "mitum-sto-set-document-operation",
    },
    TRANSFER_SECURITY_TOKEN_PARTITION: {
        ITEM: "mitum-sto-transfer-by-partition-item",
        FACT: "mitum-sto-transfer-by-partition-operation-fact",
        OPERATION: "mitum-sto-transfer-by-partition-operation",
    },
    REDEEM: {
        ITEM: "mitum-sto-redeem-item",
        FACT: "mitum-sto-redeem-operation-fact",
        OPERATION: "mitum-sto-redeem-operation",
    },
};

var TIMESTAMP = {
    CREATE_SERVICE: {
        FACT: "mitum-timestamp-create-service-operation-fact",
        OPERATION: "mitum-timestamp-create-service-operation",
    },
    APPEND: {
        FACT: "mitum-timestamp-append-operation-fact",
        OPERATION: "mitum-timestamp-append-operation",
    },
};

var TOKEN = {
    REGISTER_TOKEN: {
        FACT: "mitum-token-register-token-operation-fact",
        OPERATION: "mitum-token-register-token-operation",
    },
    MINT: {
        FACT: "mitum-token-mint-operation-fact",
        OPERATION: "mitum-token-mint-operation",
    },
    TRANSFER: {
        FACT: "mitum-token-transfer-operation-fact",
        OPERATION: "mitum-token-transfer-operation",
    },
    APPROVE: {
        FACT: "mitum-token-approve-operation-fact",
        OPERATION: "mitum-token-approve-operation",
    },
    BURN: {
        FACT: "mitum-token-burn-operation-fact",
        OPERATION: "mitum-token-burn-operation",
    },
    TRANSFER_FROM: {
        FACT: "mitum-token-transfer-from-operation-fact",
        OPERATION: "mitum-token-transfer-from-operation",
    }
};

var POINT = {
    REGISTER_POINT: {
        FACT: "mitum-point-register-point-operation-fact",
        OPERATION: "mitum-point-register-point-operation",
    },
    MINT: {
        FACT: "mitum-point-mint-operation-fact",
        OPERATION: "mitum-point-mint-operation",
    },
    TRANSFER: {
        FACT: "mitum-point-transfer-operation-fact",
        OPERATION: "mitum-point-transfer-operation",
    },
    APPROVE: {
        FACT: "mitum-point-approve-operation-fact",
        OPERATION: "mitum-point-approve-operation",
    },
    BURN: {
        FACT: "mitum-point-burn-operation-fact",
        OPERATION: "mitum-point-burn-operation",
    },
    TRANSFER_FROM: {
        FACT: "mitum-point-transfer-from-operation-fact",
        OPERATION: "mitum-point-transfer-from-operation",
    }
};

var HINT = {
    FACT_SIGN: "base-fact-sign",
    CURRENCY,
    NFT: NFT$1,
    CREDENTIAL,
    DAO: DAO$1,
    KYC: KYC$1,
    STO: STO$1,
    TIMESTAMP,
    TOKEN,
    POINT,
};

const KEY = {
    MITUM: {
        PRIVATE: "mpr",
        PUBLIC: "mpu",
    },
    ETHER: {
        PRIVATE: "epr",
        PUBLIC: "epu",
    }
};
const ADDRESS = {
    MITUM: "mca",
    ETHER: "eca",
    NODE: "sas",
    ZERO: "-Xmca",
};
var SUFFIX = {
    KEY,
    ADDRESS,
};

class Hint {
    constructor(s) {
        this.s = s;
    }
    toString() {
        return `${this.s}-${Version.get()}`;
    }
}

let Token$1 = class Token {
    constructor(s) {
        Assert.check(s !== "", MitumError.detail(ECODE.INVALID_TOKEN, "empty token"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Token ? s : new Token(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return Buffer.from(this.s, "utf8").toString("base64");
    }
};

class ID {
    constructor(s) {
        this.s = s;
    }
    equal(id) {
        return this.toString() === id.toString();
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class CurrencyID extends ID {
    constructor(s) {
        super(s);
        Assert.check(Config.CURRENCY_ID.satisfy(s.length), MitumError.detail(ECODE.INVALID_CURRENCY_ID, "currency id length out of range"));
        Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), MitumError.detail(ECODE.INVALID_CURRENCY_ID, "invalid currency id format"));
    }
    static from(s) {
        return s instanceof CurrencyID ? s : new CurrencyID(s);
    }
}

class Amount {
    constructor(currency, big) {
        this.hint = new Hint(HINT.CURRENCY.AMOUNT);
        this.currency = CurrencyID.from(currency);
        this.big = Big.from(big);
        Assert.check(0 < this.big.big, MitumError.detail(ECODE.INVALID_AMOUNT, "zero big"));
    }
    toBuffer() {
        return Buffer.concat([
            this.big.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            currency: this.currency.toString(),
            amount: this.big.toString(),
        };
    }
}

class BaseAddress {
    constructor(s, type) {
        this.s = s;
        if (type) {
            this.type = type;
        }
        else if (this.s.endsWith(SUFFIX.ADDRESS.MITUM)) {
            this.type = "mitum";
        }
        else if (this.s.endsWith(SUFFIX.ADDRESS.ETHER)) {
            this.type = "ether";
        }
        else if (this.s.endsWith(SUFFIX.ADDRESS.NODE)) {
            this.type = "node";
        }
        else if (this.s.endsWith(SUFFIX.ADDRESS.ZERO)) {
            this.type = "zero";
        }
        else {
            throw MitumError.detail(ECODE.INVALID_ADDRESS, "address type not detected");
        }
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class Address extends BaseAddress {
    constructor(s) {
        super(s);
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid address"))
            .empty().not()
            .endsWith(SUFFIX.ADDRESS.MITUM, SUFFIX.ADDRESS.ETHER)
            .satisfyConfig(Config.ADDRESS.DEFAULT)
            .excute();
    }
    static from(s) {
        return s instanceof Address ? s : new Address(s);
    }
}
class NodeAddress extends BaseAddress {
    constructor(s) {
        super(s, "node");
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid node address"))
            .empty().not()
            .endsWith(SUFFIX.ADDRESS.NODE)
            .satisfyConfig(Config.ADDRESS.NODE)
            .excute();
    }
    static from(s) {
        return s instanceof NodeAddress ? s : new NodeAddress(s);
    }
}
class ZeroAddress extends BaseAddress {
    constructor(s) {
        super(s, "zero");
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "invalid zero address"))
            .empty().not()
            .endsWith(SUFFIX.ADDRESS.ZERO)
            .satisfyConfig(Config.ADDRESS.ZERO)
            .excute();
        this.currency = new CurrencyID(s.substring(0, s.length - Config.SUFFIX.ZERO_ADDRESS.value));
    }
    static from(s) {
        return s instanceof ZeroAddress ? s : new ZeroAddress(s);
    }
}

const SortFunc = (a, b) => Buffer.compare(a.toBuffer(), b.toBuffer());

const hasOverlappingAddress = (arr) => (new Set(arr.map(a => a instanceof Address ? a.toString() : a)).size == arr.length);

const sha256 = (msg) => Buffer.from(sha256$1.sha256(msg));
const sha3 = (msg) => Buffer.from(jsSha3.sha3_256.create().update(msg).digest());
const keccak256 = (msg) => Buffer.from(jsSha3.keccak256.create().update(msg).digest());

class Key {
    constructor(s) {
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_KEY, "invalid key"))
            .empty().not()
            .chainOr(s.endsWith(SUFFIX.KEY.MITUM.PRIVATE) && Config.KEY.MITUM.PRIVATE.satisfy(s.length), s.endsWith(SUFFIX.KEY.ETHER.PRIVATE) && Config.KEY.ETHER.PRIVATE.satisfy(s.length), s.endsWith(SUFFIX.KEY.MITUM.PUBLIC) && Config.KEY.MITUM.PUBLIC.satisfy(s.length), s.endsWith(SUFFIX.KEY.ETHER.PUBLIC) && Config.KEY.ETHER.PUBLIC.satisfy(s.length))
            .excute();
        this.key = s.substring(0, s.length - Config.SUFFIX.DEFAULT.value);
        this.suffix = s.substring(s.length - Config.SUFFIX.DEFAULT.value);
        this.type = s.endsWith(SUFFIX.KEY.ETHER.PRIVATE) || s.endsWith(SUFFIX.KEY.ETHER.PUBLIC) ? "ether" : "btc";
        this.isPriv = s.endsWith(SUFFIX.KEY.MITUM.PRIVATE) || s.endsWith(SUFFIX.KEY.ETHER.PRIVATE);
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
class PubKey extends Key {
    constructor(key, weight) {
        super(typeof key === "string" ? key : key.toString());
        this.weight = Big.from(weight);
        Assert.check(Config.WEIGHT.satisfy(this.weight.v), MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "weight out of range"));
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
PubKey.hint = new Hint(HINT.CURRENCY.KEY);
class Keys {
    constructor(keys, threshold) {
        Assert.check(Config.KEYS_IN_ACCOUNT.satisfy(keys.length), MitumError.detail(ECODE.INVALID_KEYS, "keys length out of range"));
        this._keys = keys.map(k => {
            if (k instanceof PubKey) {
                return k;
            }
            const [key, weight] = k;
            return new PubKey(key instanceof Key ? key.toString() : key, weight);
        });
        this.threshold = threshold instanceof Big ? threshold : new Big(threshold);
        Assert.check(Config.THRESHOLD.satisfy(this.threshold.v), MitumError.detail(ECODE.INVALID_KEYS, "threshold out of range"));
        Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, MitumError.detail(ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get address() {
        return new Address(base58.encode(sha3(this.toBuffer())) + SUFFIX.ADDRESS.MITUM);
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
            hash: base58.encode(sha3(this.toBuffer())),
            keys: this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
Keys.hint = new Hint(HINT.CURRENCY.KEYS);
class EtherKeys {
    constructor(keys, threshold) {
        Assert.check(Config.KEYS_IN_ACCOUNT.satisfy(keys.length), MitumError.detail(ECODE.INVALID_KEYS, "keys length out of range"));
        this._keys = keys.map(k => {
            if (k instanceof PubKey) {
                return k;
            }
            const [key, weight] = k;
            return new PubKey(key instanceof Key ? key.toString() : key, weight);
        });
        this.threshold = threshold instanceof Big ? threshold : new Big(threshold);
        Assert.check(Config.THRESHOLD.satisfy(this.threshold.v), MitumError.detail(ECODE.INVALID_KEYS, "threshold out of range"));
        Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, MitumError.detail(ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get etherAddress() {
        return new Address(keccak256(this.toBuffer()).subarray(12).toString('hex') + SUFFIX.ADDRESS.ETHER);
    }
    toBuffer() {
        return Buffer.concat([
            Buffer.concat(this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        const eHash = jsSha3.keccak256(this.toBuffer());
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
EtherKeys.hint = new Hint(HINT.CURRENCY.ETH_KEYS);

const privateKeyToPublicKey = (privateKey) => {
    let privateBuf;
    if (!Buffer.isBuffer(privateKey)) {
        if (typeof privateKey !== "string") {
            throw new Error("Expected Buffer or string as argument");
        }
        privateKey =
            privateKey.slice(0, 2) === "0x" ? privateKey.slice(2) : privateKey;
        privateBuf = Buffer.from(privateKey, "hex");
    }
    else {
        privateBuf = privateKey;
    }
    return secp256k1.getPublicKey(privateBuf, false);
};
const compress = (publicKey) => {
    const xCoordinate = publicKey.slice(1, 33);
    const yCoordinate = publicKey.slice(33);
    const compressedPublicKey = Buffer.concat([
        Buffer.from([0x02 + (yCoordinate[yCoordinate.length - 1] % 2)]),
        xCoordinate,
    ]);
    return compressedPublicKey.toString("hex");
};

class BaseKeyPair {
    constructor(privateKey) {
        this.privateKey = privateKey;
        this.signer = this.getSigner();
        this.publicKey = this.getPub();
        secp256k1__namespace.utils.hmacSha256Sync = (key, ...msgs) => hmac.hmac(sha256$1.sha256, key, secp256k1__namespace.utils.concatBytes(...msgs));
        secp256k1__namespace.utils.sha256Sync = (...msgs) => sha256$1.sha256(secp256k1__namespace.utils.concatBytes(...msgs));
    }
    static random(option) {
        return this.generator.random(option);
    }
    static fromPrivateKey(key) {
        return this.generator.fromPrivateKey(key);
    }
    static fromSeed(seed, option) {
        return this.generator.fromSeed(seed, option);
    }
    btcSign(msg) {
        return Buffer.from(secp256k1__namespace.signSync(sha256(sha256(msg)), this.signer));
    }
    ethSign(msg) {
        const ec = new elliptic.ec("secp256k1");
        const key = ec.keyFromPrivate(this.privateKey.noSuffix, "hex");
        const msgHash = crypto__namespace.createHash("sha256").update(msg).digest();
        const signature = key.sign(msgHash);
        const r = Buffer.from(signature.r.toArray());
        const s = Buffer.from(signature.s.toArray());
        const sigLength = 4 + r.length + s.length;
        const sigBuffer = Buffer.alloc(sigLength);
        sigBuffer.writeUInt32LE(r.length, 0);
        sigBuffer.set(r, 4);
        sigBuffer.set(s, 4 + r.length);
        return sigBuffer;
    }
    btcVerify(sig, msg) {
        if (typeof sig === "string") {
            sig = Buffer.from(base58.decode(sig));
        }
        return secp256k1__namespace.verify(sig, sha256(sha256(msg)), secp256k1__namespace.getPublicKey(this.signer));
    }
    ethVerify(sig, msg) {
        if (typeof sig === "string") {
            sig = Buffer.from(base58.decode(sig));
        }
        const rlen = new Big(sig.subarray(0, 4).reverse());
        const r = Buffer.alloc(rlen.v);
        const rb = new Big(sig.subarray(4, 4 + rlen.v));
        rb.toBuffer().copy(r, rlen.v - rb.byteLen());
        const s = sig.subarray(4 + rlen.v);
        const slen = new Big(s.length);
        const base = Buffer.from([48, sig.length, 2]);
        const buf = Buffer.alloc(sig.length + 2);
        base.copy(buf, 0, 0, 4);
        rlen.toBuffer().copy(buf, 3);
        r.copy(buf, 4);
        Buffer.from([2]).copy(buf, 4 + rlen.v);
        slen.toBuffer().copy(buf, 5 + rlen.v);
        s.copy(buf, 6 + rlen.v);
        return secp256k1__namespace.verify(buf, sha256(msg), secp256k1__namespace.getPublicKey(this.signer, true));
    }
    static K(seed) {
        seed = Buffer.from(base58.encode(sha3(Buffer.from(seed))));
        Assert.check(40 <= seed.length, MitumError.detail(ECODE.INVALID_SEED, "seed length out of range"));
        seed = seed.subarray(0, 40);
        const N = secp256k1__namespace.CURVE.n - BigInt(1);
        let k = new Big(seed).big;
        k %= N;
        k += BigInt(1);
        return k;
    }
}
class KeyPair extends BaseKeyPair {
    constructor(privateKey) {
        super(Key.from(privateKey));
    }
    getSigner() {
        if (this.privateKey.type === "btc") {
            return Buffer.from(base58.decode(this.privateKey.noSuffix));
        }
        return Buffer.from(this.privateKey.noSuffix, "hex");
    }
    getPub() {
        if (this.privateKey.type === "btc") {
            return new Key(base58.encode(eccryptoJs.getPublicCompressed(Buffer.from(this.signer))) + SUFFIX.KEY.MITUM.PUBLIC);
        }
        const publickeyBuffer = privateKeyToPublicKey("0x" + this.privateKey.noSuffix);
        return new Key(compress(publickeyBuffer) + SUFFIX.KEY.ETHER.PUBLIC);
    }
    sign(msg) {
        if (this.privateKey.type === "btc") {
            return this.btcSign(msg);
        }
        return this.ethSign(msg);
    }
    verify(sig, msg) {
        if (this.privateKey.type === "btc") {
            return this.btcVerify(sig, msg);
        }
        return this.ethVerify(sig, msg);
    }
}
KeyPair.generator = {
    random(option) {
        option = option !== null && option !== void 0 ? option : "btc";
        if (option === "btc") {
            return new KeyPair(base58.encode(Buffer.from(secureRandom(32, { type: "Uint8Array" }))) + SUFFIX.KEY.MITUM.PRIVATE);
        }
        //return new KeyPair(ethWallet.generate().getPrivateKeyString().substring(2) + SUFFIX.KEY.ETHER.PRIVATE)
        return new KeyPair(ethers.Wallet.createRandom().privateKey.substring(2) + SUFFIX.KEY.ETHER.PRIVATE);
    },
    fromPrivateKey(key) {
        return new KeyPair(key);
    },
    fromSeed(seed, option) {
        option = option !== null && option !== void 0 ? option : "btc";
        StringAssert.with(seed, MitumError.detail(ECODE.INVALID_SEED, "seed length out of range"))
            .satisfyConfig(Config.SEED)
            .excute();
        if (option === "btc") {
            return new KeyPair(base58.encode(secp256k1__namespace.utils.hexToBytes(BaseKeyPair.K(seed).toString(16))) + SUFFIX.KEY.MITUM.PRIVATE);
        }
        return new KeyPair(BaseKeyPair.K(seed).toString(16) + SUFFIX.KEY.ETHER.PRIVATE);
    }
};

function getRandomN(n, f) {
    Assert.get(Config.KEYS_IN_ACCOUNT.satisfy(n)).excute();
    n = Math.floor(n);
    let weight = Math.floor(Config.THRESHOLD.max / n);
    if (Config.THRESHOLD.max % n) {
        weight += 1;
    }
    const ks = [];
    const kps = [];
    for (let i = 0; i < n; i++) {
        kps.push(f());
        ks.push(new PubKey(kps[i].publicKey, weight));
    }
    return {
        keys: new Keys(ks, Config.THRESHOLD.max),
        keypairs: kps,
    };
}
const randomN = (n, option) => {
    return getRandomN(n, () => KeyPair.random(option));
};

class KeyG extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    key(seed) {
        if (!seed) {
            const kp = KeyPair.random();
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            };
        }
        const kp = KeyPair.fromSeed(seed);
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.address(kp.publicKey.toString()),
        };
    }
    keys(n) {
        return randomN(n).keypairs.map((kp) => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey.toString()),
            };
        });
    }
    fromPrivateKey(key) {
        const kp = KeyPair.fromPrivateKey(key);
        if (kp.privateKey.type == "btc") {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey),
            };
        }
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        };
    }
    etherKey(seed) {
        if (!seed) {
            const kp = KeyPair.random("ether");
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            };
        }
        const kp = KeyPair.fromSeed(seed, "ether");
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.etherAddress(kp.publicKey),
        };
    }
    etherKeys(n) {
        return randomN(n, "ether").keypairs.map(kp => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            };
        });
    }
    address(key) {
        const suffix = key.toString().slice(-3);
        Assert.check(suffix === "mpu", MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new Keys([new PubKey(key, 100)], 100).address.toString();
    }
    etherAddress(key) {
        const suffix = key.toString().slice(-3);
        Assert.check(suffix === "epu", MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new EtherKeys([new PubKey(key, 100)], 100).etherAddress.toString();
    }
    addressForMultiSig(keys, threshold) {
        return new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).address.toString();
    }
    etherAddressForMultiSig(keys, threshold) {
        return new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).etherAddress.toString();
    }
}

const delegateUri$b = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getAccount(api, address, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/account/${Address.from(address).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$b(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getAccountByPublicKey(api, publicKey, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/accounts?publickey=${Key.from(publicKey).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$b(delegateIP) + encodeURIComponent(apiPath));
    });
}
var account = {
    getAccount,
    getAccountByPublicKey,
};

const delegateUri$a = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getBlocks(api, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/manifests`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$a(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBlockByHeight(api, height, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/${Big.from(height).toString()}/manifest`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$a(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBlockByHash(api, hash, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/${hash}/manifest`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$a(delegateIP) + encodeURIComponent(apiPath));
    });
}
var block = {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
};

const delegateUri$9 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getNode(api, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$9(delegateIP) + encodeURIComponent(apiPath));
    });
}
var node = {
    getNode,
};

const delegateUri$8 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getOperations(api, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/operations`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$8(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getOperation(api, hash, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/operation/${hash}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$8(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBlockOperationsByHeight(api, height, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/${Big.from(height).toString()}/operations`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$8(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBlockOperationsByHash(api, hash, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/block/${hash}/operations`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$8(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getAccountOperations(api, address, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/account/${Address.from(address).toString()}/operations`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$8(delegateIP) + encodeURIComponent(apiPath));
    });
}
function send(api, operation, delegateIP, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/builder/send`;
        return !delegateIP
            ? yield axios.post(apiPath, JSON.stringify(operation), config)
            : yield axios.post(delegateIP.toString(), Object.assign(Object.assign({}, Object(operation)), { uri: apiPath }), config);
    });
}
var api$1 = {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    getBlockOperationsByHash,
    getAccountOperations,
    send
};

const delegateUri$7 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getCurrencies(api, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/currency`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$7(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getCurrency(api, currency, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${IP.from(api).toString()}/currency/${CurrencyID.from(currency).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$7(delegateIP) + encodeURIComponent(apiPath));
    });
}
var currency$1 = {
    getCurrencies,
    getCurrency,
};

const url$6 = (api, contract) => `${IP.from(api).toString()}/nft/${Address.from(contract).toString()}`;
const delegateUri$6 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getNFT(api, contract, nftID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$6(api, contract)}/${nftID}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$6(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getNFTs(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$6(api, contract)}/nfts`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$6(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getCollection(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$6(api, contract)}/collection`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$6(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getAccountOperators(api, contract, account, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$6(api, contract)}/account/${Address.from(account).toString()}/operators`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$6(delegateIP) + encodeURIComponent(apiPath));
    });
}
var nft = {
    getNFT,
    getNFTs,
    getCollection,
    getAccountOperators,
};

const url$5 = (api, contract) => `${IP.from(api).toString()}/did/${Address.from(contract).toString()}`;
const delegateUri$5 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getIssuer(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$5(api, contract)}/service`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$5(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getCredential(api, contract, templateID, credentialID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$5(api, contract)}/template/${templateID}/credential/${credentialID}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$5(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getTemplate(api, contract, templateID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$5(api, contract)}/template/${templateID}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$5(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getCredentials(api, contract, templateID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$5(api, contract)}/template/${templateID}/credentials`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$5(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getCredentialByHolder(api, contract, holder, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$5(api, contract)}/holder/${Address.from(holder).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$5(delegateIP) + encodeURIComponent(apiPath));
    });
}
var credential = {
    getIssuer,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
};

const url$4 = (api, contract) => `${IP.from(api).toString()}/dao/${Address.from(contract).toString()}`;
const delegateUri$4 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getService$2(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$4(api, contract)}/service`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$4(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getProposal(api, contract, proposalID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$4(api, contract)}/proposal/${proposalID}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$4(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getDelegator(api, contract, proposalID, delegator, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$4(api, contract)}/proposal/${proposalID}/delegator/${Address.from(delegator).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$4(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getVoter(api, contract, proposalID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$4(api, contract)}/proposal/${proposalID}/voter`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$4(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getVotingResult(api, contract, proposalID, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$4(api, contract)}/proposal/${proposalID}/votingpower`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$4(delegateIP) + encodeURIComponent(apiPath));
    });
}
var dao = {
    getService: getService$2,
    getProposal,
    getDelegator,
    getVoter,
    getVotingResult,
};

var kyc = {};

const url$3 = (api, contract) => `${IP.from(api).toString()}/sto/${Address.from(contract).toString()}`;
const delegateUri$3 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getService$1(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$3(api, contract)}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$3(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getPartitions(api, contract, holder, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$3(api, contract)}/holder/${Address.from(holder).toString()}/partitions`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$3(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBalanceByHolder(api, contract, holder, partition, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$3(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$3(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getOperatorsByHolder(api, contract, holder, partition, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$3(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$3(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getPartitionBalance(api, contract, partition, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$3(api, contract)}/partition/${partition}/balance`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$3(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getAuthorized(api, contract, operator, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$3(api, contract)}/operator/${Address.from(operator).toString()}/holders`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$3(delegateIP) + encodeURIComponent(apiPath));
    });
}
var sto = {
    getService: getService$1,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
};

const url$2 = (api, contract) => `${IP.from(api).toString()}/timestamp/${Address.from(contract).toString()}`;
const delegateUri$2 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getService(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$2(api, contract)}/service`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$2(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getTimeStamp(api, contract, projectID, tid, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$2(api, contract)}/project/${projectID}/id/${Big.from(tid).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$2(delegateIP) + encodeURIComponent(apiPath));
    });
}
var timestamp = {
    getService,
    getTimeStamp,
};

const url$1 = (api, contract) => `${IP.from(api).toString()}/token/${Address.from(contract).toString()}`;
const delegateUri$1 = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getToken(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$1(api, contract)}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$1(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getTokenBalance(api, contract, account, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url$1(api, contract)}/account/${Address.from(account).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri$1(delegateIP) + encodeURIComponent(apiPath));
    });
}
var token = {
    getToken,
    getTokenBalance,
};

const url = (api, contract) => `${IP.from(api).toString()}/point/${Address.from(contract).toString()}`;
const delegateUri = (delegateIP) => `${IP.from(delegateIP).toString()}?uri=`;
function getPoint(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getPointBalance(api, contract, account, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}/account/${Address.from(account).toString()}`;
        return !delegateIP ? yield axios.get(apiPath) : yield axios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
var point = {
    getPoint,
    getPointBalance,
};

var models = {
    currency: currency$1,
    contract: {
        nft,
        credential,
        dao,
        kyc,
        sto,
        timestamp,
        token,
        point,
    },
};

const currency = models.currency;
const contract = models.contract;
var api = {
    account,
    block,
    node,
    operation: api$1,
    currency,
    contract,
};
function getAPIData(f) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield f();
        if (res.status !== 200) {
            return null;
        }
        return res.data;
    });
}

class Node extends Generator {
    constructor(api, delegateIP) {
        super("", api, delegateIP);
    }
    getNodeInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            Assert.check(this.api !== undefined || this.api !== null, MitumError.detail(ECODE.NO_API, "no api"));
            return yield node.getNode(this.api, this.delegateIP);
        });
    }
}
class Block extends Generator {
    constructor(api, delegate) {
        super("", api, delegate);
    }
    getAllBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            Assert.check(this.api !== undefined || this.api !== null, MitumError.detail(ECODE.NO_API, "no api"));
            return yield block.getBlocks(this.api, this.delegateIP);
        });
    }
    getBlockByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            Assert.check(this.api !== undefined || this.api !== null, MitumError.detail(ECODE.NO_API, "no api"));
            return yield block.getBlockByHash(this.api, hash, this.delegateIP);
        });
    }
    getBlockByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            Assert.check(this.api !== undefined || this.api !== null, MitumError.detail(ECODE.NO_API, "no api"));
            return yield block.getBlockByHeight(this.api, height, this.delegateIP);
        });
    }
    getOperationsByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            Assert.check(this.api !== undefined || this.api !== null, MitumError.detail(ECODE.NO_API, "no api"));
            return yield api$1.getBlockOperationsByHash(this.api, hash, this.delegateIP);
        });
    }
    getOperationsByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            Assert.check(this.api !== undefined || this.api !== null, MitumError.detail(ECODE.NO_API, "no api"));
            return yield api$1.getBlockOperationsByHeight(this.api, height, this.delegateIP);
        });
    }
}

class Item {
    constructor(hint) {
        this.hint = new Hint(hint);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString()
        };
    }
}

class FactSign {
    constructor(signer, signature, signedAt) {
        this.signature = signature;
        this.signedAt = new FullTimeStamp(signedAt);
        this.signer = Key.from(signer);
        Assert.get(this.signer.isPriv, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "not public key")).not().excute();
    }
    toBuffer() {
        return Buffer.concat([
            this.signer.toBuffer(),
            this.signature,
            this.signedAt.toBuffer("super")
        ]);
    }
    toHintedObject() {
        return {
            signer: this.signer.toString(),
            signature: base58.encode(this.signature),
            signed_at: this.signedAt.ISO(),
        };
    }
}
class GeneralFactSign extends FactSign {
    constructor(signer, signature, signedAt) {
        super(signer, signature, signedAt);
    }
    toHintedObject() {
        return super.toHintedObject();
    }
}
class NodeFactSign extends FactSign {
    constructor(node, signer, signature, signedAt) {
        super(signer, signature, signedAt);
        this.node = NodeAddress.from(node);
    }
    toBuffer() {
        return Buffer.concat([
            this.node.toBuffer(),
            super.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { node: this.node.toString() });
    }
}

let Operation$1 = class Operation {
    constructor(networkID, fact, memo) {
        this.id = networkID;
        this.memo = memo !== null && memo !== void 0 ? memo : "";
        this.fact = fact;
        this.hint = new Hint(fact.operationHint);
        this._factSigns = [];
        this._hash = Buffer.from([]);
    }
    setFactSigns(factSigns) {
        if (!factSigns) {
            return;
        }
        Assert.check(new Set(factSigns.map(fs => fs.signer.toString())).size === factSigns.length, MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        this._factSigns = factSigns;
        this._hash = this.hashing();
    }
    get factSigns() {
        return this._factSigns;
    }
    get hash() {
        return this._hash;
    }
    get factSignType() {
        return this.getSigType();
    }
    getSigType(factSigns) {
        if (!factSigns) {
            factSigns = this._factSigns;
        }
        if (factSigns.length === 0) {
            return null;
        }
        const set = new Set(factSigns.map(fs => Object.getPrototypeOf(fs).constructor.name));
        Assert.check(set.size === 1, MitumError.detail(ECODE.INVALID_FACTSIGNS, "multiple sig-type in operation"));
        return Array.from(set)[0];
    }
    hashing(force) {
        let b = sha3(this.toBuffer());
        if (force && force === "force") {
            this._hash = b;
        }
        return b;
    }
    sign(privateKey, option) {
        var _a;
        privateKey = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey(privateKey);
        const sigType = this.factSignType;
        if (sigType === "NodeFactSign") {
            Assert.check(option !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address in sign option"));
        }
        const factSign = this.signWithSigType(sigType, keypair, option ? new NodeAddress((_a = option.node) !== null && _a !== void 0 ? _a : "") : undefined);
        const idx = this._factSigns
            .map((fs) => fs.signer.toString())
            .indexOf(keypair.publicKey.toString());
        if (idx < 0) {
            this._factSigns.push(factSign);
        }
        else {
            this._factSigns[idx] = factSign;
        }
        this._hash = this.hashing();
    }
    signWithSigType(sigType, keypair, node) {
        const getFactSign = (keypair, hash) => {
            const now = TimeStamp$1.new();
            return new GeneralFactSign(keypair.publicKey, keypair.sign(Buffer.concat([Buffer.from(this.id), hash, now.toBuffer()])), now.toString());
        };
        const getNodeFactSign = (node, keypair, hash) => {
            const now = TimeStamp$1.new();
            return new NodeFactSign(node.toString(), keypair.publicKey, keypair.sign(Buffer.concat([
                Buffer.from(this.id),
                node.toBuffer(),
                hash,
                now.toBuffer(),
            ])), now.toString());
        };
        const hash = this.fact.hash;
        if (sigType) {
            if (sigType == "NodeFactSign") {
                Assert.check(node !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address"));
                return getNodeFactSign(node, keypair, hash);
            }
            return getFactSign(keypair, hash);
        }
        else {
            if (node) {
                return getNodeFactSign(node, keypair, hash);
            }
            return getFactSign(keypair, hash);
        }
    }
    toBuffer() {
        if (!this._factSigns) {
            return this.fact.hash;
        }
        this._factSigns = this._factSigns.sort(SortFunc);
        return Buffer.concat([
            this.fact.hash,
            Buffer.concat(this._factSigns.map((fs) => fs.toBuffer())),
        ]);
    }
    toHintedObject() {
        const op = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        };
        const operation = this.memo ? op : Object.assign(Object.assign({}, op), { memo: this.memo });
        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(SortFunc);
        return Object.assign(Object.assign({}, operation), { signs: factSigns.map(fs => fs.toHintedObject()) });
    }
    export(filePath) {
        fs.writeFile(filePath, JSON.stringify(this.toHintedObject(), null, 4), (e) => {
            if (e) {
                throw MitumError.detail(ECODE.FAIL_FILE_CREATION, "fs write-file failed");
            }
        });
    }
};

// import { Address } from "../../key"
class ContractGenerator extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
}

class Fact {
    constructor(hint, token) {
        this.hint = new Hint(hint);
        this.token = new Token$1(token);
        this._hash = Buffer.from([]);
    }
    get hash() {
        return this._hash;
    }
    hashing() {
        return sha3(this.toBuffer());
    }
    toBuffer() {
        return this.token.toBuffer();
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            hash: base58.encode(this.hash ? this.hash : []),
            token: this.token.toString()
        };
    }
}
class OperationFact extends Fact {
    constructor(hint, token, sender, items) {
        super(hint, token);
        this.sender = Address.from(sender);
        Assert.check(Config.ITEMS_IN_FACT.satisfy(items.length));
        Assert.check(new Set(items.map(i => i.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate items found"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            Buffer.concat(this.items.sort(SortFunc).map((i) => i.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), items: this.items.sort(SortFunc).map(i => i.toHintedObject()) });
    }
}
class ContractFact extends Fact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token);
        this.sender = Address.from(sender);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        Assert.check(this.sender.toString() !== this.contract.toString(), MitumError.detail(ECODE.INVALID_FACT, "sender is same with contract address"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), contract: this.contract.toString(), currency: this.currency.toString() });
    }
}
class NodeFact extends Fact {
    constructor(hint, token) {
        super(hint, token);
    }
}

class CurrencyItem extends Item {
    constructor(hint, amounts, addressType) {
        super(hint);
        Assert.check(Config.AMOUNTS_IN_ITEM.satisfy(amounts.length), MitumError.detail(ECODE.INVALID_AMOUNTS, "amounts length out of range"));
        Assert.check(new Set(amounts.map(am => am.currency.toString())).size === amounts.length, MitumError.detail(ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts"));
        this.amounts = amounts;
        this.addressType = addressType !== null && addressType !== void 0 ? addressType : "";
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { amounts: this.amounts.sort(SortFunc).map(am => am.toHintedObject()) });
    }
}

class CreateAccountItem extends CurrencyItem {
    constructor(keys, amounts, addressType) {
        super(HINT.CURRENCY.CREATE_ACCOUNT.ITEM, amounts, addressType);
        this.keys = keys;
        if (addressType === "mitum") {
            this.addressSuffix = SUFFIX.ADDRESS.MITUM;
        }
        else {
            this.addressSuffix = SUFFIX.ADDRESS.ETHER;
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.from(this.addressSuffix),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { keys: this.keys.toHintedObject(), addrtype: this.addressSuffix });
    }
    toString() {
        return base58.encode(this.keys.toBuffer());
    }
}
class CreateAccountFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CURRENCY.CREATE_ACCOUNT.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate key hash found in items"));
    }
    get operationHint() {
        return HINT.CURRENCY.CREATE_ACCOUNT.OPERATION;
    }
}

class UpdateKeyFact extends Fact {
    constructor(token, target, keys, currency) {
        super(HINT.CURRENCY.UPDATE_KEY.FACT, token);
        this.target = Address.from(target);
        this.keys = keys;
        this.currency = CurrencyID.from(currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.keys.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString(), keys: this.keys.toHintedObject(), currency: this.currency.toString() });
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_KEY.OPERATION;
    }
}

let TransferItem$1 = class TransferItem extends CurrencyItem {
    constructor(receiver, amounts) {
        super(HINT.CURRENCY.TRANSFER.ITEM, amounts);
        if (typeof receiver === "string") {
            if (receiver.endsWith(SUFFIX.ADDRESS.ZERO)) {
                this.receiver = new ZeroAddress(receiver);
            }
            else {
                this.receiver = new Address(receiver);
            }
        }
        else {
            this.receiver = receiver;
        }
        if (this.receiver.type === "zero") {
            for (const am of amounts) {
                Assert.check(am.currency.equal(this.receiver.currency), MitumError.detail(ECODE.INVALID_AMOUNT, "invalid amount currency for given zero address"));
            }
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString() });
    }
    toString() {
        return this.receiver.toString();
    }
};
let TransferFact$3 = class TransferFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CURRENCY.TRANSFER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.receiver.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with receiver address")));
    }
    get operationHint() {
        return HINT.CURRENCY.TRANSFER.OPERATION;
    }
};

class CreateContractAccountItem extends CurrencyItem {
    constructor(keys, amounts, addressType) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.ITEM, amounts, addressType);
        this.keys = keys;
        if (addressType === "mitum") {
            this.addressSuffix = SUFFIX.ADDRESS.MITUM;
        }
        else {
            this.addressSuffix = SUFFIX.ADDRESS.ETHER;
        }
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.from(this.addressSuffix),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { keys: this.keys.toHintedObject(), addrtype: this.addressSuffix });
    }
    toString() {
        return base58.encode(this.keys.toBuffer());
    }
}
class CreateContractAccountFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate key hash found in items"));
    }
    get operationHint() {
        return HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.OPERATION;
    }
}

class WithdrawItem extends CurrencyItem {
    constructor(target, amounts) {
        super(HINT.CURRENCY.WITHDRAW.ITEM, amounts);
        this.target = typeof target === "string" ? new Address(target) : target;
    }
    toBuffer() {
        return Buffer.concat([
            this.target.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString() });
    }
    toString() {
        return this.target.toString();
    }
}
class WithdrawFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CURRENCY.WITHDRAW.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate target found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.target.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with target address")));
    }
    get operationHint() {
        return HINT.CURRENCY.WITHDRAW.OPERATION;
    }
}

class UpdateOperatorFact extends Fact {
    constructor(token, sender, contract, currency, operators) {
        super(HINT.CURRENCY.UPDATE_OPERATOR.FACT, token);
        this.sender = Address.from(sender);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.operators = operators.map(a => Address.from(a));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.operators.sort(SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), contract: this.contract.toString(), currency: this.currency.toString(), operators: this.operators.sort(SortFunc).map((w) => w.toString()) });
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_OPERATOR.OPERATION;
    }
}

class RegisterCurrencyFact extends NodeFact {
    constructor(token, design) {
        super(HINT.CURRENCY.REGISTER_CURRENCY.FACT, token);
        this.design = design;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            this.token.toBuffer(),
            this.design.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.design.toHintedObject() });
    }
    get operationHint() {
        return HINT.CURRENCY.REGISTER_CURRENCY.OPERATION;
    }
}

class UpdateCurrencyFact extends NodeFact {
    constructor(token, currency, policy) {
        super(HINT.CURRENCY.UPDATE_CURRENCY.FACT, token);
        this.currency = CurrencyID.from(currency);
        this.policy = policy;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { currency: this.currency.toString(), policy: this.policy.toHintedObject() });
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_CURRENCY.OPERATION;
    }
}

let MintItem$1 = class MintItem extends Item {
    constructor(receiver, amount) {
        super(HINT.CURRENCY.MINT.ITEM);
        this.amount = amount;
        this.receiver = Address.from(receiver);
    }
    toBuffer() {
        return Buffer.concat([
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toHintedObject() });
    }
    toString() {
        return `${this.receiver.toString()}-${this.amount.currency.toString()}`;
    }
};
let MintFact$3 = class MintFact extends NodeFact {
    constructor(token, items) {
        super(HINT.CURRENCY.MINT.FACT, token);
        Assert.check(Config.ITEMS_IN_FACT.satisfy(items.length), MitumError.detail(ECODE.INVALID_ITEMS, "items length out of range"));
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver-currency found in items"));
        this.items = items;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.concat(this.items.sort(SortFunc).map(it => it.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { items: this.items.sort(SortFunc).map(it => it.toHintedObject()) });
    }
    get operationHint() {
        return HINT.CURRENCY.MINT.OPERATION;
    }
};

class CurrencyDesign {
    constructor(amount, genesisAccount, policy) {
        this.amount = amount;
        this.genesisAccount = Address.from(genesisAccount);
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
CurrencyDesign.hint = new Hint(HINT.CURRENCY.DESIGN);
class CurrencyPolicy {
    constructor(newAccountMinBalance, feeer) {
        this.newAccountMinBalance = Big.from(newAccountMinBalance);
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
CurrencyPolicy.hint = new Hint(HINT.CURRENCY.POLICY);
class Feeer {
    constructor(hint, exchangeMinAmount) {
        this.hint = new Hint(hint);
        if (exchangeMinAmount) {
            this.exchangeMinAmount = exchangeMinAmount instanceof Big ? exchangeMinAmount : new Big(exchangeMinAmount);
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
        super(HINT.CURRENCY.FEEER.NIL);
    }
    toBuffer() {
        return Buffer.from([]);
    }
}
class FixedFeeer extends Feeer {
    constructor(receiver, amount) {
        super(HINT.CURRENCY.FEEER.FIXED);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
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
class RatioFeeer extends Feeer {
    constructor(receiver, ratio, min, max) {
        super(HINT.CURRENCY.FEEER.RATIO);
        this.receiver = Address.from(receiver);
        this.ratio = new Float(ratio);
        this.min = min instanceof Big ? min : new Big(min);
        this.max = max instanceof Big ? max : new Big(max);
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

class Currency extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    create(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        const amount = new Amount(data.currency, data.totalSupply);
        const design = new CurrencyDesign(amount, data.genesisAddress, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee));
        return new Operation$1(this.networkID, new RegisterCurrencyFact(TimeStamp$1.new().UTC(), design));
    }
    setPolicy(data) {
        const keysToCheck = ['currency', 'genesisAddress', 'totalSupply', 'minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createData structure`));
        });
        return new Operation$1(this.networkID, new UpdateCurrencyFact(TimeStamp$1.new().UTC(), data.currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee)));
    }
    buildPolicy(feeType, minBalance, receiver, fee, ratio, min, max) {
        switch (feeType) {
            case "nil":
                return new CurrencyPolicy(minBalance, new NilFeeer());
            case "fixed":
                Assert.check(fee !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee"));
                return new CurrencyPolicy(minBalance, new FixedFeeer(receiver, fee));
            case "ratio":
                Assert.check(ratio !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no ratio"));
                Assert.check(min !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no min fee"));
                Assert.check(max !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no max fee"));
                return new CurrencyPolicy(minBalance, new RatioFeeer(receiver, ratio, min, max));
            default:
                throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "invalid fee type");
        }
    }
    transfer(sender, receiver, currency, amount) {
        return new Operation$1(this.networkID, new TransferFact$3(TimeStamp$1.new().UTC(), sender, [
            new TransferItem$1(receiver, [new Amount(currency, amount)])
        ]));
    }
    withdraw(sender, target, currency, amount) {
        return new Operation$1(this.networkID, new WithdrawFact(TimeStamp$1.new().UTC(), sender, [
            new WithdrawItem(target, [new Amount(currency, amount)])
        ]));
    }
    mint(receiver, currency, amount) {
        return new Operation$1(this.networkID, new MintFact$3(TimeStamp$1.new().UTC(), [
            new MintItem$1(receiver, new Amount(currency, amount))
        ]));
    }
    getAllCurrencies() {
        return __awaiter(this, void 0, void 0, function* () {
            const datas = yield getAPIData(() => api.currency.getCurrencies(this.api, this.delegateIP));
            return datas
                ? Object.keys(datas._links).filter(c => !(c === "self" || c === "currency:{currencyid}")).map(c => c)
                : null;
        });
    }
    getCurrency(cid) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => api.currency.getCurrency(this.api, cid, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}
class Account extends KeyG {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random();
        const ks = new Keys([new PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
                new CreateAccountItem(ks, [new Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether");
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.etherAddress(kp.publicKey),
            },
            operation: new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
                new CreateAccountItem(ks, [new Amount(currency, amount)], "ether")
            ])),
        };
    }
    createBatchWallet(sender, n, currency, amount) {
        const keyArray = this.keys(n);
        const ksArray = keyArray.map((key) => new Keys([new PubKey(key.publickey, 100)], 100));
        const items = ksArray.map((ks) => new CreateAccountItem(ks, [new Amount(currency, amount)], "mitum"));
        return {
            wallet: keyArray,
            operation: new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, items)),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateAccountItem(new Keys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateAccountItem(new EtherKeys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation$1(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateAccountItem(new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "ether")
        ]));
    }
    update(target, newKey, currency) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new Operation$1(this.networkID, new UpdateKeyFact(TimeStamp$1.new().UTC(), target, new Keys([new PubKey(newKey, 100)], 100), currency));
        }
        return new Operation$1(this.networkID, new UpdateKeyFact(TimeStamp$1.new().UTC(), target, new EtherKeys([new PubKey(newKey, 100)], 100), currency));
    }
    updateMultiSig(target, newKeys, currency, threshold) {
        const suffix = target.toString().slice(-3);
        if (suffix === "mca") {
            return new Operation$1(this.networkID, new UpdateKeyFact(TimeStamp$1.new().UTC(), target, new Keys(newKeys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), currency));
        }
        return new Operation$1(this.networkID, new UpdateKeyFact(TimeStamp$1.new().UTC(), target, new EtherKeys(newKeys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), currency));
    }
    getMultiSigAddress(keys, threshold) {
        const keysArray = new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold);
        return keysArray.address.toString(); // btc
    }
    touch(privatekey, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = wallet.operation;
            op.sign(privatekey);
            return yield getAPIData(() => api.operation.send(this.api, op.toHintedObject(), this.delegateIP));
        });
    }
    getAccountInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getOperations(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => api.operation.getAccountOperations(this.api, address, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getByPublickey(publickey) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => api.account.getAccountByPublicKey(this.api, publickey, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    balance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
            return data ? data._embedded.balance : null;
        });
    }
}
class Contract extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed) : KeyPair.random();
        const ks = new Keys([new PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.address.toString(),
            },
            operation: new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)], "mitum")
            ])),
        };
    }
    createEtherWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed, "ether") : KeyPair.random("ether");
        const ks = new EtherKeys([new PubKey(kp.publicKey, weight !== null && weight !== void 0 ? weight : 100)], weight !== null && weight !== void 0 ? weight : 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: new EtherKeys([new PubKey(kp.publicKey, 100)], 100).etherAddress.toString(),
            },
            operation: new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)], "ether")
            ])),
        };
    }
    createAccount(sender, key, currency, amount) {
        return new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherAccount(sender, key, currency, amount) {
        return new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateContractAccountItem(new EtherKeys([new PubKey(key, 100)], 100), [new Amount(currency, amount)], "ether")
        ]));
    }
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "mitum")
        ]));
    }
    createEtherMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateContractAccountItem(new EtherKeys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)], "ether")
        ]));
    }
    updateOperator(sender, contract, currency, operators) {
        return new Operation$1(this.networkID, new UpdateOperatorFact(TimeStamp$1.new().UTC(), sender, contract, currency, operators));
    }
    touch(privatekey, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = wallet.operation;
            op.sign(privatekey);
            return yield getAPIData(() => api.operation.send(this.api, op.toHintedObject(), this.delegateIP));
        });
    }
    getContractInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}

class CreateCollectionFact extends ContractFact {
    constructor(token, sender, contract, name, royalty, uri, whitelist, currency) {
        super(HINT.NFT.CREATE_COLLECTION.FACT, token, sender, contract, currency);
        this.name = LongString.from(name);
        this.royalty = Big.from(royalty);
        this.uri = LongString.from(uri);
        this.whitelist = whitelist ? whitelist.map(w => Address.from(w)) : [];
        Assert.check(Config.NFT.ROYALTY.satisfy(this.royalty.v), MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"));
        Assert.check(Config.NFT.ADDRESS_IN_WHITELIST.satisfy(this.whitelist.length), MitumError.detail(ECODE.INVALID_FACT, "whitelist length out of range"));
        Assert.check(hasOverlappingAddress(this.whitelist), MitumError.detail(ECODE.INVALID_FACT, "duplicate address found in whitelist"));
        this.whitelist.forEach(a => Assert.check(this.contract.toString() !== a.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.whitelist.sort(SortFunc).map(w => w.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { name: this.name.toString(), royalty: this.royalty.v, uri: this.uri.toString(), whitelist: this.whitelist.sort(SortFunc).map(w => w.toString()) });
    }
    get operationHint() {
        return HINT.NFT.CREATE_COLLECTION.OPERATION;
    }
}

class UpdateCollectionPolicyFact extends ContractFact {
    constructor(token, sender, contract, name, royalty, uri, whitelist, currency) {
        super(HINT.NFT.UPDATE_COLLECTION_POLICY.FACT, token, sender, contract, currency);
        this.name = LongString.from(name);
        this.royalty = Big.from(royalty);
        this.uri = LongString.from(uri);
        this.whitelist = whitelist ? whitelist.map(w => Address.from(w)) : [];
        Assert.check(Config.NFT.ROYALTY.satisfy(this.royalty.v), MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"));
        Assert.check(Config.NFT.ADDRESS_IN_WHITELIST.satisfy(this.whitelist.length), MitumError.detail(ECODE.INVALID_FACT, "whitelist length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.name.toBuffer(),
            this.royalty.toBuffer("fill"),
            this.uri.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.whitelist.sort(SortFunc).map(w => w.toBuffer())),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { name: this.name.toString(), royalty: this.royalty.v, uri: this.uri.toString(), whitelist: this.whitelist.sort(SortFunc).map(w => w.toString()) });
    }
    get operationHint() {
        return HINT.NFT.UPDATE_COLLECTION_POLICY.OPERATION;
    }
}

class NFTItem extends Item {
    constructor(hint, contract, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
    }
    toBuffer() {
        return this.contract.toBuffer();
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}

class MintItem extends NFTItem {
    constructor(contract, receiver, hash, uri, creators, currency) {
        super(HINT.NFT.MINT.ITEM, contract, currency);
        this.receiver = Address.from(receiver);
        this.hash = LongString.from(hash);
        this.uri = LongString.from(uri);
        this.creators = creators;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.hash.toBuffer(),
            this.uri.toBuffer(),
            this.creators.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), hash: this.hash.toString(), uri: this.uri.toString(), creators: this.creators.toHintedObject() });
    }
}
let MintFact$2 = class MintFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.MINT.FACT, token, sender, items);
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.MINT.OPERATION;
    }
};

class ApproveItem extends NFTItem {
    constructor(contract, approved, nftIDX, currency) {
        super(HINT.NFT.APPROVE.ITEM, contract, currency);
        this.approved = Address.from(approved);
        this.nftIDX = Big.from(nftIDX);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.nftIDX.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), nftidx: this.nftIDX.v });
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
}
let ApproveFact$2 = class ApproveFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.APPROVE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approve found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.APPROVE.OPERATION;
    }
};

class DelegateItem extends NFTItem {
    constructor(contract, operator, mode, currency) {
        super(HINT.NFT.DELEGATE.ITEM, contract, currency);
        this.operator = Address.from(operator);
        this.mode = mode;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            Buffer.from(this.mode),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { delegatee: this.operator.toString(), mode: this.mode });
    }
    toString() {
        return `${super.toString()}-${this.operator.toString()}`;
    }
}
class DelegateFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.DELEGATE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate operator found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.DELEGATE.OPERATION;
    }
}

class TransferItem extends NFTItem {
    constructor(contract, receiver, nft, currency) {
        super(HINT.NFT.TRANSFER.ITEM, contract, currency);
        this.receiver = Address.from(receiver);
        this.nft = Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), nft: this.nft.v });
    }
    toString() {
        return `${super.toString()}-${this.nft.toString()}`;
    }
}
let TransferFact$2 = class TransferFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.TRANSFER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate nft found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.TRANSFER.OPERATION;
    }
};

class SignItem extends NFTItem {
    constructor(contract, nft, currency) {
        super(HINT.NFT.SIGN.ITEM, contract, currency);
        this.nft = Big.from(nft);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.nft.toBuffer("fill"),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { nft: this.nft.v });
    }
}
class SignFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.NFT.SIGN.FACT, token, sender, items);
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.SIGN.OPERATION;
    }
}

let Signer$1 = class Signer {
    constructor(account, share, signed) {
        this.hint = new Hint(HINT.NFT.SIGNER);
        this.account = Address.from(account);
        this.share = Big.from(share);
        this.signed = Bool.from(signed);
        Assert.check(Config.NFT.SHARE.satisfy(this.share.v), MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNER, "share out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.account.toBuffer(),
            this.share.toBuffer("fill"),
            this.signed.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            account: this.account.toString(),
            share: this.share.v,
            signed: this.signed.v,
        };
    }
};
class Signers {
    constructor(total, signers) {
        this.hint = new Hint(HINT.NFT.SIGNERS);
        this.total = Big.from(total);
        this.signers = signers;
        Assert.check(Config.NFT.SIGNERS_IN_SIGNERS.satisfy(this.signers.length), MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNERS, "signers length out of range"));
    }
    toBuffer() {
        return Buffer.concat([
            this.total.toBuffer("fill"),
            Buffer.concat(this.signers.sort(SortFunc).map(s => s.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            total: this.total.v,
            signers: this.signers.sort(SortFunc).map(s => s.toHintedObject()),
        };
    }
}

class NFT extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createCollection(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new Operation$1(this.networkID, new CreateCollectionFact(TimeStamp$1.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    setPolicy(contractAddr, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'whitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new Operation$1(this.networkID, new UpdateCollectionPolicyFact(TimeStamp$1.new().UTC(), sender, contractAddr, data.name, data.royalty, data.uri, data.whitelist, currency));
    }
    mint(contractAddr, sender, receiver, uri, hash, currency, creator) {
        return new Operation$1(this.networkID, new MintFact$2(TimeStamp$1.new().UTC(), sender, [new MintItem(contractAddr, receiver, hash, uri, new Signers(100, [new Signer$1(creator, 100, false)]), currency)]));
    }
    mintForMultiCreators(contractAddr, sender, receiver, uri, hash, currency, creators) {
        const keysToCheck = ['account', 'share'];
        keysToCheck.forEach((key) => {
            creators.forEach((creator) => {
                Assert.check(creator[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the Creator structure`));
            });
        });
        return new Operation$1(this.networkID, new MintFact$2(TimeStamp$1.new().UTC(), sender, [
            new MintItem(contractAddr, receiver, hash, uri, new Signers(creators.reduce((prev, next) => prev + Big.from(next.share).v, 0), creators.map(a => new Signer$1(a.account, a.share, false))), currency)
        ]));
    }
    transfer(contractAddr, sender, receiver, nftID, currency) {
        const fact = new TransferFact$2(TimeStamp$1.new().UTC(), sender, [
            new TransferItem(contractAddr, receiver, nftID, currency)
        ]);
        return new Operation$1(this.networkID, fact);
    }
    approve(contractAddr, owner, operator, nftID, currency) {
        return new Operation$1(this.networkID, new ApproveFact$2(TimeStamp$1.new().UTC(), owner, [
            new ApproveItem(contractAddr, operator, nftID, currency)
        ]));
    }
    setApprovalForAll(contractAddr, owner, operator, mode, currency) {
        return new Operation$1(this.networkID, new DelegateFact(TimeStamp$1.new().UTC(), owner, [
            new DelegateItem(contractAddr, operator, mode, currency)
        ]));
    }
    signNFT(contractAddr, creator, nftID, currency) {
        return new Operation$1(this.networkID, new SignFact(TimeStamp$1.new().UTC(), creator, [
            new SignItem(contractAddr, nftID, currency)
        ]));
    }
    getCollectionInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.nft.getCollection(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    /**
     * @deprecated use getCollectionInfo()
     */
    getCollectionPolicy(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const design = yield this.getCollectionInfo(contractAddr);
            return design ? design.policy : null;
        });
    }
    ownerOf(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
            return data ? data._embedded.owner : null;
        });
    }
    getApproved(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
            return data ? data._embedded.approved : null;
        });
    }
    totalSupply(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.nft.getNFTs(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded.length : null;
        });
    }
    tokenURI(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
            return data ? data._embedded.uri : null;
        });
    }
    isApprovedForAll(contractAddr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.nft.getAccountOperators(this.api, contractAddr, owner, this.delegateIP));
        });
    }
    getNFTInfo(contractAddr, nftID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.nft.getNFT(this.api, contractAddr, nftID, this.delegateIP));
        });
    }
    getNFTs(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.nft.getNFTs(this.api, contractAddr, this.delegateIP));
        });
    }
}

let CreateServiceFact$2 = class CreateServiceFact extends ContractFact {
    constructor(token, sender, contract, currency) {
        super(HINT.CREDENTIAL.CREATE_SERVICE.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.CREDENTIAL.CREATE_SERVICE.OPERATION;
    }
};

class AddTemplateFact extends ContractFact {
    constructor(token, sender, contract, templateID, templateName, serviceDate, expirationDate, templateShare, multiAudit, displayName, subjectKey, description, creator, currency) {
        super(HINT.CREDENTIAL.ADD_TEMPLATE.FACT, token, sender, contract, currency);
        this.templateID = templateID;
        this.templateName = templateName;
        this.serviceDate = ShortDate.from(serviceDate);
        this.expirationDate = ShortDate.from(expirationDate);
        this.templateShare = Bool.from(templateShare);
        this.multiAudit = Bool.from(multiAudit);
        this.displayName = displayName;
        this.subjectKey = subjectKey;
        this.description = description;
        this.creator = Address.from(creator);
        Assert.check(Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), MitumError.detail(ECODE.INVALID_FACT, "template id length out of range"));
        Assert.check(Config.CREDENTIAL.TEMPLATE_NAME.satisfy(templateName.length), MitumError.detail(ECODE.INVALID_FACT, "template name length out of range"));
        Assert.check(Config.CREDENTIAL.DISPLAY_NAME.satisfy(displayName.length), MitumError.detail(ECODE.INVALID_FACT, "display name length out of range"));
        Assert.check(Config.CREDENTIAL.SUBJECT_KEY.satisfy(subjectKey.length), MitumError.detail(ECODE.INVALID_FACT, "subject key length out of range"));
        Assert.check(Config.CREDENTIAL.DESCRIPTION.satisfy(description.length), MitumError.detail(ECODE.INVALID_FACT, "description length out of range"));
        Assert.check(Date.parse(serviceDate.toString()) <= Date.parse(expirationDate.toString()), MitumError.detail(ECODE.INVALID_FACT, "expire date < service date"));
        this._hash = this.hashing();
    }
    toBuffer() {
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
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { template_id: this.templateID, template_name: this.templateName, service_date: this.serviceDate.toString(), expiration_date: this.expirationDate.toString(), template_share: this.templateShare.v, multi_audit: this.multiAudit.v, display_name: this.displayName, subject_key: this.subjectKey, description: this.description, creator: this.creator.toString() });
    }
    get operationHint() {
        return HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION;
    }
}

class CredentialItem extends Item {
    constructor(hint, contract, holder, templateID, id, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.holder = Address.from(holder);
        this.templateID = templateID;
        this.id = id;
        this.currency = CurrencyID.from(currency);
        Assert.check(Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), MitumError.detail(ECODE.INVALID_ITEM, "template id length out of range"));
        Assert.check(Config.CREDENTIAL.ID.satisfy(id.length), MitumError.detail(ECODE.INVALID_ITEM, "credential id length out of range"));
        Assert.check(this.contract.toString() !== this.holder.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with holder address"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.holder.toBuffer(),
            Buffer.from(this.templateID),
            Buffer.from(this.id),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), holder: this.holder.toString(), template_id: this.templateID, id: this.id, currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}

class AssignItem extends CredentialItem {
    constructor(contract, holder, templateID, id, value, validFrom, validUntil, did, currency) {
        super(HINT.CREDENTIAL.ASSIGN.ITEM, contract, holder, templateID, id, currency);
        this.value = value;
        this.validFrom = Big.from(validFrom);
        this.validUntil = Big.from(validUntil);
        this.did = did;
        Assert.check(Config.CREDENTIAL.VALUE.satisfy(value.length), MitumError.detail(ECODE.INVALID_ITEM, "credential value length out of range"));
        Assert.check(validFrom < validUntil, MitumError.detail(ECODE.INVALID_ITEM, "valid until <= valid from"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.value),
            this.validFrom.toBuffer("fill"),
            this.validUntil.toBuffer("fill"),
            Buffer.from(this.did),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { value: this.value, valid_from: this.validFrom.v, valid_until: this.validUntil.v, did: this.did });
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
class AssignFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CREDENTIAL.ASSIGN.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return HINT.CREDENTIAL.ASSIGN.OPERATION;
    }
}

class RevokeItem extends CredentialItem {
    constructor(contract, holder, templateID, id, currency) {
        super(HINT.CREDENTIAL.REVOKE.ITEM, contract, holder, templateID, id, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toString() {
        return `${super.toString()}-${this.id}`;
    }
}
class RevokeFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CREDENTIAL.REVOKE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate credential id found in items"));
    }
    get operationHint() {
        return HINT.CREDENTIAL.REVOKE.OPERATION;
    }
}

class Credential extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, currency) {
        return new Operation$1(this.networkID, new CreateServiceFact$2(TimeStamp$1.new().UTC(), sender, contractAddr, currency));
    }
    addTemplate(contractAddr, sender, data, currency) {
        const keysToCheck = ['templateID', 'templateName', 'serviceDate', 'expirationDate', 'templateShare', 'multiAudit', 'displayName', 'subjectKey', 'description', 'creator'];
        keysToCheck.forEach((key) => {
            const s = data[key];
            Assert.check(s !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the templateData structure`));
            s === 'templateID' ? new URIString(s, 'templateID') : null;
        });
        return new Operation$1(this.networkID, new AddTemplateFact(TimeStamp$1.new().UTC(), sender, contractAddr, data.templateID, data.templateName, data.serviceDate, data.expirationDate, data.templateShare, data.multiAudit, data.displayName, data.subjectKey, data.description, data.creator, currency));
    }
    issue(contractAddr, sender, data, currency) {
        const keysToCheck = ['holder', 'templateID', 'id', 'value', 'validFrom', 'validUntil', 'did'];
        keysToCheck.forEach((key) => {
            const s = data[key];
            Assert.check(s !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the templateData structure`));
            s === 'id' ? new URIString(s, 'id') : null;
        });
        return new Operation$1(this.networkID, new AssignFact(TimeStamp$1.new().UTC(), sender, [
            new AssignItem(contractAddr, data.holder, data.templateID, data.id, data.value, data.validFrom, data.validUntil, data.did, currency)
        ]));
    }
    revoke(contractAddr, sender, holder, templateID, id, currency) {
        return new Operation$1(this.networkID, new RevokeFact(TimeStamp$1.new().UTC(), sender, [
            new RevokeItem(contractAddr, holder, templateID, id, currency)
        ]));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.credential.getIssuer(this.api, contractAddr, this.delegateIP));
        });
    }
    getCredentialInfo(contractAddr, templateID, credentialID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.credential.getCredential(this.api, contractAddr, templateID, credentialID, this.delegateIP));
        });
    }
    getTemplate(contractAddr, templateID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.credential.getTemplate(this.api, contractAddr, templateID, this.delegateIP));
        });
    }
    getAllCredentials(contractAddr, templateID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.credential.getCredentials(this.api, contractAddr, templateID, this.delegateIP));
        });
    }
    claimCredential(contractAddr, holder) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.credential.getCredentialByHolder(this.api, contractAddr, holder, this.delegateIP));
        });
    }
}

class CreateDAOFact extends ContractFact {
    constructor(token, sender, contract, option, votingPowerToken, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum, currency) {
        super(HINT.DAO.CREATE_DAO.FACT, token, sender, contract, currency);
        this.option = option;
        this.votingPowerToken = CurrencyID.from(votingPowerToken);
        this.threshold = Big.from(threshold);
        this.fee = fee;
        this.whitelist = whitelist;
        this.proposalReviewPeriod = Big.from(proposalReviewPeriod);
        this.registrationPeriod = Big.from(registrationPeriod);
        this.preSnapshotPeriod = Big.from(preSnapshotPeriod);
        this.votingPeriod = Big.from(votingPeriod);
        this.postSnapshotPeriod = Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = Big.from(executionDelayPeriod);
        this.turnout = Big.from(turnout);
        this.quorum = Big.from(quorum);
        Assert.check(Config.DAO.QUORUM.satisfy(this.turnout.v), MitumError.detail(ECODE.INVALID_FACT, "turnout out of range"));
        Assert.check(Config.DAO.QUORUM.satisfy(this.quorum.v), MitumError.detail(ECODE.INVALID_FACT, "quorum out of range"));
        this.whitelist.accounts.forEach(a => Assert.check(this.contract.toString() !== a.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.option),
            this.votingPowerToken.toBuffer(),
            this.threshold.toBuffer(),
            this.fee.toBuffer(),
            this.whitelist.toBuffer(),
            this.proposalReviewPeriod.toBuffer("fill"),
            this.registrationPeriod.toBuffer("fill"),
            this.preSnapshotPeriod.toBuffer("fill"),
            this.votingPeriod.toBuffer("fill"),
            this.postSnapshotPeriod.toBuffer("fill"),
            this.executionDelayPeriod.toBuffer("fill"),
            this.turnout.toBuffer(),
            this.quorum.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { option: this.option, voting_power_token: this.votingPowerToken.toString(), threshold: this.threshold.toString(), fee: this.fee.toHintedObject(), whitelist: this.whitelist.toHintedObject(), proposal_review_period: this.proposalReviewPeriod.v, registration_period: this.registrationPeriod.v, pre_snapshot_period: this.preSnapshotPeriod.v, voting_period: this.votingPeriod.v, post_snapshot_period: this.postSnapshotPeriod.v, execution_delay_period: this.executionDelayPeriod.v, turnout: this.turnout.v, quorum: this.quorum.v });
    }
    get operationHint() {
        return HINT.DAO.CREATE_DAO.OPERATION;
    }
}

class DAOFact extends ContractFact {
    constructor(hint, token, sender, contract, proposalID, currency) {
        super(hint, token, sender, contract, currency);
        this.proposalID = proposalID;
        Assert.check(this.proposalID !== "", MitumError.detail(ECODE.INVALID_FACT, "empty proposal id"));
        // this._hash = this.hashing()
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.proposalID),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { proposal_id: this.proposalID });
    }
}

class ProposeFact extends DAOFact {
    constructor(token, sender, contract, proposalID, proposal, currency) {
        super(HINT.DAO.PROPOSE.FACT, token, sender, contract, proposalID, currency);
        this.proposal = proposal;
        Assert.check(proposal.proposer.toString() === sender, MitumError.detail(ECODE.DAO.UNMATCHED_SENDER, `sender is unmatched with proposer of given proposal`));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.proposal.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { proposal: this.proposal.toHintedObject() });
    }
    get operationHint() {
        return HINT.DAO.PROPOSE.OPERATION;
    }
}

class CancelProposalFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.CANCEL_PROPOSAL.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.CANCEL_PROPOSAL.OPERATION;
    }
}

class RegisterFact extends DAOFact {
    constructor(token, sender, contract, proposalID, delegated, currency) {
        super(HINT.DAO.REGISTER.FACT, token, sender, contract, proposalID, currency);
        this.delegated = Address.from(delegated);
        Assert.check(this.contract.toString() !== this.delegated.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with delegated address"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.delegated.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { delegated: this.delegated.toString() });
    }
    get operationHint() {
        return HINT.DAO.REGISTER.OPERATION;
    }
}

class PreSnapFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.PRE_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.PRE_SNAP.OPERATION;
    }
}

class PostSnapFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.POST_SNAP.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.POST_SNAP.OPERATION;
    }
}

class VoteFact extends DAOFact {
    constructor(token, sender, contract, proposalID, vote, currency) {
        super(HINT.DAO.VOTE.FACT, token, sender, contract, proposalID, currency);
        Assert.check(Config.DAO.VOTE.satisfy(Number(vote)), MitumError.detail(ECODE.INVALID_FACT, "vote option out of range"));
        this.vote = Big.from(vote);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.vote.v === 0 ? Buffer.from([0x00]) : this.vote.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { vote: this.vote.v });
    }
    get operationHint() {
        return HINT.DAO.VOTE.OPERATION;
    }
}

class ExecuteFact extends DAOFact {
    constructor(token, sender, contract, proposalID, currency) {
        super(HINT.DAO.EXECUTE.FACT, token, sender, contract, proposalID, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.EXECUTE.OPERATION;
    }
}

class DAOPolicy {
    constructor(token, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum) {
        this.hint = new Hint(HINT.DAO.POLICY);
        this.token = CurrencyID.from(token);
        this.threshold = Big.from(threshold);
        this.fee = fee,
            this.whitelist = whitelist;
        this.proposalReviewPeriod = Big.from(proposalReviewPeriod);
        this.registrationPeriod = Big.from(registrationPeriod);
        this.preSnapshotPeriod = Big.from(preSnapshotPeriod);
        this.votingPeriod = Big.from(votingPeriod);
        this.postSnapshotPeriod = Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = Big.from(executionDelayPeriod);
        this.turnout = Big.from(turnout);
        this.quorum = Big.from(quorum);
    }
    toBuffer() {
        return Buffer.concat([
            this.token.toBuffer(),
            this.threshold.toBuffer(),
            this.fee.toBuffer(),
            this.whitelist.toBuffer(),
            this.proposalReviewPeriod.toBuffer("fill"),
            this.registrationPeriod.toBuffer("fill"),
            this.preSnapshotPeriod.toBuffer("fill"),
            this.votingPeriod.toBuffer("fill"),
            this.postSnapshotPeriod.toBuffer("fill"),
            this.executionDelayPeriod.toBuffer("fill"),
            this.turnout.toBuffer(),
            this.quorum.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            token: this.token.toString(),
            threshold: this.threshold.toString(),
            fee: this.fee.toHintedObject(),
            whitelist: this.whitelist.toHintedObject(),
            proposal_review_period: this.proposalReviewPeriod.v,
            registration_period: this.registrationPeriod.v,
            pre_snapshot_period: this.preSnapshotPeriod.v,
            voting_period: this.votingPeriod.v,
            post_snapshot_period: this.postSnapshotPeriod.v,
            execution_delay_period: this.executionDelayPeriod.v,
            turnout: this.turnout.v,
            quorum: this.quorum.v,
        };
    }
}

class Whitelist {
    constructor(active, accounts) {
        this.hint = new Hint(HINT.DAO.WHITELIST);
        this.active = Bool.from(active);
        this.accounts = accounts ? accounts.map(a => Address.from(a)) : [];
        Assert.check(Config.DAO.ADDRESS_IN_WHITELIST.satisfy(accounts.length), MitumError.detail(ECODE.DAO.INVALID_WHITELIST, "whitelist length out of range"));
        Assert.check(hasOverlappingAddress(accounts), MitumError.detail(ECODE.DAO.INVALID_WHITELIST, "duplicate account found in whitelist"));
    }
    toBuffer() {
        return Buffer.concat([
            this.active.toBuffer(),
            Buffer.concat(this.accounts.sort(SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            active: this.active.v,
            accounts: this.accounts.sort(SortFunc).map(a => a.toString()),
        };
    }
}

class Calldata {
    constructor(hint) {
        this.hint = new Hint(hint);
    }
    toBuffer() {
        return Buffer.from([]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
        };
    }
}
class TransferCalldata extends Calldata {
    constructor(sender, receiver, amount) {
        super(HINT.DAO.CALLDATA.TRANSFER);
        this.sender = Address.from(sender);
        this.receiver = Address.from(receiver);
        this.amount = amount;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { sender: this.sender.toString(), receiver: this.receiver.toString(), amount: this.amount.toHintedObject() });
    }
}
class GovernanceCalldata extends Calldata {
    constructor(policy) {
        super(HINT.DAO.CALLDATA.GOVERNANCE);
        this.policy = policy;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.policy.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { policy: this.policy.toHintedObject() });
    }
}
class Proposal {
    constructor(hint, proposer, startTime) {
        this.hint = new Hint(hint);
        this.proposer = Address.from(proposer);
        this.startTime = Big.from(startTime);
    }
    toBuffer() {
        return Buffer.concat([
            this.proposer.toBuffer(),
            this.startTime.toBuffer("fill"),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            proposer: this.proposer.toString(),
            start_time: this.startTime.v,
        };
    }
}
class CryptoProposal extends Proposal {
    constructor(proposer, startTime, calldata) {
        super(HINT.DAO.PROPOSAL.CRYPTO, proposer, startTime);
        this.calldata = calldata;
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.calldata.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { call_data: this.calldata.toHintedObject() });
    }
}
class BizProposal extends Proposal {
    constructor(proposer, startTime, url, hash, options) {
        super(HINT.DAO.PROPOSAL.BIZ, proposer, startTime);
        this.url = LongString.from(url);
        this.hash = LongString.from(hash);
        this.options = Big.from(options);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.url.toBuffer(),
            this.hash.toBuffer(),
            this.options.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { url: this.url.toString(), hash: this.hash.toString(), options: this.options.v });
    }
}

class UpdatePolicyFact extends ContractFact {
    constructor(token, sender, contract, option, votingPowerToken, threshold, fee, whitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum, currency) {
        super(HINT.DAO.UPDATE_POLICY.FACT, token, sender, contract, currency);
        this.option = option;
        this.votingPowerToken = CurrencyID.from(votingPowerToken);
        this.threshold = Big.from(threshold);
        this.fee = fee;
        this.whitelist = whitelist;
        this.proposalReviewPeriod = Big.from(proposalReviewPeriod);
        this.registrationPeriod = Big.from(registrationPeriod);
        this.preSnapshotPeriod = Big.from(preSnapshotPeriod);
        this.votingPeriod = Big.from(votingPeriod);
        this.postSnapshotPeriod = Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = Big.from(executionDelayPeriod);
        this.turnout = Big.from(turnout);
        this.quorum = Big.from(quorum);
        Assert.check(Config.DAO.QUORUM.satisfy(this.turnout.v), MitumError.detail(ECODE.INVALID_FACT, "turnout out of range"));
        Assert.check(Config.DAO.QUORUM.satisfy(this.quorum.v), MitumError.detail(ECODE.INVALID_FACT, "quorum out of range"));
        this.whitelist.accounts.forEach(a => Assert.check(this.contract.toString() !== a.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.option),
            this.votingPowerToken.toBuffer(),
            this.threshold.toBuffer(),
            this.fee.toBuffer(),
            this.whitelist.toBuffer(),
            this.proposalReviewPeriod.toBuffer("fill"),
            this.registrationPeriod.toBuffer("fill"),
            this.preSnapshotPeriod.toBuffer("fill"),
            this.votingPeriod.toBuffer("fill"),
            this.postSnapshotPeriod.toBuffer("fill"),
            this.executionDelayPeriod.toBuffer("fill"),
            this.turnout.toBuffer(),
            this.quorum.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { option: this.option, voting_power_token: this.votingPowerToken.toString(), threshold: this.threshold.toString(), fee: this.fee.toHintedObject(), whitelist: this.whitelist.toHintedObject(), proposal_review_period: this.proposalReviewPeriod.v, registration_period: this.registrationPeriod.v, pre_snapshot_period: this.preSnapshotPeriod.v, voting_period: this.votingPeriod.v, post_snapshot_period: this.postSnapshotPeriod.v, execution_delay_period: this.executionDelayPeriod.v, turnout: this.turnout.v, quorum: this.quorum.v });
    }
    get operationHint() {
        return HINT.DAO.UPDATE_POLICY.OPERATION;
    }
}

class DAO extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new Operation$1(this.networkID, new CreateDAOFact(TimeStamp$1.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new Amount(currency, data.fee), new Whitelist(true, data.proposers.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    updateService(contractAddr, sender, data, currency) {
        const keysToCheck = ['option', 'token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new Operation$1(this.networkID, new UpdatePolicyFact(TimeStamp$1.new().UTC(), sender, contractAddr, data.option, data.token, data.threshold, new Amount(currency, data.fee), new Whitelist(true, data.proposers.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum, currency));
    }
    formTransferCalldata(sender, receiver, currency, amount) {
        return new TransferCalldata(sender, receiver, new Amount(currency, amount));
    }
    formSetPolicyCalldata(data, currency) {
        const keysToCheck = ['token', 'threshold', 'fee', 'proposers', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the policyData structure`));
        });
        return new GovernanceCalldata(new DAOPolicy(data.token, data.threshold, new Amount(currency, data.fee), new Whitelist(true, data.proposers.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum));
    }
    writeCryptoProposal(proposer, startTime, calldata) {
        return new CryptoProposal(proposer, startTime, calldata);
    }
    writeBizProposal(proposer, startTime, url, hash, options) {
        return new BizProposal(proposer, startTime, url, hash, options);
    }
    propose(contractAddr, sender, proposalID, proposal, currency) {
        new URIString(proposalID, 'proposalID');
        return new Operation$1(this.networkID, new ProposeFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, proposal, currency));
    }
    register(contractAddr, sender, proposalID, currency, delegator) {
        return new Operation$1(this.networkID, new RegisterFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, delegator ? delegator : sender, currency));
    }
    cancel(contractAddr, sender, proposalID, currency) {
        return new Operation$1(this.networkID, new CancelProposalFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    snapBeforeVoting(contractAddr, sender, proposalID, currency) {
        return new Operation$1(this.networkID, new PreSnapFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    castVote(contractAddr, sender, proposalID, voteOption, currency) {
        return new Operation$1(this.networkID, new VoteFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, voteOption, currency));
    }
    snapAfterVoting(contractAddr, sender, proposalID, currency) {
        return new Operation$1(this.networkID, new PostSnapFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    execute(contractAddr, sender, proposalID, currency) {
        return new Operation$1(this.networkID, new ExecuteFact(TimeStamp$1.new().UTC(), sender, contractAddr, proposalID, currency));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.dao.getService(this.api, contractAddr, this.delegateIP));
        });
    }
    getProposalInfo(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.dao.getProposal(this.api, contractAddr, proposalID, this.delegateIP));
        });
    }
    getDelegatorInfo(contractAddr, proposalID, delegator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.dao.getDelegator(this.api, contractAddr, proposalID, delegator, this.delegateIP));
        });
    }
    getVoterInfo(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.dao.getVoter(this.api, contractAddr, proposalID, this.delegateIP));
        });
    }
    getVotingResult(contractAddr, proposalID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.dao.getVotingResult(this.api, contractAddr, proposalID, this.delegateIP));
        });
    }
}

class STOItem extends Item {
    constructor(hint, contract, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
    }
    toBuffer() {
        return this.contract.toBuffer();
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}

class Partition {
    constructor(s) {
        Assert.check(Config.STO.PARTITION.satisfy(s.length), MitumError.detail(ECODE.STO.INVALID_PARTITION, "partition length out of range"));
        Assert.check(/^[A-Z0-9][A-Z0-9_\.\!\$\*\@]*[A-Z0-9]$/.test(s), MitumError.detail(ECODE.STO.INVALID_PARTITION, "invalid partition format"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Partition ? s : new Partition(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}

class CreateSecurityTokenItem extends STOItem {
    constructor(contract, granularity, defaultPartition, currency) {
        super(HINT.STO.CREATE_SECURITY_TOKEN.ITEM, contract, currency);
        this.granularity = Big.from(granularity);
        this.defaultPartition = Partition.from(defaultPartition);
        Assert.check(!this.granularity.isZero(), MitumError.detail(ECODE.INVALID_ITEM, "zero granularity"));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.granularity.toBuffer("fill"),
            this.defaultPartition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { granularity: this.granularity.v, default_partition: this.defaultPartition.toString() });
    }
}
class CreateSecurityTokenFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.CREATE_SECURITY_TOKEN.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return HINT.STO.CREATE_SECURITY_TOKEN.OPERATION;
    }
}

class IssueSecurityTokenItem extends STOItem {
    constructor(contract, receiver, amount, partition, currency) {
        super(HINT.STO.ISSUE_SECURITY_TOKEN.ITEM, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        this.partition = Partition.from(partition);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with receiver address"));
        Assert.check(!this.amount.isZero(), MitumError.detail(ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString(), partition: this.partition.toString() });
    }
}
class IssueSecurityTokenFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.ISSUE_SECURITY_TOKEN.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate contract found in items"));
    }
    get operationHint() {
        return HINT.STO.ISSUE_SECURITY_TOKEN.OPERATION;
    }
}

class AuthorizeOperatorItem extends STOItem {
    constructor(contract, operator, partition, currency) {
        super(HINT.STO.AUTHORIZE_OPERATOR.ITEM, contract, currency);
        this.operator = Address.from(operator);
        this.partition = Partition.from(partition);
        Assert.check(this.contract.toString() !== this.operator.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with operator address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { operator: this.operator.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.operator.toString();
    }
}
class AuthorizeOperatorFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.AUTHORIZE_OPERATOR.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate operator found in items"));
    }
    get operationHint() {
        return HINT.STO.AUTHORIZE_OPERATOR.OPERATION;
    }
}

class RevokeOperatorItem extends STOItem {
    constructor(contract, operator, partition, currency) {
        super(HINT.STO.REVOKE_OPERATOR.ITEM, contract, currency);
        this.operator = Address.from(operator);
        this.partition = Partition.from(partition);
        Assert.check(this.contract.toString() !== this.operator.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with operator address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.operator.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { operator: this.operator.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.operator.toString();
    }
}
class RevokeOperatorFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.REVOKE_OPERATOR.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate operator found in items"));
    }
    get operationHint() {
        return HINT.STO.REVOKE_OPERATOR.OPERATION;
    }
}

class RedeemTokenItem extends STOItem {
    constructor(contract, tokenHolder, amount, partition, currency) {
        super(HINT.STO.REDEEM.ITEM, contract, currency);
        this.tokenHolder = Address.from(tokenHolder);
        this.amount = Big.from(amount);
        this.partition = Partition.from(partition);
        Assert.check(this.contract.toString() !== this.tokenHolder.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with token holder address"));
        Assert.check(!this.amount.isZero(), MitumError.detail(ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.amount.toBuffer(),
            this.partition.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { tokenHolder: this.tokenHolder.toString(), amount: this.amount.toString(), partition: this.partition.toString() });
    }
    toString() {
        return this.tokenHolder.toString();
    }
}
class RedeemTokenFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.REDEEM.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate token holder found in items"));
    }
    get operationHint() {
        return HINT.STO.REDEEM.OPERATION;
    }
}

class SetDocumentFact extends ContractFact {
    constructor(token, sender, contract, title, uri, documentHash, currency) {
        super(HINT.STO.SET_DOCUMENT.FACT, token, sender, contract, currency);
        this.title = title;
        this.uri = uri;
        this.documentHash = documentHash;
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.title),
            Buffer.from(this.uri),
            Buffer.from(this.documentHash),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { title: this.title, uri: this.uri, documenthash: this.documentHash });
    }
    get operationHint() {
        return HINT.STO.SET_DOCUMENT.OPERATION;
    }
}

class TransferSecurityTokenPartitionItem extends STOItem {
    constructor(contract, tokenHolder, receiver, partition, amount, currency) {
        super(HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.ITEM, contract, currency);
        this.tokenHolder = Address.from(tokenHolder);
        this.receiver = Address.from(receiver);
        this.partition = Partition.from(partition);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.tokenHolder.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with token holder address"));
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with receiver address"));
        Assert.check(this.tokenHolder.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_ITEM, "token holder is same with receiver address"));
        Assert.check(!this.amount.isZero(), MitumError.detail(ECODE.INVALID_ITEM, "zero amount"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.tokenHolder.toBuffer(),
            this.receiver.toBuffer(),
            this.partition.toBuffer(),
            this.amount.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { tokenholder: this.tokenHolder.toString(), receiver: this.receiver.toString(), partition: this.partition.toString(), amount: this.amount.toString() });
    }
    toString() {
        return `${this.tokenHolder.toString()}-${this.receiver.toString()}-${this.partition.toString()}`;
    }
}
class TransferSecurityTokenPartitionFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate token holder-receiver-partition found in items"));
    }
    get operationHint() {
        return HINT.STO.TRANSFER_SECURITY_TOKEN_PARTITION.OPERATION;
    }
}

class STO extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    authorizeOperator(contractAddr, sender, operator, partition, currency) {
        return new Operation$1(this.networkID, new AuthorizeOperatorFact(TimeStamp$1.new().UTC(), sender, [
            new AuthorizeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    createService(contractAddr, sender, data, currency) {
        const keysToCheck = ['granularity', 'defaultPartition'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the createServiceData structure`));
        });
        return new Operation$1(this.networkID, new CreateSecurityTokenFact(TimeStamp$1.new().UTC(), sender, [
            new CreateSecurityTokenItem(contractAddr, data.granularity, data.defaultPartition, currency)
        ]));
    }
    issue(contractAddr, sender, receiver, partition, amount, currency) {
        return new Operation$1(this.networkID, new IssueSecurityTokenFact(TimeStamp$1.new().UTC(), sender, [
            new IssueSecurityTokenItem(contractAddr, receiver, amount, partition, currency)
        ]));
    }
    redeem(contractAddr, sender, tokenHolder, partition, amount, currency) {
        return new Operation$1(this.networkID, new RedeemTokenFact(TimeStamp$1.new().UTC(), sender, [
            new RedeemTokenItem(contractAddr, tokenHolder, amount, partition, currency)
        ]));
    }
    revokeOperator(contractAddr, sender, operator, partition, currency) {
        return new Operation$1(this.networkID, new RevokeOperatorFact(TimeStamp$1.new().UTC(), sender, [
            new RevokeOperatorItem(contractAddr, operator, partition, currency)
        ]));
    }
    setDocument(contractAddr, sender, title, uri, documentHash, currency) {
        return new Operation$1(this.networkID, new SetDocumentFact(TimeStamp$1.new().UTC(), sender, contractAddr, title, uri, documentHash, currency));
    }
    transferByPartition(contractAddr, sender, holder, receiver, partition, amount, currency) {
        return new Operation$1(this.networkID, new TransferSecurityTokenPartitionFact(TimeStamp$1.new().UTC(), sender, [
            new TransferSecurityTokenPartitionItem(contractAddr, holder, receiver, partition, amount, currency)
        ]));
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.sto.getService(this.api, contractAddr, this.delegateIP));
        });
    }
    getPartitionsInfo(contractAddr, holder) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.sto.getPartitions(this.api, contractAddr, holder, this.delegateIP));
        });
    }
    getBalanceByHolder(contractAddr, holder, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.sto.getBalanceByHolder(this.api, contractAddr, holder, partition, this.delegateIP));
        });
    }
    getOperatorsByHolder(contractAddr, holder, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.sto.getOperatorsByHolder(this.api, contractAddr, holder, partition, this.delegateIP));
        });
    }
    getPartitionBalanceInfo(contractAddr, partition) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.sto.getPartitionBalance(this.api, contractAddr, partition, this.delegateIP));
        });
    }
    getAuthorizedInfo(contractAddr, operator) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.sto.getAuthorized(this.api, contractAddr, operator, this.delegateIP));
        });
    }
}

let CreateServiceFact$1 = class CreateServiceFact extends ContractFact {
    constructor(token, sender, contract, currency) {
        super(HINT.KYC.CREATE_SERVICE.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.KYC.CREATE_SERVICE.OPERATION;
    }
};

class KYCItem extends Item {
    constructor(hint, contract, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
    }
    toBuffer() {
        return this.contract.toBuffer();
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { contract: this.contract.toString(), currency: this.currency.toString() });
    }
    toString() {
        return this.contract.toString();
    }
}

class AddControllerItem extends KYCItem {
    constructor(contract, controller, currency) {
        super(HINT.KYC.ADD_CONTROLLER.ITEM, contract, currency);
        this.controller = Address.from(controller);
        Assert.check(this.contract.toString() !== this.controller.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with controller address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.controller.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { controller: this.controller.toString() });
    }
    toString() {
        return `${super.toString()}-${this.controller.toString()}`;
    }
}
class AddControllerFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.KYC.ADD_CONTROLLER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate controller found in items"));
    }
    get operationHint() {
        return HINT.KYC.ADD_CONTROLLER.OPERATION;
    }
}

class RemoveControllerItem extends KYCItem {
    constructor(contract, controller, currency) {
        super(HINT.KYC.REMOVE_CONTROLLER.ITEM, contract, currency);
        this.controller = Address.from(controller);
        Assert.check(this.contract.toString() !== this.controller.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with controller address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.controller.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { controller: this.controller.toString() });
    }
    toString() {
        return `${super.toString()}-${this.controller.toString()}`;
    }
}
class RemoveControllerFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.KYC.REMOVE_CONTROLLER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate controller found in items"));
    }
    get operationHint() {
        return HINT.KYC.REMOVE_CONTROLLER.OPERATION;
    }
}

class AddCustomerItem extends KYCItem {
    constructor(contract, customer, status, currency) {
        super(HINT.KYC.ADD_CUSTOMER.ITEM, contract, currency);
        this.customer = Address.from(customer);
        this.status = Bool.from(status);
        Assert.check(this.contract.toString() !== this.customer.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with customer address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.customer.toBuffer(),
            this.status.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { customer: this.customer.toString(), status: this.status.v });
    }
    toString() {
        return `${super.toString()}-${this.customer.toString()}`;
    }
}
class AddCustomerFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.KYC.ADD_CUSTOMER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate customer found in items"));
    }
    get operationHint() {
        return HINT.KYC.ADD_CUSTOMER.OPERATION;
    }
}

class UpdateCustomerItem extends KYCItem {
    constructor(contract, customer, status, currency) {
        super(HINT.KYC.UPDATE_CUSTOMER.ITEM, contract, currency);
        this.customer = Address.from(customer);
        this.status = Bool.from(status);
        Assert.check(this.contract.toString() !== this.customer.toString(), MitumError.detail(ECODE.INVALID_ITEM, "contract is same with customer address"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.customer.toBuffer(),
            this.status.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { customer: this.customer.toString(), status: this.status.v });
    }
    toString() {
        return `${super.toString()}-${this.customer.toString()}`;
    }
}
class UpdateCustomerFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.KYC.UPDATE_CUSTOMER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate customer found in items"));
    }
    get operationHint() {
        return HINT.KYC.UPDATE_CUSTOMER.OPERATION;
    }
}

class KYC extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, currency) {
        return new Operation$1(this.networkID, new CreateServiceFact$1(TimeStamp$1.new().UTC(), sender, contractAddr, currency));
    }
    addController(contractAddr, sender, controller, currency) {
        return new Operation$1(this.networkID, new AddControllerFact(TimeStamp$1.new().UTC(), sender, [
            new AddControllerItem(contractAddr, controller, currency)
        ]));
    }
    addCustomer(contractAddr, sender, customer, status, currency) {
        return new Operation$1(this.networkID, new AddCustomerFact(TimeStamp$1.new().UTC(), sender, [
            new AddCustomerItem(contractAddr, customer, status, currency)
        ]));
    }
    removeController(contractAddr, sender, controller, currency) {
        return new Operation$1(this.networkID, new RemoveControllerFact(TimeStamp$1.new().UTC(), sender, [
            new RemoveControllerItem(contractAddr, controller, currency)
        ]));
    }
    updateCustomer(contractAddr, sender, customer, status, currency) {
        return new Operation$1(this.networkID, new UpdateCustomerFact(TimeStamp$1.new().UTC(), sender, [new UpdateCustomerItem(contractAddr, customer, status, currency)]));
    }
}

class TimeStampFact extends ContractFact {
    constructor(hint, token, sender, target, currency) {
        super(hint, token, sender, target, currency);
        // this._hash = this.hashing()
    }
    toHintedObject() {
        const fact = super.toHintedObject();
        delete fact['contract'];
        return Object.assign(Object.assign({}, fact), { target: this.contract.toString() });
    }
}

class CreateServiceFact extends TimeStampFact {
    constructor(token, sender, target, currency) {
        super(HINT.TIMESTAMP.CREATE_SERVICE.FACT, token, sender, target, currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    get operationHint() {
        return HINT.TIMESTAMP.CREATE_SERVICE.OPERATION;
    }
}

class AppendFact extends TimeStampFact {
    constructor(token, sender, target, projectID, requestTimeStamp, data, currency) {
        super(HINT.TIMESTAMP.APPEND.FACT, token, sender, target, currency);
        this.projectID = projectID;
        this.requestTimeStamp = Big.from(requestTimeStamp);
        this.data = data;
        Assert.check(Config.TIMESTAMP.PROJECT_ID.satisfy(this.projectID.length), MitumError.detail(ECODE.INVALID_FACT, "project id length out of range"));
        Assert.check(Config.TIMESTAMP.DATA.satisfy(this.data.length), MitumError.detail(ECODE.INVALID_FACT, "data length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.projectID),
            this.requestTimeStamp.toBuffer("fill"),
            Buffer.from(this.data),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { projectid: this.projectID, request_timestamp: this.requestTimeStamp.v, data: this.data });
    }
    get operationHint() {
        return HINT.TIMESTAMP.APPEND.OPERATION;
    }
}

class TimeStamp extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, currency) {
        return new Operation$1(this.networkID, new CreateServiceFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency));
    }
    append(contractAddr, sender, projectID, requestTimeStamp, data, currency) {
        new URIString(projectID, 'projectID');
        const fact = new AppendFact(TimeStamp$1.new().UTC(), sender, contractAddr, projectID, requestTimeStamp, data, currency);
        return new Operation$1(this.networkID, fact);
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.timestamp.getService(this.api, contractAddr, this.delegateIP));
        });
    }
    getTimestampInfo(contractAddr, projectID, tid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield getAPIData(() => contract.timestamp.getTimeStamp(this.api, contractAddr, projectID, tid, this.delegateIP));
        });
    }
}

class TokenFact extends ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign({}, super.toHintedObject());
    }
}

class RegisterTokenFact extends TokenFact {
    constructor(token, sender, contract, currency, symbol, name, initialSupply) {
        super(HINT.TOKEN.REGISTER_TOKEN.FACT, token, sender, contract, currency);
        this.symbol = CurrencyID.from(symbol);
        this.name = LongString.from(name);
        this.initialSupply = Big.from(initialSupply);
        Assert.check(this.initialSupply.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "initialSupply under zero"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.symbol.toBuffer(),
            this.name.toBuffer(),
            this.initialSupply.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { symbol: this.symbol.toString(), name: this.name.toString(), initial_supply: this.initialSupply.toString() });
    }
    get operationHint() {
        return HINT.TOKEN.REGISTER_TOKEN.OPERATION;
    }
}

let MintFact$1 = class MintFact extends TokenFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.TOKEN.MINT.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.TOKEN.MINT.OPERATION;
    }
};

let BurnFact$1 = class BurnFact extends TokenFact {
    constructor(token, sender, contract, currency, target, amount) {
        super(HINT.TOKEN.BURN.FACT, token, sender, contract, currency);
        this.target = Address.from(target);
        this.amount = Big.from(amount);
        Assert.check(Address.from(contract).toString() !== this.target.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with target address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.TOKEN.BURN.OPERATION;
    }
};

let TransferFact$1 = class TransferFact extends TokenFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.TOKEN.TRANSFER.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.TOKEN.TRANSFER.OPERATION;
    }
};

let ApproveFact$1 = class ApproveFact extends TokenFact {
    constructor(token, sender, contract, currency, approved, amount) {
        super(HINT.TOKEN.APPROVE.FACT, token, sender, contract, currency);
        this.approved = Address.from(approved);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.approved.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with approved address"));
        Assert.check(this.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "under zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.TOKEN.APPROVE.OPERATION;
    }
};

let TransferFromFact$1 = class TransferFromFact extends TokenFact {
    constructor(token, sender, contract, currency, receiver, target, amount) {
        super(HINT.TOKEN.TRANSFER_FROM.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.target = Address.from(target);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.contract.toString() !== this.target.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with target address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), target: this.target.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.TOKEN.TRANSFER_FROM.OPERATION;
    }
};

class Token extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    registerToken(contractAddr, sender, currency, name, symbol, initialSupply) {
        return new Operation$1(this.networkID, new RegisterTokenFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, symbol, name, initialSupply !== null && initialSupply !== void 0 ? initialSupply : 0));
    }
    mint(contractAddr, sender, currency, receiver, amount) {
        return new Operation$1(this.networkID, new MintFact$1(TimeStamp$1.new().UTC(), sender, contractAddr, currency, receiver, amount));
    }
    burn(contractAddr, sender, currency, target, amount) {
        return new Operation$1(this.networkID, new BurnFact$1(TimeStamp$1.new().UTC(), sender, contractAddr, currency, target, amount));
    }
    transfer(contractAddr, sender, currency, receiver, amount) {
        return new Operation$1(this.networkID, new TransferFact$1(TimeStamp$1.new().UTC(), sender, contractAddr, currency, receiver, amount));
    }
    transferFrom(contractAddr, sender, currency, receiver, target, amount) {
        return new Operation$1(this.networkID, new TransferFromFact$1(TimeStamp$1.new().UTC(), sender, contractAddr, currency, receiver, target, amount));
    }
    approve(contractAddr, sender, currency, approved, amount) {
        return new Operation$1(this.networkID, new ApproveFact$1(TimeStamp$1.new().UTC(), sender, contractAddr, currency, approved, amount));
    }
    getTokenInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.token.getToken(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getAllowance(contractAddr, owner, spender) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.token.getToken(this.api, contractAddr, this.delegateIP));
            if (data) {
                const approve_list = data._embedded.policy.approve_list;
                let amount;
                for (let i = 0; i < approve_list.length; i++) {
                    if (approve_list[i].account === owner) {
                        const approved = approve_list[i].approved;
                        for (let j = 0; j < approved.length; j++) {
                            if (approved[j].account === spender) {
                                amount = {
                                    'amount': approved[j].amount
                                };
                            }
                        }
                    }
                }
                return amount;
            }
            else {
                return null;
            }
        });
    }
    getTokenBalance(contractAddr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.token.getTokenBalance(this.api, contractAddr, owner, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}

class PointFact extends ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign({}, super.toHintedObject());
    }
}

class RegisterPointFact extends PointFact {
    constructor(token, sender, contract, currency, symbol, name, initialSupply) {
        super(HINT.POINT.REGISTER_POINT.FACT, token, sender, contract, currency);
        this.symbol = CurrencyID.from(symbol);
        this.name = LongString.from(name);
        this.initialSupply = Big.from(initialSupply);
        Assert.check(this.initialSupply.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "initialSupply under zero"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.symbol.toBuffer(),
            this.name.toBuffer(),
            this.initialSupply.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { symbol: this.symbol.toString(), name: this.name.toString(), initial_supply: this.initialSupply.toString() });
    }
    get operationHint() {
        return HINT.POINT.REGISTER_POINT.OPERATION;
    }
}

class MintFact extends PointFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.POINT.MINT.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.POINT.MINT.OPERATION;
    }
}

class BurnFact extends PointFact {
    constructor(token, sender, contract, currency, target, amount) {
        super(HINT.POINT.BURN.FACT, token, sender, contract, currency);
        this.target = Address.from(target);
        this.amount = Big.from(amount);
        Assert.check(Address.from(contract).toString() !== this.target.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with target address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { target: this.target.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.POINT.BURN.OPERATION;
    }
}

class TransferFact extends PointFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.POINT.TRANSFER.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.POINT.TRANSFER.OPERATION;
    }
}

class ApproveFact extends PointFact {
    constructor(token, sender, contract, currency, approved, amount) {
        super(HINT.POINT.APPROVE.FACT, token, sender, contract, currency);
        this.approved = Address.from(approved);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.approved.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with approved address"));
        Assert.check(this.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "under zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.approved.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { approved: this.approved.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.POINT.APPROVE.OPERATION;
    }
}

class TransferFromFact extends PointFact {
    constructor(token, sender, contract, currency, receiver, target, amount) {
        super(HINT.POINT.TRANSFER_FROM.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.target = Address.from(target);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with receiver address"));
        Assert.check(this.contract.toString() !== this.target.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with target address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "zero amount"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.receiver.toBuffer(),
            this.target.toBuffer(),
            this.amount.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { receiver: this.receiver.toString(), target: this.target.toString(), amount: this.amount.toString() });
    }
    get operationHint() {
        return HINT.POINT.TRANSFER_FROM.OPERATION;
    }
}

class Point extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    registerPoint(contractAddr, sender, currency, name, symbol, initialSupply) {
        return new Operation$1(this.networkID, new RegisterPointFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, symbol, name, initialSupply !== null && initialSupply !== void 0 ? initialSupply : 0));
    }
    mint(contractAddr, sender, currency, receiver, amount) {
        return new Operation$1(this.networkID, new MintFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, receiver, amount));
    }
    burn(contractAddr, sender, currency, target, amount) {
        return new Operation$1(this.networkID, new BurnFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, target, amount));
    }
    transfer(contractAddr, sender, currency, receiver, amount) {
        return new Operation$1(this.networkID, new TransferFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, receiver, amount));
    }
    transferFrom(contractAddr, sender, currency, receiver, target, amount) {
        return new Operation$1(this.networkID, new TransferFromFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, receiver, target, amount));
    }
    approve(contractAddr, sender, currency, approved, amount) {
        return new Operation$1(this.networkID, new ApproveFact(TimeStamp$1.new().UTC(), sender, contractAddr, currency, approved, amount));
    }
    getPointInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.point.getPoint(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getAllowance(contractAddr, owner, spender) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.point.getPoint(this.api, contractAddr, this.delegateIP));
            if (data) {
                const approve_list = data._embedded.policy.approve_list;
                let amount;
                for (let i = 0; i < approve_list.length; i++) {
                    if (approve_list[i].account === owner) {
                        const approved = approve_list[i].approved;
                        for (let j = 0; j < approved.length; j++) {
                            if (approved[j].account === spender) {
                                amount = {
                                    'amount': approved[j].amount
                                };
                            }
                        }
                    }
                }
                return amount;
            }
            else {
                return null;
            }
        });
    }
    getPointBalance(contractAddr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield getAPIData(() => contract.point.getPointBalance(this.api, contractAddr, owner, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}

class Signer extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    sign(privatekey, json, option) {
        var _a;
        const keypair = KeyPair.fromPrivateKey(privatekey);
        return option ? this.nodeSign(keypair, json, (_a = option.node) !== null && _a !== void 0 ? _a : "") : this.accSign(keypair, json);
    }
    accSign(keypair, json) {
        const now = TimeStamp$1.new();
        const fs = new GeneralFactSign(keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            base58.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs !== undefined) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        Assert.check(new Set(json.signs.map(fs => fs.signer.toString())).size === json.signs.length, MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBuffer("super"),
        ]));
        //.sort((a, b) => Buffer.compare(a, b))
        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = base58.encode(sha3(msg));
        return json;
    }
    nodeSign(keypair, json, node) {
        const nd = new NodeAddress(node);
        const now = TimeStamp$1.new();
        const fs = new NodeFactSign(node, keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            nd.toBuffer(),
            base58.decode(json.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (json.signs) {
            json.signs = [...json.signs, fs];
        }
        else {
            json.signs = [fs];
        }
        const factSigns = json.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBuffer("super"),
        ]))
            .sort((a, b) => Buffer.compare(a, b));
        const msg = Buffer.concat([
            base58.decode(json.fact.hash),
            Buffer.concat(factSigns),
        ]);
        json.hash = base58.encode(sha3(msg));
        return json;
    }
}

class Operation extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    getAllOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api$1.getOperations(this.api, this.delegateIP);
        });
    }
    getOperation(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api$1.getOperation(this.api, hash, this.delegateIP);
        });
    }
    sign(privatekey, operation, option) {
        const op = operation;
        op.sign(privatekey instanceof KeyPair ? privatekey.privateKey : privatekey, option);
        return op;
    }
    send(operation, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield api$1.send(this.api, operation, this.delegateIP, headers);
        });
    }
}

class Mitum extends Generator {
    constructor(api, delegateIP) {
        super(NetworkID.get(), api, delegateIP);
        this._node = new Node(this.api, this.delegateIP);
        this._account = new Account(this.networkID, this.api, this.delegateIP);
        this._currency = new Currency(this.networkID, this.api, this.delegateIP);
        this._block = new Block(this.api, this.delegateIP);
        this._operation = new Operation(this.networkID, this.api, this.delegateIP);
        this._signer = new Signer(this.networkID, this.api);
        this._contract = new Contract(this.networkID, this.api, this.delegateIP);
        this._nft = new NFT(this.networkID, this.api, this.delegateIP);
        this._credential = new Credential(this.networkID, this.api, this.delegateIP);
        this._timestamp = new TimeStamp(this.networkID, this.api, this.delegateIP);
        this._sto = new STO(this.networkID, this.api, this.delegateIP);
        this._kyc = new KYC(this.networkID, this.api, this.delegateIP);
        this._dao = new DAO(this.networkID, this.api, this.delegateIP);
        this._token = new Token(this.networkID, this.api, this.delegateIP);
        this._point = new Point(this.networkID, this.api, this.delegateIP);
    }
    refresh() {
        this._node = new Node(this.api, this.delegateIP);
        this._account = new Account(this.networkID, this.api, this.delegateIP);
        this._currency = new Currency(this.networkID, this.api, this.delegateIP);
        this._block = new Block(this.api, this.delegateIP);
        this._operation = new Operation(this.networkID, this.api, this.delegateIP);
        this._contract = new Contract(this.networkID, this.api, this.delegateIP);
        this._nft = new NFT(this.networkID, this.api, this.delegateIP);
        this._credential = new Credential(this.networkID, this.api, this.delegateIP);
        this._timestamp = new TimeStamp(this.networkID, this.api, this.delegateIP);
        this._sto = new STO(this.networkID, this.api, this.delegateIP);
        this._kyc = new KYC(this.networkID, this.api, this.delegateIP);
        this._dao = new DAO(this.networkID, this.api, this.delegateIP);
        this._token = new Token(this.networkID, this.api, this.delegateIP);
        this._point = new Point(this.networkID, this.api, this.delegateIP);
    }
    get node() {
        return this._node;
    }
    get account() {
        return this._account;
    }
    get currency() {
        return this._currency;
    }
    get block() {
        return this._block;
    }
    get operation() {
        return this._operation;
    }
    get signer() {
        return this._signer;
    }
    get contract() {
        return this._contract;
    }
    get nft() {
        return this._nft;
    }
    get credential() {
        return this._credential;
    }
    get timestamp() {
        return this._timestamp;
    }
    get sto() {
        return this._sto;
    }
    get kyc() {
        return this._kyc;
    }
    get dao() {
        return this._dao;
    }
    get token() {
        return this._token;
    }
    get point() {
        return this._point;
    }
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api) {
        this.setAPI(api);
    }
    setAPI(api) {
        super.setAPI(api);
        this.refresh();
    }
    setDelegate(delegateIP) {
        super.setDelegate(delegateIP);
        this.refresh();
    }
    getDelegate() {
        return this.delegateIP.toString();
    }
    /**
     * @deprecated use .api (get)
     */
    getNode() {
        return this.api.toString();
    }
    getAPI() {
        return this.api.toString();
    }
    getChain() {
        return this.networkID;
    }
    setChain(networkID) {
        super.setNetworkID(networkID);
        this.refresh();
    }
}

exports.Mitum = Mitum;
exports.default = Mitum;
