import Int64 from 'int64-buffer';
import bigInt from 'big-integer';
import axios from 'axios';
import base58 from 'bs58';
import pkg from 'js-sha3';
const { sha3_256, keccak256: keccak256$1 } = pkg;
import { Wallet, HDNodeWallet } from 'ethers';
import { hmac } from '@noble/hashes/hmac';
import { sha256 as sha256$1 } from '@noble/hashes/sha256';
import * as secp256k1 from '@noble/secp256k1';
import { getPublicKey } from '@noble/secp256k1';
import * as crypto from 'crypto';
import pkg2 from 'elliptic';
const { ec } = pkg2;

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

const fetchAxios = axios.create({
    adapter: isNode ? undefined : 'fetch',
});

const ECODE = {
    // General Errors
    NO_API: "EC_NO_API",
    UNKNOWN: "EC_UNKNOWN",
    // Operation Errors
    OP_SIZE_EXCEEDED: "EC_OP_SIZE_EXCEEDED",
    EMPTY_STRING: "EC_EMPTY_STRING",
    EMPTY_SIGN: "EC_EMPTY_SIGN",
    // Validation Errors
    /// Date and Time Validation
    INVALID_DATE: "EC_INVALID_DATE",
    /// IP Address Validation
    INVALID_IP: "EC_INVALID_IP",
    /// Length Validation
    INVALID_LENGTH: "EC_INVALID_LENGTH",
    /// Type Validation
    INVALID_TYPE: "EC_INVALID_TYPE",
    /// Seed and Key Validation
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
    INVALID_ADDRESS_CHECKSUM: "EC_INVALID_ADDRESS_CHECKSUM",
    /// Data Validation
    //// Number
    INVALID_BIG_INTEGER: "EC_INVALID_BIG_INTERGER",
    INVALID_DECIMAL: "EC_INVALID_DECIMAL",
    INVALID_FLOAT: "EC_INVALID_FLOAT",
    INVALID_UINT8: "EC_INVALID_UINT8",
    //// Operation Contents
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
    // Not Implemented Errors
    NOT_IMPLEMENTED_BUFFER: "EC_NOT_IMPLEMENTED_BUFFER",
    NOT_IMPLEMENTED_HINTED_OBJECT: "EC_NOT_IMPLEMENTED_HINTED_OBJECT",
    NOT_IMPLEMENTED_METHOD: "EC_NOT_IMPLEMENTED_METHOD",
    // Failure Errors
    FAIL_FILE_CREATION: "EC_FAIL_FILE_CREATION",
    FAIL_SIGN: "EC_FAIL_SIGN",
    // HDWallet Errors
    HDWALLET: {
        INVALID_PHRASE: "EC_INVALID_PHRASE",
        INVALID_PATH: "EC_INVALID_PATH",
    },
    // Currency Errors
    CURRENCY: {
        INVALID_CURRENCY_FEEER: "EC_INVALID_CURRENCY_FEEER",
        INVALID_CURRENCY_POLICY: "EC_INVALID_CURRENCY_POLICY",
        INVALID_CURRENCY_DESIGN: "EC_INVALID_CURRENCY_DESIGN",
    },
    // NFT Errors
    NFT: {
        INVALID_NFT_SIGNER: "EC_INVALID_NFT_SIGNER",
        INVALID_NFT_SIGNERS: "EC_INVALID_NFT_SIGNERS",
    },
    // STO Errors
    STO: {
        INVALID_PARTITION: "EC_INVALID_PARTITION",
    },
    // DAO Errors
    DAO: {
        INVALID_POLICY: "EC_INVALID_POLICY",
        INVALID_WHITELIST: "EC_INVALID_WHITELIST",
        UNMATCHED_SENDER: "EC_UNMATCHED_SENDER"
    },
    // Transaction Errors
    TIME_OUT: "EC_TIME_OUT",
    TRANSACTION_REVERTED: "EC_TRANSACTION_REVERTED"
};
// ECODE: Mitum Node Process Error code
const PCODE = {
    AMBIGUOUS: {
        code: "P0A",
        keyword: [""],
        description: "Ambiguous error",
        subject: "",
    },
    MITUM_CORE: {
        code: "P0M",
        keyword: [""],
        description: "Error from Mitum core",
        subject: "",
    },
    UNDEFINED: {
        code: "P00",
        keyword: [""],
        description: "Undefined error",
        subject: "",
    },
    IV_BASE_OP: {
        code: "P01",
        keyword: ["Invalid BaseOperation"],
        description: "Error from IsValid(BaseOperation)",
        subject: "",
    },
    IV_BASE_NODE_OP: {
        code: "P02",
        keyword: ["Invalid BaseNodeOperation"],
        description: "Error from IsValid(BaseNodeOperation)",
        subject: "",
    },
    IV_BASE_STATE: {
        code: "P03",
        keyword: ["Invalid BaseState"],
        description: "Error from IsValid(BaseState)",
        subject: "",
    },
    IV_FACT: {
        code: "P04",
        keyword: ["Invalid fact"],
        description: "Error from IsValid(Fact)",
        subject: "",
    },
    IV_ITEM: {
        code: "P05",
        keyword: ["Invalid item"],
        description: "Error from IsValid(Item)",
        subject: "",
    },
    PREPROCESS: {
        code: "P06",
        keyword: ["PreProcess"],
        description: "Error from PreProcess",
        subject: "",
    },
    DECODE_JSON: {
        code: "P07",
        keyword: ["Decode Json"],
        description: "Error from DecodeJSON",
        subject: "",
    },
    DECODE_BSON: {
        code: "P08",
        keyword: ["Decode Bson"],
        description: "Error from DecodeBSON",
        subject: "",
    },
};
const DCODE = {
    AMBIGUOUS: {
        code: "D00A",
        keyword: [""],
        description: "Ambiguous error",
        subject: "",
    },
    COMPLEX: {
        code: "D00C",
        keyword: [""],
        description: "Complex error with multiple DCODE",
        subject: "",
    },
    OP_DEP: {
        code: "D00D",
        keyword: [""],
        description: "Operation dependent error",
        subject: "",
    },
    UNDEFINED: {
        code: "D000",
        keyword: [""],
        description: "Undefined error",
        subject: ""
    },
    // Related to data validation
    EMPTY: {
        code: "D101",
        keyword: [""],
        description: "Empty or null data",
        subject: ""
    },
    IV_LEN: {
        code: "D102",
        keyword: ["Array length"],
        description: "The provided array exceeds the allowed length.",
        subject: ""
    },
    IV_RANGE: {
        code: "D103",
        keyword: ["Value out of range"],
        description: "The variable exceeds the allowed range.",
        subject: ""
    },
    IV_VAL: {
        code: "D104",
        keyword: ["Invalid value"],
        description: "Invalid string, Insufficient balance, Invalid state change etc.",
        subject: ""
    },
    IV_DUP: {
        code: "D105",
        keyword: ["Duplicated value"],
        description: "The item contains duplicate values.",
        subject: ""
    },
    SELF_TARGET: {
        code: "D106",
        keyword: ["Self targeted"],
        description: "Duplicate account addresses provided in an invalid manner. (sender=receiver, sender=contract, etc.)",
        subject: ""
    },
    // Related to signature
    IV_SIGN: {
        code: "D201",
        keyword: ["Invalid signing"],
        description: "The private key does not match the address or node sign required or the signatures for the multiSig account do not meet the threshold",
        subject: ""
    },
    // Related to authorization
    NO_AUTH: {
        code: "D301",
        keyword: ["Account not authorized"],
        description: "The sender account does not have permission to execute the operation.",
        subject: ""
    },
    CA_DISALLOW: {
        code: "D302",
        keyword: ["Contract account not allowed"],
        description: "A contract account cannot be used as sender, receiver etc.",
        subject: ""
    },
    // Insufficient balance
    INSUFF_BAL: {
        code: "D401",
        keyword: [""],
        description: "Insufficient token or point balance.",
        subject: ""
    },
    // Related to state
    NF_CUR: {
        code: "D501",
        keyword: ["Currency not found"],
        description: "The currency cannot be found on the blockchain.",
        subject: ""
    },
    NF_ACC: {
        code: "D502",
        keyword: ["Account not found", "Contract account not found"],
        description: "The account or contract account cannot be found on the blockchain.",
        subject: ""
    },
    NF_SERVICE: {
        code: "D503",
        keyword: ["Service not found"],
        description: "The service cannot be found in the given contract.",
        subject: ""
    },
    NF_STATE: {
        code: "D504",
        keyword: ["State not found"],
        description: "The state cannot be found on the blockchain.",
        subject: ""
    },
    EXIST_CUR: {
        code: "D505",
        keyword: ["Currency exist"],
        description: "The currency already exists on the blockchain.",
        subject: ""
    },
    EXIST_ACC: {
        code: "D506",
        keyword: ["Account exist", "Contract account exist"],
        description: "The account or contract account already exists on the blockchain.",
        subject: ""
    },
    EXIST_SERVICE: {
        code: "D507",
        keyword: ["Service exist"],
        description: "The contract already contains the service.",
        subject: ""
    },
    EXIST_STATE: {
        code: "D508",
        keyword: ["State exist"],
        description: "The state already exists on the blockchain.",
        subject: ""
    },
};
const assignCodeFromErrorMessage = (errorMessage) => {
    const findCode = (codeSet, errorMessage) => {
        return Object.values(codeSet)
            .filter((obj) => obj.keyword.length > 0 && obj.keyword[0] !== "")
            .filter((obj) => obj.keyword.some((keyword) => errorMessage.includes(keyword)))
            .map((obj) => obj.code);
    };
    let pcodeArr = findCode(PCODE, errorMessage);
    let dcodeArr = findCode(DCODE, errorMessage);
    pcodeArr.length === 0 && pcodeArr.push(PCODE.UNDEFINED.code);
    dcodeArr.length === 0 && dcodeArr.push(DCODE.UNDEFINED.code);
    if (dcodeArr.includes(DCODE.CA_DISALLOW.code)) {
        dcodeArr = [DCODE.CA_DISALLOW.code];
    }
    else if (dcodeArr.length > 1) {
        dcodeArr = [DCODE.COMPLEX.code];
    }
    if (pcodeArr.includes(PCODE.IV_BASE_NODE_OP.code)) {
        pcodeArr = [PCODE.IV_BASE_NODE_OP.code];
    }
    else if (pcodeArr.length > 1) {
        pcodeArr = [PCODE.AMBIGUOUS.code];
    }
    return pcodeArr[0] + dcodeArr[0];
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
        return new MitumError(code ?? ECODE.UNKNOWN, msg);
    }
}
class Assert {
    constructor(condition, error) {
        this.condition = condition;
        this.error = error;
    }
    static get(condition, error) {
        return new Assert(condition, error ?? MitumError.new());
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
        return new StringAssert(s, error ?? MitumError.new());
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
class IP extends LongString {
    constructor(s) {
        super(s);
        Assert.check(/^(http|https):\/\/(?:[\w-]+\.)*[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/.test(s), MitumError.detail(ECODE.INVALID_IP, "invalid ip address, ip"));
    }
    static from(s) {
        return s instanceof IP ? s : new IP(s);
    }
}
class URIString {
    constructor(s, name) {
        Assert.check((/^[^\s:/?#\[\]@]*$/.test(s)), MitumError.detail(ECODE.INVALID_CHARACTER, `${name} must not contain: space / : ? # [ ] @`));
    }
}

class Generator {
    constructor(networkID, api, delegateIP) {
        this._networkID = networkID;
        this.setAPI(api);
        this.setDelegate(delegateIP);
    }
    setNetworkID(networkID) {
        this._networkID = networkID;
    }
    setAPI(api) {
        if (typeof api === "string") {
            this._api = IP.from(api.endsWith('/') ? api.slice(0, -1) : api);
        }
        else if (api instanceof IP) {
            this._api = api;
        }
        else {
            this._api = undefined;
        }
    }
    setDelegate(delegateIP) {
        if (typeof delegateIP === "string") {
            this._delegateIP = IP.from(delegateIP.endsWith('/') ? delegateIP.slice(0, -1) : delegateIP);
        }
        else if (delegateIP instanceof IP) {
            this._delegateIP = delegateIP;
        }
        else {
            this._delegateIP = undefined;
        }
    }
    get networkID() {
        return this._networkID;
    }
    get api() {
        return this._api ? this._api.toString() : undefined;
    }
    get delegateIP() {
        return this._delegateIP ? this._delegateIP.toString() : undefined;
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
    overZero() {
        return this.big > 0;
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

class TimeStamp {
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
}
class FullTimeStamp extends TimeStamp {
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
        value: min == (max ?? min) ? min : undefined,
        min,
        max: max ?? min,
        satisfy: (target) => min <= target && target <= (max ?? min),
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
        DEFAULT: getRangeConfig(45),
        ZERO: getRangeConfig(8, 15),
        NODE: getRangeConfig(4, Number.MAX_SAFE_INTEGER),
    },
    KEYS_IN_ACCOUNT: getRangeConfig(1, 100),
    AMOUNTS_IN_ITEM: getRangeConfig(1, 10),
    ITEMS_IN_FACT: getRangeConfig(1, 100),
    OP_SIZE: getRangeConfig(1, 262144),
    KEY: {
        MITUM: {
            PRIVATE: getRangeConfig(67),
            PUBLIC: getRangeConfig(69),
        }
    },
    STORAGE: {
        PROJECT: getRangeConfig(1, 10),
        DATA_KEY: getRangeConfig(1, 200),
        DATA_VALUE: getRangeConfig(1, 20000)
    }
};

var CURRENCY = {
    KEY: "mitum-currency-key",
    KEYS: "mitum-currency-keys",
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
        ITEM: "mitum-extension-create-contract-account-multiple-amounts",
        FACT: "mitum-extension-create-contract-account-operation-fact",
        OPERATION: "mitum-extension-create-contract-account-operation",
    },
    WITHDRAW: {
        ITEM: "mitum-extension-contract-account-withdraw-multi-amounts",
        FACT: "mitum-extension-withdraw-operation-fact",
        OPERATION: "mitum-extension-withdraw-operation",
    },
    UPDATE_HANDLER: {
        FACT: "mitum-extension-update-handler-operation-fact",
        OPERATION: "mitum-extension-update-handler-operation",
    }
};

var STORAGE = {
    REGISTER_MODEL: {
        FACT: "mitum-storage-register-model-operation-fact",
        OPERATION: "mitum-storage-register-model-operation",
    },
    CREATE_DATA: {
        FACT: "mitum-storage-create-data-operation-fact",
        OPERATION: "mitum-storage-create-data-operation",
    },
    CREATE_DATAS: {
        ITEM: "mitum-storage-create-datas-item",
        FACT: "mitum-storage-create-datas-operation-fact",
        OPERATION: "mitum-storage-create-datas-operation",
    },
    DELETE_DATA: {
        FACT: "mitum-storage-delete-data-operation-fact",
        OPERATION: "mitum-storage-delete-data-operation",
    },
    UPDATE_DATA: {
        FACT: "mitum-storage-update-data-operation-fact",
        OPERATION: "mitum-storage-update-data-operation",
    },
    UPDATE_DATAS: {
        ITEM: "mitum-storage-update-datas-item",
        FACT: "mitum-storage-update-datas-operation-fact",
        OPERATION: "mitum-storage-update-datas-operation",
    },
};

var HINT = {
    FACT_SIGN: "base-fact-sign",
    CURRENCY,
    STORAGE,
};

const KEY = {
    MITUM: {
        PRIVATE: "fpr",
        PUBLIC: "fpu",
    },
};
const ADDRESS = {
    MITUM: "fca",
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

class Token {
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
}

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
        Assert.check(this.big.big > 0, MitumError.detail(ECODE.INVALID_AMOUNT, "amount must be over zero"));
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

const SortFunc = (a, b) => Buffer.compare(a.toBuffer(), b.toBuffer());

const hasOverlappingAddress = (arr) => (new Set(arr.map(a => a instanceof Address ? a.toString() : a)).size == arr.length);

const sha256 = (msg) => Buffer.from(sha256$1(msg));
const sha3 = (msg) => Buffer.from(sha3_256.create().update(msg).digest());
const keccak256 = (msg) => Buffer.from(keccak256$1.create().update(msg).digest());
const getChecksum = (hex) => {
    const hexLower = hex.toLowerCase();
    const hash = keccak256(Buffer.from(hexLower, 'ascii')).toString('hex');
    let checksum = '';
    for (let i = 0; i < hexLower.length; i++) {
        if (parseInt(hash[i], 16) > 7) {
            checksum += hexLower[i].toUpperCase();
        }
        else {
            checksum += hexLower[i];
        }
    }
    return checksum;
};

const delegateUri = (delegateIP) => `${delegateIP}?uri=`;
const validatePositiveInteger = (val, name) => {
    if (!Number.isSafeInteger(val) || val < 0) {
        throw new Error(`${name} must be a integer >= 0`);
    }
};
const isNumberTuple = (arr) => {
    return Array.isArray(arr) && arr.length === 2 && typeof arr[0] === 'number' && typeof arr[1] === 'number';
};
const apiPathWithParams = (apiPath, limit, offset, reverse) => {
    let query1;
    let query2;
    let query3;
    if (limit !== undefined) {
        validatePositiveInteger(limit, "limit");
        query1 = `limit=${limit}`;
    }
    if (offset !== undefined) {
        validatePositiveInteger(offset, "offset");
        query2 = `offset=${offset}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw new Error("reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query;
};
const apiPathWithHashParams = (apiPath, factHash, limit, offset, reverse) => {
    let hash;
    let query1;
    let query2;
    let query3;
    if (factHash !== undefined) {
        if (typeof (factHash) !== "string") {
            {
                throw new Error("factHash must be a string");
            }
        }
        hash = `facthash=${factHash}`;
    }
    if (limit !== undefined) {
        validatePositiveInteger(limit, "limit");
        query1 = `limit=${limit}`;
    }
    if (offset !== undefined) {
        validatePositiveInteger(offset, "offset");
        query2 = `offset=${offset}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw new Error("reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [hash, query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query;
};
const apiPathWithParamsExt = (apiPath, limit, offset, reverse) => {
    let query1;
    let query2;
    let query3;
    if (limit !== undefined) {
        validatePositiveInteger(limit, "limit");
        query1 = `limit=${limit}`;
    }
    if (offset !== undefined) {
        if (!isNumberTuple(offset)) {
            throw new Error("offset must be a tuple with number");
        }
        validatePositiveInteger(offset[0], "offset element");
        validatePositiveInteger(offset[1], "offset element");
        query2 = `offset=${offset[0]},${offset[1]}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw new Error("reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query;
};

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
        return {
            ...super.toHintedObject(),
            node: this.node.toString(),
        };
    }
}

let Operation$1 = class Operation {
    constructor(networkID, fact) {
        this.id = networkID;
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
        privateKey = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey(privateKey);
        const sigType = this.factSignType;
        if (sigType === "NodeFactSign") {
            Assert.check(option !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address in sign option"));
        }
        const factSign = this.signWithSigType(sigType, keypair, option ? new NodeAddress(option.node ?? "") : undefined);
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
            const now = TimeStamp.new();
            return new GeneralFactSign(keypair.publicKey, keypair.sign(Buffer.concat([Buffer.from(this.id), hash, now.toBuffer()])), now.toString());
        };
        const getNodeFactSign = (node, keypair, hash) => {
            const now = TimeStamp.new();
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
        const operation = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        };
        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(SortFunc);
        return {
            ...operation,
            signs: factSigns.map(fs => fs.toHintedObject())
        };
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
        this.token = new Token(token);
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
        Assert.check(Config.ITEMS_IN_FACT.satisfy(items.length), MitumError.detail(ECODE.INVALID_ITEMS, "length of items is out of range"));
        hint !== "mitum-nft-mint-operation-fact" ? Assert.check(new Set(items.map(i => i.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate items found"))
            : null;
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
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            items: this.items.sort(SortFunc).map(i => i.toHintedObject()),
        };
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
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
        };
    }
}
class NodeFact extends Fact {
    constructor(hint, token) {
        super(hint, token);
    }
}

const isOpFact = (operation) => {
    return operation instanceof Operation$1;
};
const isHintedObject = (object) => {
    return '_hint' in object && 'fact' in object && 'hash' in object;
};
const isSuccessResponse = (response) => {
    return 'data' in response;
};

class BaseAddress {
    constructor(s, type) {
        this.s = s;
        if (type) {
            this.type = type;
        }
        else if (this.s.endsWith(SUFFIX.ADDRESS.MITUM)) {
            this.type = "mitum";
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
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS_TYPE, `The address must be starting with '0x' and ending with '${SUFFIX.ADDRESS.MITUM}'`))
            .startsWith('0x')
            .endsWith(SUFFIX.ADDRESS.MITUM)
            .excute();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS, "The address must be a 45-character string"))
            .empty().not()
            .satisfyConfig(Config.ADDRESS.DEFAULT)
            .excute();
        Assert.check(/^[0-9a-fA-F]+$/.test(s.slice(2, 42)), MitumError.detail(ECODE.INVALID_ADDRESS, `${s.slice(2, 42)} is not a hexadecimal number`));
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_ADDRESS_CHECKSUM, "bad address checksum"))
            .equal('0x' + getChecksum(s.slice(2, 42)) + SUFFIX.ADDRESS.MITUM)
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

class Key {
    constructor(s) {
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_KEY, "invalid key"))
            .empty().not()
            .chainOr(s.endsWith(SUFFIX.KEY.MITUM.PRIVATE), s.endsWith(SUFFIX.KEY.MITUM.PUBLIC))
            .excute();
        if (s.endsWith(SUFFIX.KEY.MITUM.PRIVATE)) {
            StringAssert.with(s, MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "invalid private key"))
                .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PRIVATE) && Config.KEY.MITUM.PRIVATE.satisfy(s.length), /^[0-9a-f]+$/.test(s.substring(0, s.length - Config.SUFFIX.DEFAULT.value)))
                .excute();
        }
        else {
            StringAssert.with(s, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid public key"))
                .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PUBLIC) && Config.KEY.MITUM.PUBLIC.satisfy(s.length), /^[0-9a-f]+$/.test(s.substring(0, s.length - Config.SUFFIX.DEFAULT.value)))
                .excute();
        }
        this.key = s.substring(0, s.length - Config.SUFFIX.DEFAULT.value);
        this.suffix = s.substring(s.length - Config.SUFFIX.DEFAULT.value);
        this.type = "mitum";
        this.isPriv = s.endsWith(SUFFIX.KEY.MITUM.PRIVATE);
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
        const s = key.toString();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid public key"))
            .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PUBLIC))
            .excute();
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
        const _sum = this._keys.reduce((total, key) => total + key.weight.v, 0);
        Assert.check(this.threshold.v <= _sum, MitumError.detail(ECODE.INVALID_KEYS, `sum of weights under threshold, ${_sum} < ${this.threshold.v}`));
        Assert.check(Config.THRESHOLD.satisfy(this.threshold.v), MitumError.detail(ECODE.INVALID_KEYS, "threshold out of range"));
        Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, MitumError.detail(ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    get checksum() {
        const address = keccak256(this.toBuffer()).subarray(12).toString('hex');
        const hash = keccak256(Buffer.from(address, 'ascii')).toString('hex');
        let checksumAddress = '0x';
        for (let i = 0; i < address.length; i++) {
            if (parseInt(hash[i], 16) > 7) {
                checksumAddress += address[i].toUpperCase();
            }
            else {
                checksumAddress += address[i];
            }
        }
        // use mitum SUFFIX temporarily
        return new Address(checksumAddress + SUFFIX.ADDRESS.MITUM);
    }
    toBuffer() {
        return Buffer.concat([
            Buffer.concat(this._keys.sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer()))).map(k => k.toBuffer())),
            this.threshold.toBuffer("fill")
        ]);
    }
    toHintedObject() {
        const eHash = keccak256$1(this.toBuffer());
        return {
            _hint: Keys.hint.toString(),
            hash: eHash.slice(24),
            keys: this._keys
                .sort((a, b) => Buffer.compare(Buffer.from(a.toString()), Buffer.from(b.toBuffer())))
                .map((k) => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
Keys.hint = new Hint(HINT.CURRENCY.KEYS);

const defaultPath = "m/44'/1'/0'/0/0";

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
    return getPublicKey(privateBuf, false);
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
        secp256k1.utils.hmacSha256Sync = (key, ...msgs) => hmac(sha256$1, key, secp256k1.utils.concatBytes(...msgs));
        secp256k1.utils.sha256Sync = (...msgs) => sha256$1(secp256k1.utils.concatBytes(...msgs));
    }
    static random(option) {
        return this.generator.random(option);
    }
    static fromSeed(seed, option) {
        return this.generator.fromSeed(seed, option);
    }
    static fromPrivateKey(key) {
        const s = key.toString();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_PRIVATE_KEY, "invalid private key"))
            .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PRIVATE)).excute();
        return this.generator.fromPrivateKey(key);
    }
    static hdRandom(option) {
        return this.generator.hdRandom(option);
    }
    static fromPhrase(phrase, path, option) {
        return this.generator.fromPhrase(phrase, path, option);
    }
    ethSign(msg) {
        const ec$1 = new ec("secp256k1");
        const key = ec$1.keyFromPrivate(this.privateKey.noSuffix, "hex");
        const msgHash = crypto.createHash("sha256").update(msg).digest();
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
        return secp256k1.verify(buf, sha256(msg), secp256k1.getPublicKey(this.signer, true));
    }
    static K(seed) {
        seed = Buffer.from(base58.encode(sha3(Buffer.from(seed))));
        Assert.check(40 <= seed.length, MitumError.detail(ECODE.INVALID_SEED, "seed length out of range"));
        seed = seed.subarray(0, 40);
        const N = secp256k1.CURVE.n - BigInt(1);
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
        return Buffer.from(this.privateKey.noSuffix, "hex");
    }
    getPub() {
        const publickeyBuffer = privateKeyToPublicKey("0x" + this.privateKey.noSuffix);
        return new Key(compress(publickeyBuffer) + SUFFIX.KEY.MITUM.PUBLIC);
    }
    sign(msg) {
        return this.ethSign(msg);
    }
    verify(sig, msg) {
        return this.ethVerify(sig, msg);
    }
}
KeyPair.generator = {
    fillHDAccount(kp, wallet) {
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: "",
            phrase: wallet.mnemonic?.phrase,
            path: wallet.path
        };
    },
    random() {
        return new KeyPair(Wallet.createRandom().privateKey.substring(2) + SUFFIX.KEY.MITUM.PRIVATE);
    },
    fromSeed(seed) {
        StringAssert.with(seed, MitumError.detail(ECODE.INVALID_SEED, "seed length out of range"))
            .satisfyConfig(Config.SEED)
            .excute();
        return new KeyPair(BaseKeyPair.K(seed).toString(16) + SUFFIX.KEY.MITUM.PRIVATE);
    },
    fromPrivateKey(key) {
        return new KeyPair(key);
    },
    hdRandom() {
        try {
            const wallet = HDNodeWallet.createRandom("", defaultPath);
            const kp = new KeyPair(wallet.privateKey.substring(2) + SUFFIX.KEY.MITUM.PRIVATE);
            return this.fillHDAccount(kp, wallet);
        }
        catch (error) {
            Assert.check(false, MitumError.detail(ECODE.UNKNOWN, `unknown error occur during HDNodeWallet.createRandom(), ${error.shortMessage}`));
            throw error;
        }
    },
    fromPhrase(phrase, path) {
        try {
            const wallet = HDNodeWallet.fromPhrase(phrase, "", path ? path : defaultPath);
            const kp = new KeyPair(wallet.privateKey.substring(2) + SUFFIX.KEY.MITUM.PRIVATE);
            return this.fillHDAccount(kp, wallet);
        }
        catch (error) {
            if (error.argument === 'mnemonic') {
                Assert.check(false, MitumError.detail(ECODE.HDWALLET.INVALID_PHRASE, `invalid phrase, ${error.shortMessage}`));
            }
            else {
                Assert.check(false, MitumError.detail(ECODE.HDWALLET.INVALID_PATH, `invalid path, ${error.shortMessage} with value ${error.value}`));
            }
            throw error;
        }
    }
};

function getRandomN(n, f) {
    Assert.check(Config.KEYS_IN_ACCOUNT.satisfy(n), MitumError.detail(ECODE.INVALID_KEYS, `${n} is out of range`));
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
    fillHDwallet(hdwallet) {
        return {
            privatekey: hdwallet.privatekey,
            publickey: hdwallet.publickey,
            address: this.address(hdwallet.publickey),
            phrase: hdwallet.phrase,
            path: hdwallet.path,
        };
    }
    /**
     * Generate a key pair randomly or from the given string seed. Avoid using seed ​​that are easy to predict.
     * @param {string} [seed] - (Optional) The random string seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @returns An `Account` object with following properties:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     */
    key(seed) {
        if (!seed) {
            const kp = KeyPair.random("mitum");
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey),
            };
        }
        const kp = KeyPair.fromSeed(seed, "mitum");
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.address(kp.publicKey),
        };
    }
    /**
     * Generate `n` length of array with randomly generated key pairs.
     * @param {number} [n] - The number of accounts to generate.
     * @returns An array of `Account` objects.
     * Properties of `Account`:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     */
    keys(n) {
        return randomN(n, "mitum").keypairs.map(kp => {
            return {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: this.address(kp.publicKey),
            };
        });
    }
    /**
     * Generate a key randomly using the HD wallet method. (BIP-32 standard)
     * @returns An `HDAccount` object with following properties:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address,
     * - `phrase`: phrases made up of 12 mnemonic words,
     * - `path`: derivation path for HD wallet. Default set to "m/44'/1'/0'/0/0"
     */
    hdKey() {
        const hdwallet = KeyPair.hdRandom("mitum");
        return this.fillHDwallet(hdwallet);
    }
    /**
     * Generate a key pair from the given private key.
     * @param {string | Key} [key] - The private key.
     * @returns An `Account` object with following properties:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     */
    fromPrivateKey(key) {
        const kp = KeyPair.fromPrivateKey(key);
        return {
            privatekey: kp.privateKey.toString(),
            publickey: kp.publicKey.toString(),
            address: this.address(kp.publicKey),
        };
    }
    /**
     * Generate a key pair from given mnemonic phrase using the HD wallet method.
     * @param {string} [phrase] - The Mnemonic phrase obtained when executed `hdKey()` method.
     * @param {string} [path] - (Optional) The derivation path for HD wallet.
     * @returns An `HDAccount` object with following properties:
     * - `privatekey`: private key,
     * - `publickey`: public key,
     * - `address`: address
     * - `phrase`: phrases made up of 12 mnemonic words,
     * - `path`: derivation path for HD wallet, default set to "m/44'/1'/0'/0/0"
     */
    fromPhrase(phrase, path) {
        const hdwallet = KeyPair.fromPhrase(phrase, path);
        return this.fillHDwallet(hdwallet);
    }
    /**
     * Generate an address derived the given public key.
     * @param {string | Key} [key] - The public key.
     * @returns The address derived from public key
     */
    address(key) {
        const suffix = key.toString().slice(-3);
        Assert.check(suffix === "fpu", MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid pubkey format"));
        return new Keys([new PubKey(key, 100)], 100).checksum.toString();
    }
    /**
     * Returns a checksummed address for given address string. For invalid address, an error is returned.
     * @param {string} [address] - An address.
     * @returns A checksummed address.
     */
    checksummedAddress(address) {
        try {
            const valid_address = new Address(address);
            return valid_address.toString();
        }
        catch (error) {
            if (error.code === 'EC_INVALID_ADDRESS_CHECKSUM') {
                return '0x' + getChecksum(address.slice(2, 42)) + SUFFIX.ADDRESS.MITUM;
            }
            else {
                throw error;
            }
        }
    }
    /**
     * Generate a multi-signature address from the given keys.
     * @param {keysType} [keys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | number | Big} [threshold] - The threshold for the multi-signature.
     * @returns The multi-signature address.
     * @example
     * const pubkey01 = {
     *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14fpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22fpu",
     *     weight: 50
     * };
     * const mutiSigAddress = mitum.account.addressForMultiSig([pubkey01, pubkey02], 100);
     */
    addressForMultiSig(keys, threshold) {
        return new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold).checksum.toString();
    }
}

async function getAccount(api, address, delegateIP) {
    const apiPath = `${api}/account/${Address.from(address).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAccountByPublicKey(api, publicKey, delegateIP) {
    const apiPath = `${api}/accounts?publickey=${Key.from(publicKey).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var account = {
    getAccount,
    getAccountByPublicKey,
};

async function getBlocks(api, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParams(`${api}/block/manifests`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getBlockByHeight(api, height, delegateIP) {
    const apiPath = `${api}/block/${Big.from(height).toString()}/manifest`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getBlockByHash(api, hash, delegateIP) {
    const apiPath = `${api}/block/${hash}/manifest`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var block = {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
};

async function getNode(api, delegateIP) {
    const apiPath = `${api}/`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var node = {
    getNode,
};

async function getOperations(api, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParamsExt(`${api}/block/operations`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getOperation(api, hash, delegateIP) {
    const apiPath = `${api}/block/operation/${hash}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getBlockOperationsByHeight(api, height, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParams(`${api}/block/${Big.from(height).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
// async function getBlockOperationsByHash(api: string | undefined, hash: string, delegateIP: string | undefined) {
//     const apiPath = `${api}/block/${hash}/operations`;
//     return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath))  
// }
async function getAccountOperations(api, address, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParamsExt(`${api}/account/${Address.from(address).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function send(api, operation, delegateIP, config) {
    const apiPath = `${api}/builder/send`;
    return !delegateIP
        ? await fetchAxios.post(apiPath, JSON.stringify(operation), config)
        : await fetchAxios.post(delegateIP.toString(), { ...Object(operation), uri: apiPath }, config);
}
var api$1 = {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    // getBlockOperationsByHash,
    getAccountOperations,
    send
};

async function getCurrencies(api, delegateIP) {
    const apiPath = `${api}/currency`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCurrency(api, currency, delegateIP) {
    const apiPath = `${api}/currency/${CurrencyID.from(currency).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var currency$1 = {
    getCurrencies,
    getCurrency,
};

const url$7 = (api, contract) => `${api}/nft/${Address.from(contract).toString()}`;
async function getNFT(api, contract, nftIdx, delegateIP) {
    const apiPath = `${url$7(api, contract)}/nftidx/${nftIdx}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getNFTs(api, contract, delegateIP, factHash, limit, offset, reverse) {
    const apiPath = apiPathWithHashParams(`${url$7(api, contract)}/nfts`, factHash, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getNFTCount(api, contract, delegateIP) {
    const apiPath = `${url$7(api, contract)}/totalsupply`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getModel$6(api, contract, delegateIP) {
    const apiPath = `${url$7(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAccountOperators(api, contract, account, delegateIP) {
    const apiPath = `${url$7(api, contract)}/account/${Address.from(account).toString()}/allapproved`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var nft = {
    getNFT,
    getNFTs,
    getNFTCount,
    getModel: getModel$6,
    getAccountOperators,
};

const url$6 = (api, contract) => `${api}/did/${Address.from(contract).toString()}`;
async function getModel$5(api, contract, delegateIP) {
    const apiPath = `${url$6(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCredential(api, contract, templateID, credentialID, delegateIP) {
    const apiPath = `${url$6(api, contract)}/template/${templateID}/credential/${credentialID}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getTemplate(api, contract, templateID, delegateIP) {
    const apiPath = `${url$6(api, contract)}/template/${templateID}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCredentials(api, contract, templateID, delegateIP) {
    const apiPath = `${url$6(api, contract)}/template/${templateID}/credentials`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCredentialByHolder(api, contract, holder, delegateIP) {
    const apiPath = `${url$6(api, contract)}/holder/${Address.from(holder).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var credential = {
    getModel: getModel$5,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
};

const url$5 = (api, contract) => `${api}/dao/${Address.from(contract).toString()}`;
async function getModel$4(api, contract, delegateIP) {
    const apiPath = `${url$5(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getProposal(api, contract, proposalID, delegateIP) {
    const apiPath = `${url$5(api, contract)}/proposal/${proposalID}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getApproved(api, contract, proposalID, registrant, delegateIP) {
    const apiPath = `${url$5(api, contract)}/proposal/${proposalID}/registrant/${Address.from(registrant).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getVoters(api, contract, proposalID, delegateIP) {
    const apiPath = `${url$5(api, contract)}/proposal/${proposalID}/voter`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getVotingStatus(api, contract, proposalID, delegateIP) {
    const apiPath = `${url$5(api, contract)}/proposal/${proposalID}/votingpower`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var dao = {
    getModel: getModel$4,
    getProposal,
    getApproved,
    getVoters,
    getVotingStatus,
};

var kyc = {};

const url$4 = (api, contract) => `${api}/sto/${Address.from(contract).toString()}`;
async function getService(api, contract, delegateIP) {
    const apiPath = `${url$4(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getPartitions(api, contract, holder, delegateIP) {
    const apiPath = `${url$4(api, contract)}/holder/${Address.from(holder).toString()}/partitions`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getBalanceByHolder(api, contract, holder, partition, delegateIP) {
    const apiPath = `${url$4(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getOperatorsByHolder(api, contract, holder, partition, delegateIP) {
    const apiPath = `${url$4(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getPartitionBalance(api, contract, partition, delegateIP) {
    const apiPath = `${url$4(api, contract)}/p
    artition/${partition}/balance`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAuthorized(api, contract, operator, delegateIP) {
    const apiPath = `${url$4(api, contract)}/operator/${Address.from(operator).toString()}/holders`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var sto = {
    getService,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
};

const url$3 = (api, contract) => `${api}/timestamp/${Address.from(contract).toString()}`;
async function getModel$3(api, contract, delegateIP) {
    const apiPath = `${url$3(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getTimeStamp(api, contract, projectID, timestampIdx, delegateIP) {
    const apiPath = `${url$3(api, contract)}/project/${projectID}/idx/${Big.from(timestampIdx).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var timestamp = {
    getModel: getModel$3,
    getTimeStamp,
};

const url$2 = (api, contract) => `${api}/token/${Address.from(contract).toString()}`;
async function getModel$2(api, contract, delegateIP) {
    const apiPath = `${url$2(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getTokenBalance(api, contract, account, delegateIP) {
    const apiPath = `${url$2(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var token = {
    getModel: getModel$2,
    getTokenBalance,
};

const url$1 = (api, contract) => `${api}/point/${Address.from(contract).toString()}`;
async function getModel$1(api, contract, delegateIP) {
    const apiPath = `${url$1(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getPointBalance(api, contract, account, delegateIP) {
    const apiPath = `${url$1(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var point = {
    getModel: getModel$1,
    getPointBalance,
};

const url = (api, contract) => `${api}/storage/${Address.from(contract).toString()}`;
async function getModel(api, contract, delegateIP) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getData(api, contract, dataKey, delegateIP) {
    const apiPath = `${url(api, contract)}/datakey/${dataKey}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getDataHistory(api, contract, dataKey, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParams(`${url(api, contract)}/datakey/${dataKey}/history`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getDataCount(api, contract, delegateIP, deleted) {
    const apiPath = `${url(api, contract)}/datacount?deleted=${deleted ? 1 : 0}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var storage = {
    getModel,
    getData,
    getDataHistory,
    getDataCount
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
        storage
    },
};

const currency = models.currency;
const contractApi = models.contract;
var api = {
    account,
    block,
    node,
    operation: api$1,
    currency,
    contractApi,
};
async function getAPIData(f, _links) {
    try {
        const res = await f();
        const parsedResponse = {
            status: res.status,
            method: res.config.method,
            url: res.config.url,
            request_body: res.config.data,
            data: _links ? { _embedded: res.data._embedded, _links: res.data._links } : res.data._embedded,
        };
        return parsedResponse;
    }
    catch (error) {
        if (error.response) {
            const { response } = error;
            const parsedError = {
                status: response.status,
                method: response.config.method,
                url: response.config.url,
                error_code: response.config.method === 'get' ? '' : response.data ? assignCodeFromErrorMessage(response.data) : '',
                request_body: response.config.data,
                error_message: response.data,
            };
            return parsedError;
        }
        else if (error.code) {
            const parsedError = {
                status: 500,
                method: error.config.method,
                url: error.config.url,
                error_code: "",
                request_body: error.config.data,
                error_message: error.code,
            };
            return parsedError;
        }
        else {
            throw new Error(`Unknown error orccur!\n${error}`);
        }
    }
}

class Node extends Generator {
    constructor(api, delegateIP) {
        super("", api, delegateIP);
    }
    /**
     * Get information about the nodes in the network.
     * @async
     * @returns The `data` of `SuccessResponse` represents an array of information of nodes:
     * - `network_id`: The ID of the network to which the node belongs.
     * - `last_manifest`: Information about the most recently created block.
     * - `network_policy`: Policy information of the network.
     * - `local`: Information about the local node.
     * - `consensus`: Status of consensus on the node.
     * - `_hint`: Indicates that the data represents node information.
     */
    async getNodeInfo() {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => node.getNode(this.api, this.delegateIP));
    }
}
class Block extends Generator {
    constructor(api, delegateIP) {
        super("", api, delegateIP);
    }
    /**
     * Get the account information for the given public key.
     * @async
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns The `data` of `SuccessResponse` is a array with block manifest info object:
     * - `_hint`: Indicates mitum engine version,
     * - `_embedded`:
     * - - `Manifest`: manifest info includes `proposed_at`, `states_tree`, `hash`, `previous`, `proposal`, `operations_tree`, `suffrage`, `_hint`, `height`. </div/>
     * - - `operations`: number of operations included in the block,
     * - - `confirmed_at`: timestamp,
     * - - `proposer`: node name of proposer,
     * - - `round`: number of round to manifest,
     * - `_links`: links to get additional information
     */
    async getAllBlocks(limit, offset, reverse) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => block.getBlocks(this.api, this.delegateIP, limit, offset, reverse));
    }
    /**
     * Get information of a block by hash.
     * @async
     * @param {string} [hash] - The hash value of the block to retrieve.
     * @returns The `data` of `SuccessResponse` represents a block manifest:
     * - `Manifest`:
     * - - `proposed_at`: Timestamp when the block was proposed,
     * - - `states_tree`: Hash for state tree,
     * - - `hash`: Hash for the block,
     * - - `previous`: Hash for the previous block,
     * - - `proposal`: Hash for the proposal,
     * - - `operations_tree`: Hash for the operation tree,
     * - - `suffrage`: Hash for the suffrage,
     * - - `_hint`: Hint for the manifest,
     * - - `height`: Block height
     * - `operations`: The number of operations included in the block,
     * - `confirmed_at`: Timestamp when the block was confirmed,
     * - `proposer`: The node name of proposer,
     * - `round`: The number of round to manifest
     */
    async getBlockByHash(hash) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => block.getBlockByHash(this.api, hash, this.delegateIP));
    }
    /**
     * Get information of a block by height.
     * @async
     * @param {number | string} [height] - The height of the block to retrieve.
     * @returns The `data` of `SuccessResponse` represents a block manifest:
     * - `Manifest`:
     * - - `proposed_at`: Timestamp when the block was proposed,
     * - - `states_tree`: Hash for state tree,
     * - - `hash`: Hash for the block,
     * - - `previous`: Hash for the previous block,
     * - - `proposal`: Hash for the proposal,
     * - - `operations_tree`: Hash for the operation tree,
     * - - `suffrage`: Hash for the suffrage,
     * - - `_hint`: Hint for the manifest,
     * - - `height`: Block height
     * - `operations`: The number of operations included in the block,
     * - `confirmed_at`: Timestamp when the block was confirmed,
     * - `proposer`: The node name of proposer,
     * - `round`: The number of round to manifest
     */
    async getBlockByHeight(height) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => block.getBlockByHeight(this.api, height, this.delegateIP));
    }
    // async getOperationsByHash(hash: string) {
    //     Assert.check(
    //         this.api !== undefined || this.api !== null,
    //         MitumError.detail(ECODE.NO_API, "no api"),
    //     )
    //     return await getAPIData(() => operation.getBlockOperationsByHash(this.api, hash, this.delegateIP))
    // }
    /**
     * Get all operations contained in a block of given height.
     * @async
     * @param {number | string} [height] - The height of the block to retrieve operations from.
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns The `data` of `SuccessResponse` represents an array of all operations in the block:
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
     */
    async getOperationsByHeight(height, limit, offset, reverse) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => api$1.getBlockOperationsByHeight(this.api, height, this.delegateIP, limit, offset, reverse));
    }
}

class Utils {
    constructor(decimal = 9) {
        this.decimal = decimal;
    }
    /**
     * Sets the decimal value used for unit conversions.
     * @param {number} decimal - The decimal places to be used, input integer must equal or greater than 0.
     */
    setDecimal(decimal) {
        Assert.check(Number.isInteger(decimal) && decimal >= 0, MitumError.detail(ECODE.INVALID_DECIMAL, "Invalid decimal number"));
        this.decimal = decimal;
    }
    /**
     * Validates if a string can be converted to a BigInt.
     * @param {string} value - The value to be validated.
     * @returns {boolean} - True if valid, false otherwise.
     */
    isValidBigIntString(value) {
        try {
            BigInt(value);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Validates if a string is a valid decimal number.
     * @param {string} value - The value to be validated.
     * @returns {boolean} - True if valid, false otherwise.
     */
    isValidDecimalString(value) {
        const decimalPattern = /^-?\d+(\.\d+)?$/;
        return decimalPattern.test(value);
    }
    /**
     * Converts integer string *value* into a "decimal string", assuming decimal places.
     * The `decimal` number can be set with `setDecimal()` and the default value is 9.
     * @param {string} value - Integer in string type.
     * @returns {string} - Value expressed in minimum units.
     * @example
     * // Example: Convert PAGE to FACT (decimal: 9)
     * const value = "20000000000"; //PAGE
     * const result = mitum.utils.formatUnits(value);
     * console.log(`PAGE to FACT: ${result}`); // "20.0"
     */
    formatUnits(value) {
        Assert.check(this.isValidBigIntString(value), MitumError.detail(ECODE.INVALID_BIG_INTEGER, "Invalid BigNumberish string: Cannot convert to a BigInt"));
        const bigIntVal = BigInt(value);
        const factor = BigInt(10 ** this.decimal);
        const integerPart = bigIntVal / factor;
        const integerString = integerPart === 0n && bigIntVal < 0n ? `-${integerPart.toString()}` : integerPart.toString();
        const fractionalPart = bigIntVal % factor < 0n ? -bigIntVal % factor : bigIntVal % factor;
        const fractionalString = fractionalPart.toString().padStart(this.decimal, '0');
        if (fractionalString === undefined || /^0*$/.test(fractionalString)) {
            return `${integerString}.0`;
        }
        else {
            return `${integerString}.${fractionalString.replace(/0+$/, '')}`;
        }
    }
    /**
     * Converts the "decimal string" *value* to a integer string, assuming decimal places.
     * The `decimal` number can be set with `setDecimal()` and the default value is 9.
     * @param {string} value - Decimal number in string type.
     * @returns {string} - Value expressed in basis units.
     * @example
     * // Example: Convert FACT to PAGE (decimal: 9)
     * const value = "12.12345"; //FACT
     * const result = mitum.utils.parseUnits(value);
     * console.log(`FACT to PAGE: ${result}`); // "12123450000"
     */
    parseUnits(value) {
        Assert.check(this.isValidDecimalString(value), MitumError.detail(ECODE.INVALID_FLOAT, "Invalid decimal string"));
        if (Number(value) === 0) {
            return "0";
        }
        let [integerPart, fractionalPart = ''] = value.split('.');
        fractionalPart = Number(fractionalPart) === 0 ? '' : fractionalPart;
        integerPart = Number(integerPart) === 0 ? '' : integerPart;
        Assert.check(fractionalPart.length <= this.decimal, MitumError.detail(ECODE.INVALID_FLOAT, "Fractional part exceeds the decimal limit"));
        const paddedFractional = fractionalPart.padEnd(this.decimal, '0');
        return integerPart + paddedFractional;
    }
}

class CurrencyItem extends Item {
    constructor(hint, amounts) {
        super(hint);
        Assert.check(Config.AMOUNTS_IN_ITEM.satisfy(amounts.length), MitumError.detail(ECODE.INVALID_AMOUNTS, "amounts length out of range"));
        Assert.check(new Set(amounts.map(am => am.currency.toString())).size === amounts.length, MitumError.detail(ECODE.INVALID_AMOUNTS, "duplicate amounts found in amounts"));
        this.amounts = amounts;
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            amounts: this.amounts.sort(SortFunc).map(am => am.toHintedObject()),
        };
    }
}

class CreateAccountItem extends CurrencyItem {
    constructor(keys, amounts) {
        super(HINT.CURRENCY.CREATE_ACCOUNT.ITEM, amounts);
        this.keys = keys;
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
        };
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
    constructor(token, sender, keys, currency) {
        super(HINT.CURRENCY.UPDATE_KEY.FACT, token);
        this.sender = Address.from(sender);
        this.keys = keys;
        this.currency = CurrencyID.from(currency);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.keys.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            keys: this.keys.toHintedObject(),
            currency: this.currency.toString(),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_KEY.OPERATION;
    }
}

class TransferItem extends CurrencyItem {
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
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
        };
    }
    toString() {
        return this.receiver.toString();
    }
}
class TransferFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CURRENCY.TRANSFER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.receiver.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with receiver address")));
    }
    get operationHint() {
        return HINT.CURRENCY.TRANSFER.OPERATION;
    }
}

class CreateContractAccountItem extends CurrencyItem {
    constructor(keys, amounts) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.ITEM, amounts);
        this.keys = keys;
    }
    toBuffer() {
        return Buffer.concat([
            this.keys.toBuffer(),
            Buffer.concat(this.amounts.sort(SortFunc).map(am => am.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
        };
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
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
        };
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

class UpdateHandlerFact extends Fact {
    constructor(token, sender, contract, currency, handlers) {
        super(HINT.CURRENCY.UPDATE_HANDLER.FACT, token);
        this.sender = Address.from(sender);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.handlers = handlers.map(a => Address.from(a));
        this._hash = this.hashing();
        Assert.check((this.handlers.length !== 0), MitumError.detail(ECODE.INVALID_FACT, "empty handlers"));
        Assert.check(hasOverlappingAddress(this.handlers), MitumError.detail(ECODE.INVALID_FACT, "duplicate address found in handlers"));
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.sender.toBuffer(),
            this.contract.toBuffer(),
            this.currency.toBuffer(),
            Buffer.concat(this.handlers.sort(SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            handlers: this.handlers.sort(SortFunc).map((w) => w.toString()),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_HANDLER.OPERATION;
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
        return {
            ...super.toHintedObject(),
            currency: this.design.toHintedObject(),
        };
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
        return {
            ...super.toHintedObject(),
            currency: this.currency.toString(),
            policy: this.policy.toHintedObject(),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_CURRENCY.OPERATION;
    }
}

class MintItem extends Item {
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
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toHintedObject(),
        };
    }
    toString() {
        return `${this.receiver.toString()}-${this.amount.currency.toString()}`;
    }
}
class MintFact extends NodeFact {
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
        return {
            ...super.toHintedObject(),
            items: this.items.sort(SortFunc).map(it => it.toHintedObject()),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.MINT.OPERATION;
    }
}

class CurrencyDesign {
    constructor(initialSupply, currencyID, genesisAccount, decimal, policy) {
        this.initialSupply = Big.from(initialSupply);
        this.currencyID = CurrencyID.from(currencyID);
        this.genesisAccount = Address.from(genesisAccount);
        this.policy = policy;
        this.totalSupply = Big.from(initialSupply);
        this.decimal = Big.from(decimal);
        Assert.check(0 < this.decimal.big, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_DESIGN, "decimal number must not be set to 0 or below"));
    }
    toBuffer() {
        return Buffer.concat([
            this.initialSupply.toBuffer(),
            this.currencyID.toBuffer(),
            this.decimal.toBuffer(),
            this.genesisAccount.toBuffer(),
            this.policy.toBuffer(),
            this.totalSupply.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: CurrencyDesign.hint.toString(),
            currency_id: this.currencyID.toString(),
            decimal: this.decimal.toString(),
            genesis_account: this.genesisAccount.toString(),
            initial_supply: this.initialSupply.toString(),
            policy: this.policy.toHintedObject(),
            total_supply: this.totalSupply.toString(),
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
            feeer: this.feeer.toHintedObject(),
            min_balance: this.newAccountMinBalance.toString(),
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
        const feeer = {
            ...super.toHintedObject(),
            amount: this.amount.toString(),
            receiver: this.receiver.toString(),
        };
        if (this.exchangeMinAmount) {
            return {
                ...feeer,
                exchange_min_amount: this.exchangeMinAmount.toString()
            };
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
        const feeer = {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            ratio: this.ratio.n,
            min: this.min.toString(),
            max: this.max.toString(),
        };
        if (this.exchangeMinAmount) {
            return {
                ...feeer,
                exchange_min_amount: this.exchangeMinAmount.toString(),
            };
        }
        return feeer;
    }
}

class Currency extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate a `register-currency` operation for registering a new currency.
     * **Signature of nodes** is required, not a general account signature.
     * @param {string | Address} [genesisAddress] - genesis account's address.
     * @param {string | number | Big} [initialSupply] - initial supply amount.
     * @param {string | CurrencyID} [currencyID] - currency ID to resgister.
     * @param {string | number | Big} [decimal] - decimal number for the currency.
     * @param {currencyPolicyData} [data] - The currency policy data.
     * @returns `register-currency` operation.
     */
    registerCurrency(genesisAddress, initialSupply, currencyID, decimal, data) {
        Address.from(genesisAddress);
        const keysToCheck = ['minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the currencyPolicyData structure`));
        });
        const design = new CurrencyDesign(initialSupply, currencyID, genesisAddress, decimal, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee));
        return new Operation$1(this.networkID, new RegisterCurrencyFact(TimeStamp.new().UTC(), design));
    }
    /**
     * Generate an `update-currency` operation for updating an existing Mitum currency.
     * **Signature of nodes** is required, not a general account signature.
     * @param {string | CurrencyID} [currency] - The currency ID to want to updated.
     * @param {currencyPolicyData} [data] - The currency policy data.
     * @returns `update-currency` operation.
     */
    updateCurrency(currency, data) {
        const keysToCheck = ['minBalance', 'feeType', 'feeReceiver'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the currencyPolicyData structure`));
        });
        return new Operation$1(this.networkID, new UpdateCurrencyFact(TimeStamp.new().UTC(), currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.ratio, data.minFee, data.maxFee)));
    }
    buildPolicy(feeType, minBalance, receiver, fee, ratio, min, max) {
        Address.from(receiver);
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
    /**
     * Generate a `transfer` operation for transferring currency between accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer` operation.
     */
    transfer(sender, receiver, currency, amount) {
        return new Operation$1(this.networkID, new TransferFact(TimeStamp.new().UTC(), sender, [
            new TransferItem(receiver, [new Amount(currency, amount)])
        ]));
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
    batchTransfer(sender, receivers, currency, amounts) {
        Assert.check(receivers.length !== 0 && amounts.length !== 0, MitumError.detail(ECODE.INVALID_LENGTH, "The array must not be empty."));
        Assert.check(receivers.length === amounts.length, MitumError.detail(ECODE.INVALID_LENGTH, "The lengths of the receivers and amounts must be the same."));
        return new Operation$1(this.networkID, new TransferFact(TimeStamp.new().UTC(), sender, receivers.map((receiver, idx) => new TransferItem(receiver, [new Amount(currency, amounts[idx])]))));
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
    withdraw(sender, target, currency, amount) {
        return new Operation$1(this.networkID, new WithdrawFact(TimeStamp.new().UTC(), sender, [
            new WithdrawItem(target, [new Amount(currency, amount)])
        ]));
    }
    /**
     * Generate a `mint` operation for minting currency and allocating it to a receiver.
     * **Signature of nodes** is required, not a general account signature.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {number} [amount] - The amount to mint.
     * @returns `mint` operation.
     */
    mint(receiver, currency, amount) {
        return new Operation$1(this.networkID, new MintFact(TimeStamp.new().UTC(), [
            new MintItem(receiver, new Amount(currency, amount))
        ]));
    }
    /**
     * Get a list of all currency in the blockchain network.
     * @async
     * @returns `data` of `SuccessResponse` is a array with currency id.
     */
    async getAllCurrencies() {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const response = await getAPIData(() => api.currency.getCurrencies(this.api, this.delegateIP), true);
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data._links ?
                Object.keys(response.data._links)
                    .filter(c => !(c === "self" || c === "currency:{currencyid}"))
                    .map(c => c)
                : null;
        }
        return response;
    }
    /**
     * Get currency information abount given currency ID.
     * @async
     * @param {string | CurrencyID} [currencyID] - The currency ID.
     * @returns `data` of `SuccessResponse` is currency information:
     * - `_hint`: Hint for currency design
     * - `initial_supply`: [Amount]
     * - `genesis_account`: Initial account for the currency.
     * - `policy`: Currency policy information including `min_balance`, `feeer`
     * - `total_supply`: Total supply amount of the currency.
     */
    async getCurrency(currencyID) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => api.currency.getCurrency(this.api, currencyID, this.delegateIP));
    }
}
class Account extends KeyG {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate a key pair and the corresponding `transfer` operation to create a single-sig account. Avoid using seed ​​that are easy to predict.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @param {string | number | Big} [weight] - (Optional) The weight for the public key. If not provided, the default value is 100.
     * @returns An object containing the wallet(key pair) and the `transfer` operation.
     */
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed, "mitum") : KeyPair.random("mitum");
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.checksum.toString()
            },
            operation: new Operation$1(this.networkID, new TransferFact(TimeStamp.new().UTC(), sender, [
                new TransferItem(ks.checksum, [new Amount(currency, amount)])
            ])),
        };
    }
    /**
     * Generate `n` number of key pairs and the corresponding `transfer` operation to create single-sig accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {number} [n] - The number of account to create.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns An object containing the wallet (key pairs) and the `transfer` operation.
     */
    createBatchWallet(sender, n, currency, amount) {
        const keyArray = this.keys(n);
        const items = keyArray.map((ks) => new TransferItem(ks.address, [new Amount(currency, amount)]));
        return {
            wallet: keyArray,
            operation: new Operation$1(this.networkID, new TransferFact(TimeStamp.new().UTC(), sender, items)),
        };
    }
    /**
     * Generate a `transfer` operation for the given public key.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Key | PubKey} [key] - The public key or key object.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns `transfer` operation.
     */
    createAccount(sender, key, currency, amount) {
        const ks = new Keys([new PubKey(key, 100)], 100);
        return new Operation$1(this.networkID, new TransferFact(TimeStamp.new().UTC(), sender, [
            new TransferItem(ks.checksum, [new Amount(currency, amount)])
        ]));
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
     *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14fpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22fpu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation$1(this.networkID, new CreateAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)])
        ]));
    }
    /**
     * Generate an `update-key` operation for replace the public keys involved in given address.
     *
     * `update-key` cannot be used for single-sig accounts and CA accounts.
     * @param {string | Address} [sender] - The target account's address.
     * @param {keysType} [newKeys] - An array of object {`key`: publickey, `weight`: weight for the key}
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-key` operation.
     * @example
     * // Example of parameter keys
     * const pubkey01 = {
     *     key: "02a2e69d8b819e25ac4931523b62995bf3361304093dc24f15658d88e72644d853fpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "03410a28d1d44974f3af2b12f6d23733a17ea30e2ecfbc413055a4543b28f16f45fpu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    updateKey(sender, newKeys, currency, threshold) {
        return new Operation$1(this.networkID, new UpdateKeyFact(TimeStamp.new().UTC(), sender, new Keys(newKeys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), currency));
    }
    /**
     * Sign and send the `transfer` operation to blockchain network to create single-sig account.
     * @async
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @param {Object} [wallet] - The object with properties `wallet` and `operation`. (return value of `createWallet`)
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
    async touch(privatekey, wallet) {
        const op = wallet.operation;
        op.sign(privatekey);
        return await new Operation(this.networkID, this.api, this.delegateIP).send(op);
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
    async getAccountInfo(address) {
        Address.from(address);
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const response = await getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response)) {
            response.data = response.data ? response.data : null;
        }
        return response;
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
    async getOperations(address, limit, offset, reverse) {
        Address.from(address);
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const response = await getAPIData(() => api.operation.getAccountOperations(this.api, address, this.delegateIP, limit, offset, reverse));
        if (isSuccessResponse(response)) {
            response.data = response.data ? response.data : null;
        }
        return response;
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
    async getByPublickey(publickey) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const s = typeof (publickey) === 'string' ? publickey : publickey.toString();
        StringAssert.with(s, MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid public key"))
            .empty().not()
            .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PUBLIC) && Config.KEY.MITUM.PUBLIC.satisfy(s.length), /^[0-9a-f]+$/.test(s.substring(0, s.length - Config.SUFFIX.DEFAULT.value)))
            .excute();
        return await getAPIData(() => api.account.getAccountByPublicKey(this.api, publickey, this.delegateIP));
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
    async balance(address) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(address);
        const response = await getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.balance ? response.data.balance : null;
        }
        return response;
    }
}
class Contract extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
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
    createWallet(sender, currency, amount, seed, weight) {
        const kp = seed ? KeyPair.fromSeed(seed, "mitum") : KeyPair.random("mitum");
        const ks = new Keys([new PubKey(kp.publicKey, weight ?? 100)], weight ?? 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.checksum.toString()
            },
            operation: new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)])
            ])),
        };
    }
    /**
     * Generate a `create-contract-account` operation for the given public key.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Key | PubKey} [key] - The public key or key object.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns `create-contract-account` operation.
     */
    createAccount(sender, key, currency, amount) {
        return new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys([new PubKey(key, 100)], 100), [new Amount(currency, amount)])
        ]));
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
     *     key: "02cb1d73c49d638d98092e35603414b575f3f5b5ce01162cdd80ab68ab77e50e14fpu",
     *     weight: 50
     * };
     * const pubkey02 = {
     *     key: "0377241675aabafca6b1a49f3bc08a581beb0daa330a4ac2008464d63ed7635a22fpu",
     *     weight: 50
     * };
     * const keysArray = [pubkey01, pubkey02];
     */
    createMultiSig(sender, keys, currency, amount, threshold) {
        return new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)])
        ]));
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
    async getContractInfo(address) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(address);
        const response = await getAPIData(() => api.account.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response)) {
            response.data = response.data ? response.data : null;
        }
        return response;
    }
    /**
     * Generate an `update-handler` operation to update handlers of contract to given accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [contract] - The contract account address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {(string | Address)[]} [handlers] - The array of addresses to be updated as handlers.
     * @returns `update-handler` operation.
     */
    updateHandler(sender, contract, currency, handlers) {
        return new Operation$1(this.networkID, new UpdateHandlerFact(TimeStamp.new().UTC(), sender, contract, currency, handlers));
    }
    /**
     * Sign and send the `create-contract-account` operation to blockchain network.
     * @async
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @param {Object} [wallet] - The object with properties `wallet` and `operation`. (return value of `createWallet`)
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
    async touch(privatekey, wallet) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const op = wallet.operation;
        op.sign(privatekey);
        return await new Operation(this.networkID, this.api, this.delegateIP).send(op);
    }
}

class Signer extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    /**
     * Sign the given operation in JSON format using given private key.
     * @param {string | Key} [privatekey] - The private key used for signing.
     * @param {Operation<Fact> | HintedObject} [operation] - The operation to be signed.
     * @param {SignOption} [option] - (Optional) Option for node sign.
     * @returns The signed operation in JSON object (HintedObject).
     */
    sign(privatekey, operation, option) {
        Assert.check(isOpFact(operation) || isHintedObject(operation), MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`));
        operation = isOpFact(operation) ? operation.toHintedObject() : operation;
        Key.from(privatekey);
        const keypair = KeyPair.fromPrivateKey(privatekey);
        return option ? this.nodeSign(keypair, operation, option.node ?? "") : this.accSign(keypair, operation);
    }
    accSign(keypair, operation) {
        const now = TimeStamp.new();
        const fs = new GeneralFactSign(keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            base58.decode(operation.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (operation.signs !== undefined) {
            operation.signs = [...operation.signs, fs];
        }
        else {
            operation.signs = [fs];
        }
        Assert.check(new Set(operation.signs.map(fs => fs.signer.toString())).size === operation.signs.length, MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        const factSigns = operation.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBuffer("super"),
        ]));
        //.sort((a, b) => Buffer.compare(a, b))
        const msg = Buffer.concat([
            base58.decode(operation.fact.hash),
            Buffer.concat(factSigns),
        ]);
        operation.hash = base58.encode(sha3(msg));
        return operation;
    }
    nodeSign(keypair, operation, node) {
        const nd = new NodeAddress(node);
        const now = TimeStamp.new();
        const fs = new NodeFactSign(node, keypair.publicKey.toString(), keypair.sign(Buffer.concat([
            Buffer.from(this.networkID),
            nd.toBuffer(),
            base58.decode(operation.fact.hash),
            now.toBuffer(),
        ])), now.toString()).toHintedObject();
        if (operation.signs) {
            operation.signs = [...operation.signs, fs];
        }
        else {
            operation.signs = [fs];
        }
        const factSigns = operation.signs
            .map((s) => Buffer.concat([
            Buffer.from(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBuffer("super"),
        ]))
            .sort((a, b) => Buffer.compare(a, b));
        const msg = Buffer.concat([
            base58.decode(operation.fact.hash),
            Buffer.concat(factSigns),
        ]);
        operation.hash = base58.encode(sha3(msg));
        return operation;
    }
}

class RegisterModelFact extends ContractFact {
    constructor(token, sender, contract, project, currency) {
        super(HINT.STORAGE.REGISTER_MODEL.FACT, token, sender, contract, currency);
        Assert.check(Config.STORAGE.PROJECT.satisfy(project.toString().length), MitumError.detail(ECODE.INVALID_FACT, `project length out of range, should be between ${Config.STORAGE.PROJECT.min} to ${Config.STORAGE.PROJECT.max}`));
        this.project = LongString.from(project);
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.project.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            project: this.project.toString(),
        };
    }
    get operationHint() {
        return HINT.STORAGE.REGISTER_MODEL.OPERATION;
    }
}

class StorageFact extends ContractFact {
    constructor(hint, token, sender, contract, dataKey, currency) {
        super(hint, token, sender, contract, currency);
        this.dataKey = LongString.from(dataKey);
        // Assert.check(
        //     this.decimal.compare(0) >= 0,
        //     MitumError.detail(ECODE.INVALID_FACT, "decimal number under zero"),
        // )
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.dataKey.toBuffer()
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            dataKey: this.dataKey.toString(),
        };
    }
}

class CreateDataFact extends StorageFact {
    constructor(token, sender, contract, dataKey, dataValue, currency) {
        super(HINT.STORAGE.CREATE_DATA.FACT, token, sender, contract, dataKey, currency);
        this.dataValue = LongString.from(dataValue);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        Assert.check(Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length), MitumError.detail(ECODE.INVALID_FACT, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.dataValue.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            dataValue: this.dataValue.toString(),
        };
    }
    get operationHint() {
        return HINT.STORAGE.CREATE_DATA.OPERATION;
    }
}

class CreateDatasItem extends Item {
    constructor(contract, currency, dataKey, dataValue) {
        super(HINT.STORAGE.CREATE_DATAS.ITEM);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.dataKey = LongString.from(dataKey);
        this.dataValue = LongString.from(dataValue);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        Assert.check(Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.dataKey.toBuffer(),
            this.dataValue.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            dataKey: this.dataKey.toString(),
            dataValue: this.dataValue.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return this.dataKey.toString();
    }
}
class CreateDatasFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STORAGE.CREATE_DATAS.FACT, token, sender, items);
        this.items.forEach(it => {
            new URIString(it.dataKey.toString(), 'dataKey');
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        });
        Assert.check(new Set(items.map(item => item.dataKey.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate dataKey found in items"));
    }
    get operationHint() {
        return HINT.STORAGE.CREATE_DATAS.OPERATION;
    }
}

class UpdateDataFact extends StorageFact {
    constructor(token, sender, contract, dataKey, dataValue, currency) {
        super(HINT.STORAGE.UPDATE_DATA.FACT, token, sender, contract, dataKey, currency);
        this.dataValue = LongString.from(dataValue);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        Assert.check(Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length), MitumError.detail(ECODE.INVALID_FACT, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.dataValue.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            dataValue: this.dataValue.toString(),
        };
    }
    get operationHint() {
        return HINT.STORAGE.UPDATE_DATA.OPERATION;
    }
}

class UpdateDatasItem extends Item {
    constructor(contract, currency, dataKey, dataValue) {
        super(HINT.STORAGE.UPDATE_DATAS.ITEM);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.dataKey = LongString.from(dataKey);
        this.dataValue = LongString.from(dataValue);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        Assert.check(Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`));
    }
    toBuffer() {
        return Buffer.concat([
            this.contract.toBuffer(),
            this.dataKey.toBuffer(),
            this.dataValue.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            dataKey: this.dataKey.toString(),
            dataValue: this.dataValue.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return this.dataKey.toString();
    }
}
class UpdateDatasFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.STORAGE.UPDATE_DATAS.FACT, token, sender, items);
        this.items.forEach(it => {
            new URIString(it.dataKey.toString(), 'dataKey');
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        });
        Assert.check(new Set(items.map(item => item.dataKey.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate dataKey found in items"));
    }
    get operationHint() {
        return HINT.STORAGE.UPDATE_DATAS.OPERATION;
    }
}

class DeleteDataFact extends StorageFact {
    constructor(token, sender, contract, dataKey, currency) {
        super(HINT.STORAGE.DELETE_DATA.FACT, token, sender, contract, dataKey, currency);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
        };
    }
    get operationHint() {
        return HINT.STORAGE.DELETE_DATA.OPERATION;
    }
}

class Storage extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    checkTwoArrayLength(array1, array2, arrayName1, arrayName2) {
        Assert.check(Array.isArray(array1), MitumError.detail(ECODE.INVALID_TYPE, `the ${arrayName1} must be in array type`));
        Assert.check(Array.isArray(array2), MitumError.detail(ECODE.INVALID_TYPE, `the ${arrayName2} must be in array type`));
        Assert.check(array1.length === array2.length, MitumError.detail(ECODE.INVALID_LENGTH, `the lengths of two arrays ${arrayName1}, ${arrayName2} are not the same`));
    }
    /**
     * Generate a `register-model` operation to register new storage model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [project] - The project's name
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract, sender, project, currency) {
        return new Operation$1(this.networkID, new RegisterModelFact(TimeStamp.new().UTC(), sender, contract, project, currency));
    }
    /**
     * Generate `create-data` operation to create data with new data key on the storage model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [dataKey] - The key of data to create.
     * @param {string | LongString} [dataValue] - Value of the data to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-data` operation
     */
    createData(contract, sender, dataKey, dataValue, currency) {
        new URIString(dataKey, 'dataKey');
        const fact = new CreateDataFact(TimeStamp.new().UTC(), sender, contract, dataKey, dataValue, currency);
        return new Operation$1(this.networkID, fact);
    }
    /**
     * Generate `create-datas` operation to create multiple data on the storage model.
     * @param {string[] | Address[]} [contracts] - The array of contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[]} [dataKeys] - The array with key of multiple data to create.
     * @param {string[] | LongString[]} [dataValues] - The array with value of the multiple data to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-datas` operation
     */
    createMultiData(contracts, sender, dataKeys, dataValues, currency) {
        this.checkTwoArrayLength(dataKeys, dataValues, "dataKeys", "dataValues");
        this.checkTwoArrayLength(contracts.map((el) => { return el.toString(); }), dataKeys, "contracts", "dataKeys");
        const items = dataKeys.map((_, idx) => new CreateDatasItem(contracts[idx], currency, dataKeys[idx], dataValues[idx]));
        return new Operation$1(this.networkID, new CreateDatasFact(TimeStamp.new().UTC(), sender, items));
    }
    /**
     * Generate `update-data` operation to update data with exist data key on the storage model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [dataKey] - The key of data to update.
     * @param {string | LongString} [dataValue] - Value of the data to be updated.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-data` operation
     */
    updateData(contract, sender, dataKey, dataValue, currency) {
        new URIString(dataKey, 'dataKey');
        const fact = new UpdateDataFact(TimeStamp.new().UTC(), sender, contract, dataKey, dataValue, currency);
        return new Operation$1(this.networkID, fact);
    }
    /**
     * Generate `update-datas` operation to update multiple data on the storage model.
     * @param {string[] | Address[]} [contracts] - The array of contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[]} [dataKeys] - The array with key of multiple data to update.
     * @param {string[] | LongString[]} [dataValues] - The array with value of the multiple data to update.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-datas` operation
     */
    updateMultiData(contracts, sender, dataKeys, dataValues, currency) {
        this.checkTwoArrayLength(dataKeys, dataValues, "dataKeys", "dataValues");
        this.checkTwoArrayLength(contracts.map((el) => { return el.toString(); }), dataKeys, "contracts", "dataKeys");
        const items = dataKeys.map((_, idx) => new UpdateDatasItem(contracts[idx], currency, dataKeys[idx], dataValues[idx]));
        return new Operation$1(this.networkID, new UpdateDatasFact(TimeStamp.new().UTC(), sender, items));
    }
    /**
     * Generate `delete-data` operation to delete data on the storage model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [dataKey] - The key of data to delete.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `delete-data` operation
     */
    deleteData(contract, sender, dataKey, currency) {
        new URIString(dataKey, 'dataKey');
        const fact = new DeleteDataFact(TimeStamp.new().UTC(), sender, contract, dataKey, currency);
        return new Operation$1(this.networkID, fact);
    }
    /**
     * Get information about a storage model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the storage service:
     * - `_hint`: Hint for storage design,
     * - `project`: Project's name
     */
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.storage.getModel(this.api, contract, this.delegateIP));
    }
    /**
     * Get detailed information about a specific data on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [dataKey] - The key of the data to search.
     * @returns `data` of `SuccessResponse` is information about the data with certain dataKey on the project:
     * - `data`: Object containing below information
     * - - `dataKey`: The key associated with the data,
     * - - `dataValue`: The current value of the data,
     * - - `deleted`: Indicates whether the data has been deleted
     * - `height`: The block number where the latest related operation is recorded,
     * - `operation`: The fact hash of the latest related operation,
     * - `timestamp`: The timestamp of the latest related operation (prposed_at of block manifest)
     */
    async getData(contract, dataKey) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(dataKey, 'dataKey');
        return await getAPIData(() => contractApi.storage.getData(this.api, contract, dataKey, this.delegateIP));
    }
    /**
     * Get all history information about a specific data on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [dataKey] - The key of the data to search.
     * @param {number} [limit] - (Optional) The maximum number of history to retrieve.
     * @param {number} [offset] - (Optional) The Offset setting value based on block height
     * @param {boolean} [reverse] - (Optional) Whether to return the history in reverse newest order.
     * @returns `data` of `SuccessResponse` is an array of the history information about the data:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `data`: Object containing below information
     * - - - `dataKey`: The key associated with the data,
     * - - - `dataValue`: The current value of the data,
     * - - - `deleted`: Indicates whether the data has been deleted
     * - - `height`: The block number where the latest related operation is recorded,
     * - - `operation`: The fact hash of the latest related operation,
     * - - `timestamp`: The timestamp of the latest related operation (prposed_at of block manifest),
     * - `_links`: Links for additional information
     */
    async getDataHistory(contract, dataKey, limit, offset, reverse) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(dataKey, 'dataKey');
        return await getAPIData(() => contractApi.storage.getDataHistory(this.api, contract, dataKey, this.delegateIP, limit, offset, reverse));
    }
    /**
     * Get the number of data (not deleted). If `deleted` is true, the number including deleted data.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {boolean} [deleted] - (Optional) Whether to include deleted data.
     * @returns `data` of `SuccessResponse` is an array of the history information about the data:
     * - `contract`: The address of contract account,
     * - `data_count`: The number of created data on the contract
     */
    async getDataCount(contract, deleted) {
        Address.from(contract);
        return await getAPIData(() => contractApi.storage.getDataCount(this.api, contract, this.delegateIP, deleted));
    }
}

class Operation extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Get all operations of the network.
     * @async
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns The `data` of `SuccessResponse` represents an array of all operations in the network:
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
     */
    async getAllOperations(limit, offset, reverse) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => api$1.getOperations(this.api, this.delegateIP, limit, offset, reverse));
    }
    /**
     * Get a operation by fact hash.
     * @async
     * @param {string} [hash] - The hash value of the fact included in the operation to retrieve
     * @returns The `data` of `SuccessResponse` is *null* or infomation of the operation:
     * - `_hint`: Hint for the operation,
     * - `hash`: Hash for the fact,
     * - `operation`:
     * - - `hash`: Hash fot the operation,
     * - - `fact`: Object for fact,
     * - - `signs`: Array for sign,
     * - - `_hint`: Hint for operation type,
     * - `height`: Block height containing the operation,
     * - `confirmed_at`: Timestamp when the block was confirmed,
     * - `reason`: Reason for operation failure,
     * - `in_state`: Boolean indicating whether the operation was successful or not,
     * - `index`: Index of the operation in the block
     *
     * ***null* means that the account has not yet been recorded in the block.**
     */
    async getOperation(hash) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const response = await getAPIData(() => api$1.getOperation(this.api, hash, this.delegateIP));
        if (isSuccessResponse(response)) {
            response.data = response.data ? response.data : null;
        }
        return response;
    }
    /**
     * Sign the given operation using the provided private key or key pair.
     * @param {string | Key | KeyPair} [privatekey] - The private key or key pair for signing.
     * @param {OP<Fact>} [operation] - The operation to sign.
     * @param {SignOption} [option] - (Optional) Option for node sign.
     * @returns The signed operation.
     */
    sign(privatekey, operation, option) {
        const op = operation;
        op.sign(privatekey instanceof KeyPair ? privatekey.privateKey : privatekey, option);
        return op;
    }
    /**
     * Send the given singed operation to blockchain network.
     * @async
     * @param { Operation<Fact> | HintedObject} [operation] - The operation to send.
     * @param {{[i: string]: any} | undefined} [headers] - (Optional) Additional headers for the request.
     * @returns Properties of `OperationResponse`:
     * - response: <SuccessResponse | ErrorResponse>
     * - _api: API URL
     * - _delegateIP: IP address for delegation
     * @example
     * // Send operation and check response and receipt:
     * const sendOperation = async () => {
     *   const data = await mitum.operation.send(signedOperation);
     *   console.log(data.response);
     *   const receipt = await data.wait();
     *   console.log(receipt);
     * };
     * sendOperation();
     */
    async send(operation, headers) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Assert.check(isOpFact(operation) || isHintedObject(operation), MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`));
        operation = isOpFact(operation) ? operation.toHintedObject() : operation;
        Assert.check(operation.signs.length !== 0, MitumError.detail(ECODE.EMPTY_SIGN, `signature is required before sending the operation`));
        Assert.check(Config.OP_SIZE.satisfy(Buffer.byteLength(JSON.stringify(operation), 'utf8')), MitumError.detail(ECODE.OP_SIZE_EXCEEDED, `Operation size exceeds the allowed limit of ${Config.OP_SIZE.max} bytes.`));
        const sendResponse = await getAPIData(() => api$1.send(this.api, operation, this.delegateIP, headers));
        return new OperationResponse(sendResponse, this.networkID, this.api, this.delegateIP);
    }
}
class OperationResponse extends Operation {
    constructor(response, networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
        this.response = response;
    }
    /**
     * Get receipt when a sent operation is recorded in a block by polling the blockchain network for a certain time.
     * @async
     * @param {number | undefined} [timeout=10000] - (Optional) Timeout for polling in milliseconds. Default is 10000ms.
     * @param {number | undefined} [interval=1000] - (Optional) Interval for polling in milliseconds. Default is 1000ms. (interval < timeout)
     * @returns The `data` property of `SuccessResponse` contains information about the operation:
     * - `_hint`: Hint for the operation,
     * - `hash`: Hash for the fact,
     * - `operation`:
     * - - `hash`: Hash fot the operation,
     * - - `fact`: Object for fact,
     * - - `signs`: Array for sign,
     * - - `_hint`: Hint for operation type,
     * - `height`: Block height containing the operation,
     * - `confirmed_at`: Timestamp when the block was confirmed,
     * - `reason`: Reason for operation failure,
     * - `in_state`: Boolean indicating whether the operation was successful or not,
     * - `index`: Index of the operation in the block
     *
     * **If `in_state` is `false`, the operation failed, and the `reason` property provides the failure reason.**
     */
    async wait(timeout, interval) {
        Assert.check(this.response.status === 200, MitumError.detail(ECODE.TRANSACTION_REVERTED, `transaction reverted by the network, check error message`));
        let elapsedTime = 0;
        const maxTimeout = timeout ?? 10000;
        const timeoutInterval = interval ?? 1000;
        const validatePositiveInteger = (val, name) => {
            if (!Number.isSafeInteger(val) || val <= 0) {
                throw new Error(`${name} must be a positive integer`);
            }
        };
        validatePositiveInteger(maxTimeout, "timeout");
        validatePositiveInteger(timeoutInterval, "interval");
        if (maxTimeout <= timeoutInterval) {
            if (interval === undefined) {
                throw new Error("default interval is 1000, so timeout must be greater than that.");
            }
            else if (timeout === undefined) {
                throw new Error("default timeout is 10000, so interval must be less than that.");
            }
            else {
                throw new Error("timeout must be larger than interval.");
            }
        }
        let stop = false;
        while (!stop && elapsedTime < maxTimeout) {
            try {
                const receipt = await this.getOperation(this.response.data.fact.hash);
                if (isSuccessResponse(receipt) && receipt.data !== undefined && receipt.data !== null) {
                    if (receipt.data.in_state) {
                        console.log('\x1b[34m%s\x1b[0m', `operation in_state is true. fact hash: ${this.response.data.fact.hash}`);
                        return receipt;
                    }
                    else {
                        console.log('\x1b[31m%s\x1b[0m', `operation in_state is false. fact hash: ${this.response.data.fact.hash}, reason: ${receipt.data.reason}`);
                        return receipt;
                    }
                }
                else {
                    console.log('\x1b[33m%s\x1b[0m', `polling for ${elapsedTime} ms, fact hash: ${this.response.data.fact.hash}`);
                }
            }
            catch (error) {
                stop = true;
                throw (error);
            }
            elapsedTime += timeoutInterval;
            await new Promise(resolve => setTimeout(resolve, timeoutInterval));
        }
        Assert.check(stop, MitumError.detail(ECODE.TIME_OUT, `timeout reached (${maxTimeout / 1000} seconds).`));
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
        this._storage = new Storage(this.networkID, this.api, this.delegateIP);
        this.ECODE = ECODE;
        this.PCODE = PCODE;
        this.DCODE = DCODE;
        this._utils = new Utils();
    }
    refresh() {
        this._node = new Node(this.api, this.delegateIP);
        this._account = new Account(this.networkID, this.api, this.delegateIP);
        this._currency = new Currency(this.networkID, this.api, this.delegateIP);
        this._block = new Block(this.api, this.delegateIP);
        this._operation = new Operation(this.networkID, this.api, this.delegateIP);
        this._contract = new Contract(this.networkID, this.api, this.delegateIP);
        this._storage = new Storage(this.networkID, this.api, this.delegateIP);
        this._utils = new Utils();
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
    get storage() {
        return this._storage;
    }
    get utils() {
        return this._utils;
    }
    /**
     * Set the API URL to interact with Mitum network.
     * @param {string | IP} [api] - The API URL to set
     */
    setAPI(api) {
        super.setAPI(api);
        this.refresh();
    }
    /**
     * Set the delegate IP address.
     * @param {string | IP} [delegateIP] - The delegate IP address to set.
     */
    setDelegate(delegateIP) {
        super.setDelegate(delegateIP);
        this.refresh();
    }
    /**
     * Set the blockchain network ID (chain). The default value is configured to 'mitum'.
     * @param {string} [networkID] - The network ID to set.
     */
    setNetworkID(networkID) {
        super.setNetworkID(networkID);
        this.refresh();
    }
    /**Get the API URL in use.
     * @returns {string | undefined} The API URL.
    */
    getAPI() {
        return this.api ? this.api.toString() : undefined;
    }
    /**
     * Get the delegate IP in use.
     * @returns {string} The delegate IP address.
     */
    getDelegate() {
        return this.delegateIP ? this.delegateIP.toString() : undefined;
    }
    /**Get the network ID in use.
     * @returns {string} The network ID (chain).
    */
    getNetworkID() {
        return this.networkID;
    }
}

export { Mitum, Mitum as default };
