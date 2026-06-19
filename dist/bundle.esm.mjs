import axios from 'axios';
import { Wallet, HDNodeWallet } from 'ethers';
import * as secp256k1 from '@noble/secp256k1';
import { getPublicKey } from '@noble/secp256k1';

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
    INVALID_FACT_HASH: "EC_INVALID_FACT_HASH",
    INVALID_OPERATION: "EC_INVALID_OPERATION",
    INVALID_OPERATIONS: "EC_INVALID_OPERATIONS",
    INVALID_USER_OPERATION: "EC_INVALID_USER_OPERATION",
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
    // DID Errors
    DID: {
        INVALID_DID: "EC_INVALID_DID",
        INVALID_DOCUMENT: "EC_INVALID_DOCUMENT",
        INVALID_AUTHENTICATION: "EC_INVALID_AUTHENTICATION"
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
    MITUM_NETWORK: {
        code: "P0N",
        keyword: ["Too Many Requests"],
        description: "Error from network",
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
    IV_AA_EXTENSION: {
        code: "D107",
        keyword: ["auth and settlement must be present together"],
        description: "Account abstraction operation extension is malformed: authentication and settlement must both be present.",
        subject: ""
    },
    // Related to signature
    IV_SIGN: {
        code: "D201",
        keyword: ["Invalid signing", "BaseNodeSign"],
        description: "Signature verification failed. Possible causes: private key does not match the address, node sign required, multiSig signatures below threshold, or network ID mismatch.",
        subject: ""
    },
    IV_ALTERSIGN: {
        code: "D202",
        keyword: ["Invalid user signing"],
        description: "Alternative signature for account abstraction operation is not valid",
        subject: ""
    },
    // Related to permission
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
    IV_AUTH_TYPE: {
        code: "D303",
        keyword: ["Invalid Auth Type"],
        description: "Occurs when there is a problem with authentication_id in the account abstraction operation.(If verificationMethod of social_login authentication is another social_login)",
        subject: ""
    },
    CA_RESTRICTED: {
        code: "D304",
        keyword: ["Contract account restricted"],
        description: "Contract account with contract_account_status.balance_status is 1, the owner cannot withdraw.",
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
    EXIST_FACT_HASH: {
        code: "D509",
        keyword: ["already in state"],
        description: "The operation exists on the blockchain. Check it using fact hash",
        subject: ""
    }
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
class ArrayAssert {
    constructor(array, arrayName) {
        this.validType = false;
        this.array = array;
        this.arrayName = arrayName;
    }
    validateType() {
        if (this.validType)
            return;
        if (!Array.isArray(this.array)) {
            throw MitumError.detail(ECODE.INVALID_TYPE, `the ${this.arrayName} must be in array type`);
        }
        this.validType = true;
    }
    notEmpty() {
        this.validateType();
        if (this.array.length === 0) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `${this.arrayName} cannot be an empty array`);
        }
        return this;
    }
    exactLength(length) {
        this.validateType();
        if (this.array.length !== length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `the length of ${this.arrayName} must be ${length}, but got ${this.array.length}`);
        }
        return this;
    }
    rangeLength(rangeConfig) {
        this.validateType();
        Assert.check(rangeConfig.satisfy(this.array.length), MitumError.detail(ECODE.INVALID_LENGTH, `The length of ${this.arrayName} must be between ${rangeConfig.min} and ${rangeConfig.max}, but got ${this.array.length}`));
        return this;
    }
    maxLength(max) {
        this.validateType();
        if (this.array.length > max) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `the length of ${this.arrayName} must not exceed ${max}`);
        }
        return this;
    }
    sameLength(array2, arrayName2) {
        this.validateType();
        if (!Array.isArray(array2)) {
            throw MitumError.detail(ECODE.INVALID_TYPE, `the ${arrayName2} must be in array type`);
        }
        if (this.array.length !== array2.length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `The lengths of the ${this.arrayName} and ${arrayName2} must be the same.`);
        }
        return this;
    }
    noDuplicates() {
        this.validateType();
        const uniqueItems = new Set(this.array.map((el) => { return el.toString(); }));
        if (uniqueItems.size !== this.array.length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `${this.arrayName} cannot contain duplicate elements`);
        }
        return this;
    }
    static check(array, arrayName) {
        return new ArrayAssert(array, arrayName);
    }
}

const encoder$h = new TextEncoder();
class LongString {
    constructor(s) {
        Assert.check(typeof (s) === "string", MitumError.detail(ECODE.INVALID_TYPE, `${s} is not in string type`));
        Assert.check(s !== "", MitumError.detail(ECODE.EMPTY_STRING, "empty string"));
        this.s = s;
    }
    static from(s) {
        return s instanceof LongString ? s : new LongString(s);
    }
    toBytes() {
        return encoder$h.encode(this.s);
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
        Assert.check(typeof (s) === "string", MitumError.detail(ECODE.INVALID_TYPE, `${s} is not in string type`));
        Assert.check(s !== "", MitumError.detail(ECODE.EMPTY_STRING, "empty string"));
        Assert.check(/^(http|https):\/\/(?:[\w-]+\.)*[\w-]+(?::\d+)?(?:\/[\w-./?%&=]*)?$/.test(s), MitumError.detail(ECODE.INVALID_IP, "invalid ip address, ip"));
    }
    static from(s) {
        return s instanceof IP ? s : new IP(s);
    }
}
class URIString {
    constructor(s, name) {
        Assert.check((/^[^\s:/?#\[\]@]*$/.test(s)), MitumError.detail(ECODE.INVALID_CHARACTER, `${name} must not contain: space / : ? # [ ] @`));
        this.s = s;
    }
    toBytes() {
        return encoder$h.encode(this.s);
    }
    toString() {
        return this.s;
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
            if (api === "") {
                this._api = undefined;
                return;
            }
            const cleanApi = api.endsWith('/') ? api.slice(0, -1) : api;
            try {
                new URL(cleanApi);
            }
            catch {
                throw MitumError.detail(ECODE.INVALID_IP, `Invalid API URL provided: ${cleanApi}`);
            }
            this._api = IP.from(cleanApi);
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
            if (delegateIP === "") {
                this._delegateIP = undefined;
                return;
            }
            const cleanDelegate = delegateIP.endsWith('/') ? delegateIP.slice(0, -1) : delegateIP;
            try {
                new URL(cleanDelegate);
            }
            catch {
                throw MitumError.detail(ECODE.INVALID_IP, `Invalid delegate URL provided: ${cleanDelegate}`);
            }
            this._delegateIP = IP.from(cleanDelegate);
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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var int64Buffer = {};

var hasRequiredInt64Buffer;

function requireInt64Buffer () {
	if (hasRequiredInt64Buffer) return int64Buffer;
	hasRequiredInt64Buffer = 1;
	(function (exports) {

		!function(exports) {
		  // constants

		  var UNDEFINED = "undefined";
		  var BUFFER = (UNDEFINED !== typeof Buffer) && Buffer;
		  var UINT8ARRAY = (UNDEFINED !== typeof Uint8Array) && Uint8Array;
		  var ARRAYBUFFER = (UNDEFINED !== typeof ArrayBuffer) && ArrayBuffer;
		  var ZERO = [0, 0, 0, 0, 0, 0, 0, 0];
		  var isArray = Array.isArray || _isArray;
		  var BIT32 = 4294967296;
		  var BIT24 = 16777216;

		  // storage class

		  var storage; // Array;

		  // generate classes

		  factory("Uint64BE", true, true);
		  factory("Int64BE", true, false);
		  factory("Uint64LE", false, true);
		  factory("Int64LE", false, false);

		  // class factory

		  function factory(name, bigendian, unsigned) {
		    var posH = bigendian ? 0 : 4;
		    var posL = bigendian ? 4 : 0;
		    var pos0 = bigendian ? 0 : 3;
		    var pos1 = bigendian ? 1 : 2;
		    var pos2 = bigendian ? 2 : 1;
		    var pos3 = bigendian ? 3 : 0;
		    var fromPositive = bigendian ? fromPositiveBE : fromPositiveLE;
		    var fromNegative = bigendian ? fromNegativeBE : fromNegativeLE;
		    var proto = Int64.prototype;
		    var isName = "is" + name;
		    var _isInt64 = "_" + isName;

		    // properties
		    proto.buffer = void 0;
		    proto.offset = 0;
		    proto[_isInt64] = true;

		    // methods
		    proto.toNumber = toNumber;
		    proto.toString = toString;
		    proto.toJSON = toNumber;
		    proto.toArray = toArray;

		    // add .toBuffer() method only when Buffer available
		    if (BUFFER) proto.toBuffer = toBuffer;

		    // add .toArrayBuffer() method only when Uint8Array available
		    if (UINT8ARRAY) proto.toArrayBuffer = toArrayBuffer;

		    // isUint64BE, isInt64BE
		    Int64[isName] = isInt64;

		    // CommonJS
		    exports[name] = Int64;

		    return Int64;

		    // constructor
		    function Int64(buffer, offset, value, raddix) {
		      if (!(this instanceof Int64)) return new Int64(buffer, offset, value, raddix);
		      return init(this, buffer, offset, value, raddix);
		    }

		    // isUint64BE, isInt64BE
		    function isInt64(b) {
		      return !!(b && b[_isInt64]);
		    }

		    // initializer
		    function init(that, buffer, offset, value, raddix) {
		      if (UINT8ARRAY && ARRAYBUFFER) {
		        if (buffer instanceof ARRAYBUFFER) buffer = new UINT8ARRAY(buffer);
		        if (value instanceof ARRAYBUFFER) value = new UINT8ARRAY(value);
		      }

		      // Int64BE() style
		      if (!buffer && !offset && !value && !storage) {
		        // shortcut to initialize with zero
		        that.buffer = newArray(ZERO, 0);
		        return;
		      }

		      // Int64BE(value, raddix) style
		      if (!isValidBuffer(buffer, offset)) {
		        var _storage = storage || Array;
		        raddix = offset;
		        value = buffer;
		        offset = 0;
		        buffer = (storage === BUFFER) ? BUFFER.alloc(8) : new _storage(8);
		      }

		      that.buffer = buffer;
		      that.offset = offset |= 0;

		      // Int64BE(buffer, offset) style
		      if (UNDEFINED === typeof value) return;

		      // Int64BE(buffer, offset, value, raddix) style
		      if ("string" === typeof value) {
		        fromString(buffer, offset, value, raddix || 10);
		      } else if (isValidBuffer(value, raddix)) {
		        fromArray(buffer, offset, value, raddix);
		      } else if ("number" === typeof raddix) {
		        writeInt32(buffer, offset + posH, value); // high
		        writeInt32(buffer, offset + posL, raddix); // low
		      } else if (value > 0) {
		        fromPositive(buffer, offset, value); // positive
		      } else if (value < 0) {
		        fromNegative(buffer, offset, value); // negative
		      } else {
		        fromArray(buffer, offset, ZERO, 0); // zero, NaN and others
		      }
		    }

		    function fromString(buffer, offset, str, raddix) {
		      var pos = 0;
		      var len = str.length;
		      var high = 0;
		      var low = 0;
		      if (str[0] === "-") pos++;
		      var sign = pos;
		      while (pos < len) {
		        var chr = parseInt(str[pos++], raddix);
		        if (!(chr >= 0)) break; // NaN
		        low = low * raddix + chr;
		        high = high * raddix + Math.floor(low / BIT32);
		        low %= BIT32;
		      }
		      if (sign) {
		        high = ~high;
		        if (low) {
		          low = BIT32 - low;
		        } else {
		          high++;
		        }
		      }
		      writeInt32(buffer, offset + posH, high);
		      writeInt32(buffer, offset + posL, low);
		    }

		    function toNumber() {
		      var buffer = this.buffer;
		      var offset = this.offset;
		      var high = readInt32(buffer, offset + posH);
		      var low = readInt32(buffer, offset + posL);
		      if (!unsigned) high |= 0; // a trick to get signed
		      return high ? (high * BIT32 + low) : low;
		    }

		    function toString(radix) {
		      var buffer = this.buffer;
		      var offset = this.offset;
		      var high = readInt32(buffer, offset + posH);
		      var low = readInt32(buffer, offset + posL);
		      var str = "";
		      var sign = !unsigned && (high & 0x80000000);
		      if (sign) {
		        high = ~high;
		        low = BIT32 - low;
		      }
		      radix = radix || 10;
		      while (1) {
		        var mod = (high % radix) * BIT32 + low;
		        high = Math.floor(high / radix);
		        low = Math.floor(mod / radix);
		        str = (mod % radix).toString(radix) + str;
		        if (!high && !low) break;
		      }
		      if (sign) {
		        str = "-" + str;
		      }
		      return str;
		    }

		    function writeInt32(buffer, offset, value) {
		      buffer[offset + pos3] = value & 255;
		      value = value >> 8;
		      buffer[offset + pos2] = value & 255;
		      value = value >> 8;
		      buffer[offset + pos1] = value & 255;
		      value = value >> 8;
		      buffer[offset + pos0] = value & 255;
		    }

		    function readInt32(buffer, offset) {
		      return (buffer[offset + pos0] * BIT24) +
		        (buffer[offset + pos1] << 16) +
		        (buffer[offset + pos2] << 8) +
		        buffer[offset + pos3];
		    }
		  }

		  function toArray(raw) {
		    var buffer = this.buffer;
		    var offset = this.offset;
		    storage = null; // Array

		    if (raw !== false && isArray(buffer)) {
		      return (buffer.length === 8) ? buffer : buffer.slice(offset, offset + 8);
		    }

		    return newArray(buffer, offset);
		  }

		  function toBuffer(raw) {
		    var buffer = this.buffer;
		    var offset = this.offset;
		    storage = BUFFER;

		    if (raw !== false && BUFFER.isBuffer(buffer)) {
		      return (buffer.length === 8) ? buffer : buffer.slice(offset, offset + 8);
		    }

		    // Buffer.from(arraybuffer) available since Node v4.5.0
		    // https://nodejs.org/en/blog/release/v4.5.0/
		    return BUFFER.from(toArrayBuffer.call(this, raw));
		  }

		  function toArrayBuffer(raw) {
		    var buffer = this.buffer;
		    var offset = this.offset;
		    var arrbuf = buffer.buffer;
		    storage = UINT8ARRAY;

		    // arrbuf.slice() ignores buffer.offset until Node v8.0.0
		    if (raw !== false && !buffer.offset && (arrbuf instanceof ARRAYBUFFER)) {
		      return (arrbuf.byteLength === 8) ? arrbuf : arrbuf.slice(offset, offset + 8);
		    }

		    var dest = new UINT8ARRAY(8);
		    fromArray(dest, 0, buffer, offset);
		    return dest.buffer;
		  }

		  function isValidBuffer(buffer, offset) {
		    var len = buffer && buffer.length;
		    offset |= 0;
		    return len && (offset + 8 <= len) && ("string" !== typeof buffer[offset]);
		  }

		  function fromArray(destbuf, destoff, srcbuf, srcoff) {
		    destoff |= 0;
		    srcoff |= 0;
		    for (var i = 0; i < 8; i++) {
		      destbuf[destoff++] = srcbuf[srcoff++] & 255;
		    }
		  }

		  function newArray(buffer, offset) {
		    return Array.prototype.slice.call(buffer, offset, offset + 8);
		  }

		  function fromPositiveBE(buffer, offset, value) {
		    var pos = offset + 8;
		    while (pos > offset) {
		      buffer[--pos] = value & 255;
		      value /= 256;
		    }
		  }

		  function fromNegativeBE(buffer, offset, value) {
		    var pos = offset + 8;
		    value++;
		    while (pos > offset) {
		      buffer[--pos] = ((-value) & 255) ^ 255;
		      value /= 256;
		    }
		  }

		  function fromPositiveLE(buffer, offset, value) {
		    var end = offset + 8;
		    while (offset < end) {
		      buffer[offset++] = value & 255;
		      value /= 256;
		    }
		  }

		  function fromNegativeLE(buffer, offset, value) {
		    var end = offset + 8;
		    value++;
		    while (offset < end) {
		      buffer[offset++] = ((-value) & 255) ^ 255;
		      value /= 256;
		    }
		  }

		  // https://github.com/retrofox/is-array
		  function _isArray(val) {
		    return !!val && "[object Array]" == Object.prototype.toString.call(val);
		  }

		}(typeof exports.nodeName !== 'string' ? exports : (int64Buffer || {})); 
	} (int64Buffer));
	return int64Buffer;
}

var int64BufferExports = requireInt64Buffer();
var Int64 = /*@__PURE__*/getDefaultExportFromCjs(int64BufferExports);

var BigInteger = {exports: {}};

var hasRequiredBigInteger;

function requireBigInteger () {
	if (hasRequiredBigInteger) return BigInteger.exports;
	hasRequiredBigInteger = 1;
	(function (module) {
		var bigInt = (function (undefined$1) {

		    var BASE = 1e7,
		        LOG_BASE = 7,
		        MAX_INT = 9007199254740992,
		        MAX_INT_ARR = smallToArray(MAX_INT),
		        DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

		    var supportsNativeBigInt = typeof BigInt === "function";

		    function Integer(v, radix, alphabet, caseSensitive) {
		        if (typeof v === "undefined") return Integer[0];
		        if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
		        return parseValue(v);
		    }

		    function BigInteger(value, sign) {
		        this.value = value;
		        this.sign = sign;
		        this.isSmall = false;
		    }
		    BigInteger.prototype = Object.create(Integer.prototype);

		    function SmallInteger(value) {
		        this.value = value;
		        this.sign = value < 0;
		        this.isSmall = true;
		    }
		    SmallInteger.prototype = Object.create(Integer.prototype);

		    function NativeBigInt(value) {
		        this.value = value;
		    }
		    NativeBigInt.prototype = Object.create(Integer.prototype);

		    function isPrecise(n) {
		        return -MAX_INT < n && n < MAX_INT;
		    }

		    function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
		        if (n < 1e7)
		            return [n];
		        if (n < 1e14)
		            return [n % 1e7, Math.floor(n / 1e7)];
		        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
		    }

		    function arrayToSmall(arr) { // If BASE changes this function may need to change
		        trim(arr);
		        var length = arr.length;
		        if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
		            switch (length) {
		                case 0: return 0;
		                case 1: return arr[0];
		                case 2: return arr[0] + arr[1] * BASE;
		                default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
		            }
		        }
		        return arr;
		    }

		    function trim(v) {
		        var i = v.length;
		        while (v[--i] === 0);
		        v.length = i + 1;
		    }

		    function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
		        var x = new Array(length);
		        var i = -1;
		        while (++i < length) {
		            x[i] = 0;
		        }
		        return x;
		    }

		    function truncate(n) {
		        if (n > 0) return Math.floor(n);
		        return Math.ceil(n);
		    }

		    function add(a, b) { // assumes a and b are arrays with a.length >= b.length
		        var l_a = a.length,
		            l_b = b.length,
		            r = new Array(l_a),
		            carry = 0,
		            base = BASE,
		            sum, i;
		        for (i = 0; i < l_b; i++) {
		            sum = a[i] + b[i] + carry;
		            carry = sum >= base ? 1 : 0;
		            r[i] = sum - carry * base;
		        }
		        while (i < l_a) {
		            sum = a[i] + carry;
		            carry = sum === base ? 1 : 0;
		            r[i++] = sum - carry * base;
		        }
		        if (carry > 0) r.push(carry);
		        return r;
		    }

		    function addAny(a, b) {
		        if (a.length >= b.length) return add(a, b);
		        return add(b, a);
		    }

		    function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
		        var l = a.length,
		            r = new Array(l),
		            base = BASE,
		            sum, i;
		        for (i = 0; i < l; i++) {
		            sum = a[i] - base + carry;
		            carry = Math.floor(sum / base);
		            r[i] = sum - carry * base;
		            carry += 1;
		        }
		        while (carry > 0) {
		            r[i++] = carry % base;
		            carry = Math.floor(carry / base);
		        }
		        return r;
		    }

		    BigInteger.prototype.add = function (v) {
		        var n = parseValue(v);
		        if (this.sign !== n.sign) {
		            return this.subtract(n.negate());
		        }
		        var a = this.value, b = n.value;
		        if (n.isSmall) {
		            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
		        }
		        return new BigInteger(addAny(a, b), this.sign);
		    };
		    BigInteger.prototype.plus = BigInteger.prototype.add;

		    SmallInteger.prototype.add = function (v) {
		        var n = parseValue(v);
		        var a = this.value;
		        if (a < 0 !== n.sign) {
		            return this.subtract(n.negate());
		        }
		        var b = n.value;
		        if (n.isSmall) {
		            if (isPrecise(a + b)) return new SmallInteger(a + b);
		            b = smallToArray(Math.abs(b));
		        }
		        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
		    };
		    SmallInteger.prototype.plus = SmallInteger.prototype.add;

		    NativeBigInt.prototype.add = function (v) {
		        return new NativeBigInt(this.value + parseValue(v).value);
		    };
		    NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

		    function subtract(a, b) { // assumes a and b are arrays with a >= b
		        var a_l = a.length,
		            b_l = b.length,
		            r = new Array(a_l),
		            borrow = 0,
		            base = BASE,
		            i, difference;
		        for (i = 0; i < b_l; i++) {
		            difference = a[i] - borrow - b[i];
		            if (difference < 0) {
		                difference += base;
		                borrow = 1;
		            } else borrow = 0;
		            r[i] = difference;
		        }
		        for (i = b_l; i < a_l; i++) {
		            difference = a[i] - borrow;
		            if (difference < 0) difference += base;
		            else {
		                r[i++] = difference;
		                break;
		            }
		            r[i] = difference;
		        }
		        for (; i < a_l; i++) {
		            r[i] = a[i];
		        }
		        trim(r);
		        return r;
		    }

		    function subtractAny(a, b, sign) {
		        var value;
		        if (compareAbs(a, b) >= 0) {
		            value = subtract(a, b);
		        } else {
		            value = subtract(b, a);
		            sign = !sign;
		        }
		        value = arrayToSmall(value);
		        if (typeof value === "number") {
		            if (sign) value = -value;
		            return new SmallInteger(value);
		        }
		        return new BigInteger(value, sign);
		    }

		    function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
		        var l = a.length,
		            r = new Array(l),
		            carry = -b,
		            base = BASE,
		            i, difference;
		        for (i = 0; i < l; i++) {
		            difference = a[i] + carry;
		            carry = Math.floor(difference / base);
		            difference %= base;
		            r[i] = difference < 0 ? difference + base : difference;
		        }
		        r = arrayToSmall(r);
		        if (typeof r === "number") {
		            if (sign) r = -r;
		            return new SmallInteger(r);
		        } return new BigInteger(r, sign);
		    }

		    BigInteger.prototype.subtract = function (v) {
		        var n = parseValue(v);
		        if (this.sign !== n.sign) {
		            return this.add(n.negate());
		        }
		        var a = this.value, b = n.value;
		        if (n.isSmall)
		            return subtractSmall(a, Math.abs(b), this.sign);
		        return subtractAny(a, b, this.sign);
		    };
		    BigInteger.prototype.minus = BigInteger.prototype.subtract;

		    SmallInteger.prototype.subtract = function (v) {
		        var n = parseValue(v);
		        var a = this.value;
		        if (a < 0 !== n.sign) {
		            return this.add(n.negate());
		        }
		        var b = n.value;
		        if (n.isSmall) {
		            return new SmallInteger(a - b);
		        }
		        return subtractSmall(b, Math.abs(a), a >= 0);
		    };
		    SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

		    NativeBigInt.prototype.subtract = function (v) {
		        return new NativeBigInt(this.value - parseValue(v).value);
		    };
		    NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

		    BigInteger.prototype.negate = function () {
		        return new BigInteger(this.value, !this.sign);
		    };
		    SmallInteger.prototype.negate = function () {
		        var sign = this.sign;
		        var small = new SmallInteger(-this.value);
		        small.sign = !sign;
		        return small;
		    };
		    NativeBigInt.prototype.negate = function () {
		        return new NativeBigInt(-this.value);
		    };

		    BigInteger.prototype.abs = function () {
		        return new BigInteger(this.value, false);
		    };
		    SmallInteger.prototype.abs = function () {
		        return new SmallInteger(Math.abs(this.value));
		    };
		    NativeBigInt.prototype.abs = function () {
		        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
		    };


		    function multiplyLong(a, b) {
		        var a_l = a.length,
		            b_l = b.length,
		            l = a_l + b_l,
		            r = createArray(l),
		            base = BASE,
		            product, carry, i, a_i, b_j;
		        for (i = 0; i < a_l; ++i) {
		            a_i = a[i];
		            for (var j = 0; j < b_l; ++j) {
		                b_j = b[j];
		                product = a_i * b_j + r[i + j];
		                carry = Math.floor(product / base);
		                r[i + j] = product - carry * base;
		                r[i + j + 1] += carry;
		            }
		        }
		        trim(r);
		        return r;
		    }

		    function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
		        var l = a.length,
		            r = new Array(l),
		            base = BASE,
		            carry = 0,
		            product, i;
		        for (i = 0; i < l; i++) {
		            product = a[i] * b + carry;
		            carry = Math.floor(product / base);
		            r[i] = product - carry * base;
		        }
		        while (carry > 0) {
		            r[i++] = carry % base;
		            carry = Math.floor(carry / base);
		        }
		        return r;
		    }

		    function shiftLeft(x, n) {
		        var r = [];
		        while (n-- > 0) r.push(0);
		        return r.concat(x);
		    }

		    function multiplyKaratsuba(x, y) {
		        var n = Math.max(x.length, y.length);

		        if (n <= 30) return multiplyLong(x, y);
		        n = Math.ceil(n / 2);

		        var b = x.slice(n),
		            a = x.slice(0, n),
		            d = y.slice(n),
		            c = y.slice(0, n);

		        var ac = multiplyKaratsuba(a, c),
		            bd = multiplyKaratsuba(b, d),
		            abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

		        var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
		        trim(product);
		        return product;
		    }

		    // The following function is derived from a surface fit of a graph plotting the performance difference
		    // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
		    function useKaratsuba(l1, l2) {
		        return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
		    }

		    BigInteger.prototype.multiply = function (v) {
		        var n = parseValue(v),
		            a = this.value, b = n.value,
		            sign = this.sign !== n.sign,
		            abs;
		        if (n.isSmall) {
		            if (b === 0) return Integer[0];
		            if (b === 1) return this;
		            if (b === -1) return this.negate();
		            abs = Math.abs(b);
		            if (abs < BASE) {
		                return new BigInteger(multiplySmall(a, abs), sign);
		            }
		            b = smallToArray(abs);
		        }
		        if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
		            return new BigInteger(multiplyKaratsuba(a, b), sign);
		        return new BigInteger(multiplyLong(a, b), sign);
		    };

		    BigInteger.prototype.times = BigInteger.prototype.multiply;

		    function multiplySmallAndArray(a, b, sign) { // a >= 0
		        if (a < BASE) {
		            return new BigInteger(multiplySmall(b, a), sign);
		        }
		        return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
		    }
		    SmallInteger.prototype._multiplyBySmall = function (a) {
		        if (isPrecise(a.value * this.value)) {
		            return new SmallInteger(a.value * this.value);
		        }
		        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
		    };
		    BigInteger.prototype._multiplyBySmall = function (a) {
		        if (a.value === 0) return Integer[0];
		        if (a.value === 1) return this;
		        if (a.value === -1) return this.negate();
		        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
		    };
		    SmallInteger.prototype.multiply = function (v) {
		        return parseValue(v)._multiplyBySmall(this);
		    };
		    SmallInteger.prototype.times = SmallInteger.prototype.multiply;

		    NativeBigInt.prototype.multiply = function (v) {
		        return new NativeBigInt(this.value * parseValue(v).value);
		    };
		    NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

		    function square(a) {
		        //console.assert(2 * BASE * BASE < MAX_INT);
		        var l = a.length,
		            r = createArray(l + l),
		            base = BASE,
		            product, carry, i, a_i, a_j;
		        for (i = 0; i < l; i++) {
		            a_i = a[i];
		            carry = 0 - a_i * a_i;
		            for (var j = i; j < l; j++) {
		                a_j = a[j];
		                product = 2 * (a_i * a_j) + r[i + j] + carry;
		                carry = Math.floor(product / base);
		                r[i + j] = product - carry * base;
		            }
		            r[i + l] = carry;
		        }
		        trim(r);
		        return r;
		    }

		    BigInteger.prototype.square = function () {
		        return new BigInteger(square(this.value), false);
		    };

		    SmallInteger.prototype.square = function () {
		        var value = this.value * this.value;
		        if (isPrecise(value)) return new SmallInteger(value);
		        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
		    };

		    NativeBigInt.prototype.square = function (v) {
		        return new NativeBigInt(this.value * this.value);
		    };

		    function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
		        var a_l = a.length,
		            b_l = b.length,
		            base = BASE,
		            result = createArray(b.length),
		            divisorMostSignificantDigit = b[b_l - 1],
		            // normalization
		            lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
		            remainder = multiplySmall(a, lambda),
		            divisor = multiplySmall(b, lambda),
		            quotientDigit, shift, carry, borrow, i, l, q;
		        if (remainder.length <= a_l) remainder.push(0);
		        divisor.push(0);
		        divisorMostSignificantDigit = divisor[b_l - 1];
		        for (shift = a_l - b_l; shift >= 0; shift--) {
		            quotientDigit = base - 1;
		            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
		                quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
		            }
		            // quotientDigit <= base - 1
		            carry = 0;
		            borrow = 0;
		            l = divisor.length;
		            for (i = 0; i < l; i++) {
		                carry += quotientDigit * divisor[i];
		                q = Math.floor(carry / base);
		                borrow += remainder[shift + i] - (carry - q * base);
		                carry = q;
		                if (borrow < 0) {
		                    remainder[shift + i] = borrow + base;
		                    borrow = -1;
		                } else {
		                    remainder[shift + i] = borrow;
		                    borrow = 0;
		                }
		            }
		            while (borrow !== 0) {
		                quotientDigit -= 1;
		                carry = 0;
		                for (i = 0; i < l; i++) {
		                    carry += remainder[shift + i] - base + divisor[i];
		                    if (carry < 0) {
		                        remainder[shift + i] = carry + base;
		                        carry = 0;
		                    } else {
		                        remainder[shift + i] = carry;
		                        carry = 1;
		                    }
		                }
		                borrow += carry;
		            }
		            result[shift] = quotientDigit;
		        }
		        // denormalization
		        remainder = divModSmall(remainder, lambda)[0];
		        return [arrayToSmall(result), arrayToSmall(remainder)];
		    }

		    function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
		        // Performs faster than divMod1 on larger input sizes.
		        var a_l = a.length,
		            b_l = b.length,
		            result = [],
		            part = [],
		            base = BASE,
		            guess, xlen, highx, highy, check;
		        while (a_l) {
		            part.unshift(a[--a_l]);
		            trim(part);
		            if (compareAbs(part, b) < 0) {
		                result.push(0);
		                continue;
		            }
		            xlen = part.length;
		            highx = part[xlen - 1] * base + part[xlen - 2];
		            highy = b[b_l - 1] * base + b[b_l - 2];
		            if (xlen > b_l) {
		                highx = (highx + 1) * base;
		            }
		            guess = Math.ceil(highx / highy);
		            do {
		                check = multiplySmall(b, guess);
		                if (compareAbs(check, part) <= 0) break;
		                guess--;
		            } while (guess);
		            result.push(guess);
		            part = subtract(part, check);
		        }
		        result.reverse();
		        return [arrayToSmall(result), arrayToSmall(part)];
		    }

		    function divModSmall(value, lambda) {
		        var length = value.length,
		            quotient = createArray(length),
		            base = BASE,
		            i, q, remainder, divisor;
		        remainder = 0;
		        for (i = length - 1; i >= 0; --i) {
		            divisor = remainder * base + value[i];
		            q = truncate(divisor / lambda);
		            remainder = divisor - q * lambda;
		            quotient[i] = q | 0;
		        }
		        return [quotient, remainder | 0];
		    }

		    function divModAny(self, v) {
		        var value, n = parseValue(v);
		        if (supportsNativeBigInt) {
		            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
		        }
		        var a = self.value, b = n.value;
		        var quotient;
		        if (b === 0) throw new Error("Cannot divide by zero");
		        if (self.isSmall) {
		            if (n.isSmall) {
		                return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
		            }
		            return [Integer[0], self];
		        }
		        if (n.isSmall) {
		            if (b === 1) return [self, Integer[0]];
		            if (b == -1) return [self.negate(), Integer[0]];
		            var abs = Math.abs(b);
		            if (abs < BASE) {
		                value = divModSmall(a, abs);
		                quotient = arrayToSmall(value[0]);
		                var remainder = value[1];
		                if (self.sign) remainder = -remainder;
		                if (typeof quotient === "number") {
		                    if (self.sign !== n.sign) quotient = -quotient;
		                    return [new SmallInteger(quotient), new SmallInteger(remainder)];
		                }
		                return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
		            }
		            b = smallToArray(abs);
		        }
		        var comparison = compareAbs(a, b);
		        if (comparison === -1) return [Integer[0], self];
		        if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

		        // divMod1 is faster on smaller input sizes
		        if (a.length + b.length <= 200)
		            value = divMod1(a, b);
		        else value = divMod2(a, b);

		        quotient = value[0];
		        var qSign = self.sign !== n.sign,
		            mod = value[1],
		            mSign = self.sign;
		        if (typeof quotient === "number") {
		            if (qSign) quotient = -quotient;
		            quotient = new SmallInteger(quotient);
		        } else quotient = new BigInteger(quotient, qSign);
		        if (typeof mod === "number") {
		            if (mSign) mod = -mod;
		            mod = new SmallInteger(mod);
		        } else mod = new BigInteger(mod, mSign);
		        return [quotient, mod];
		    }

		    BigInteger.prototype.divmod = function (v) {
		        var result = divModAny(this, v);
		        return {
		            quotient: result[0],
		            remainder: result[1]
		        };
		    };
		    NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


		    BigInteger.prototype.divide = function (v) {
		        return divModAny(this, v)[0];
		    };
		    NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
		        return new NativeBigInt(this.value / parseValue(v).value);
		    };
		    SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

		    BigInteger.prototype.mod = function (v) {
		        return divModAny(this, v)[1];
		    };
		    NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
		        return new NativeBigInt(this.value % parseValue(v).value);
		    };
		    SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

		    BigInteger.prototype.pow = function (v) {
		        var n = parseValue(v),
		            a = this.value,
		            b = n.value,
		            value, x, y;
		        if (b === 0) return Integer[1];
		        if (a === 0) return Integer[0];
		        if (a === 1) return Integer[1];
		        if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
		        if (n.sign) {
		            return Integer[0];
		        }
		        if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
		        if (this.isSmall) {
		            if (isPrecise(value = Math.pow(a, b)))
		                return new SmallInteger(truncate(value));
		        }
		        x = this;
		        y = Integer[1];
		        while (true) {
		            if (b & 1 === 1) {
		                y = y.times(x);
		                --b;
		            }
		            if (b === 0) break;
		            b /= 2;
		            x = x.square();
		        }
		        return y;
		    };
		    SmallInteger.prototype.pow = BigInteger.prototype.pow;

		    NativeBigInt.prototype.pow = function (v) {
		        var n = parseValue(v);
		        var a = this.value, b = n.value;
		        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
		        if (b === _0) return Integer[1];
		        if (a === _0) return Integer[0];
		        if (a === _1) return Integer[1];
		        if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
		        if (n.isNegative()) return new NativeBigInt(_0);
		        var x = this;
		        var y = Integer[1];
		        while (true) {
		            if ((b & _1) === _1) {
		                y = y.times(x);
		                --b;
		            }
		            if (b === _0) break;
		            b /= _2;
		            x = x.square();
		        }
		        return y;
		    };

		    BigInteger.prototype.modPow = function (exp, mod) {
		        exp = parseValue(exp);
		        mod = parseValue(mod);
		        if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
		        var r = Integer[1],
		            base = this.mod(mod);
		        if (exp.isNegative()) {
		            exp = exp.multiply(Integer[-1]);
		            base = base.modInv(mod);
		        }
		        while (exp.isPositive()) {
		            if (base.isZero()) return Integer[0];
		            if (exp.isOdd()) r = r.multiply(base).mod(mod);
		            exp = exp.divide(2);
		            base = base.square().mod(mod);
		        }
		        return r;
		    };
		    NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

		    function compareAbs(a, b) {
		        if (a.length !== b.length) {
		            return a.length > b.length ? 1 : -1;
		        }
		        for (var i = a.length - 1; i >= 0; i--) {
		            if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
		        }
		        return 0;
		    }

		    BigInteger.prototype.compareAbs = function (v) {
		        var n = parseValue(v),
		            a = this.value,
		            b = n.value;
		        if (n.isSmall) return 1;
		        return compareAbs(a, b);
		    };
		    SmallInteger.prototype.compareAbs = function (v) {
		        var n = parseValue(v),
		            a = Math.abs(this.value),
		            b = n.value;
		        if (n.isSmall) {
		            b = Math.abs(b);
		            return a === b ? 0 : a > b ? 1 : -1;
		        }
		        return -1;
		    };
		    NativeBigInt.prototype.compareAbs = function (v) {
		        var a = this.value;
		        var b = parseValue(v).value;
		        a = a >= 0 ? a : -a;
		        b = b >= 0 ? b : -b;
		        return a === b ? 0 : a > b ? 1 : -1;
		    };

		    BigInteger.prototype.compare = function (v) {
		        // See discussion about comparison with Infinity:
		        // https://github.com/peterolson/BigInteger.js/issues/61
		        if (v === Infinity) {
		            return -1;
		        }
		        if (v === -Infinity) {
		            return 1;
		        }

		        var n = parseValue(v),
		            a = this.value,
		            b = n.value;
		        if (this.sign !== n.sign) {
		            return n.sign ? 1 : -1;
		        }
		        if (n.isSmall) {
		            return this.sign ? -1 : 1;
		        }
		        return compareAbs(a, b) * (this.sign ? -1 : 1);
		    };
		    BigInteger.prototype.compareTo = BigInteger.prototype.compare;

		    SmallInteger.prototype.compare = function (v) {
		        if (v === Infinity) {
		            return -1;
		        }
		        if (v === -Infinity) {
		            return 1;
		        }

		        var n = parseValue(v),
		            a = this.value,
		            b = n.value;
		        if (n.isSmall) {
		            return a == b ? 0 : a > b ? 1 : -1;
		        }
		        if (a < 0 !== n.sign) {
		            return a < 0 ? -1 : 1;
		        }
		        return a < 0 ? 1 : -1;
		    };
		    SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

		    NativeBigInt.prototype.compare = function (v) {
		        if (v === Infinity) {
		            return -1;
		        }
		        if (v === -Infinity) {
		            return 1;
		        }
		        var a = this.value;
		        var b = parseValue(v).value;
		        return a === b ? 0 : a > b ? 1 : -1;
		    };
		    NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

		    BigInteger.prototype.equals = function (v) {
		        return this.compare(v) === 0;
		    };
		    NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

		    BigInteger.prototype.notEquals = function (v) {
		        return this.compare(v) !== 0;
		    };
		    NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

		    BigInteger.prototype.greater = function (v) {
		        return this.compare(v) > 0;
		    };
		    NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

		    BigInteger.prototype.lesser = function (v) {
		        return this.compare(v) < 0;
		    };
		    NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

		    BigInteger.prototype.greaterOrEquals = function (v) {
		        return this.compare(v) >= 0;
		    };
		    NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

		    BigInteger.prototype.lesserOrEquals = function (v) {
		        return this.compare(v) <= 0;
		    };
		    NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

		    BigInteger.prototype.isEven = function () {
		        return (this.value[0] & 1) === 0;
		    };
		    SmallInteger.prototype.isEven = function () {
		        return (this.value & 1) === 0;
		    };
		    NativeBigInt.prototype.isEven = function () {
		        return (this.value & BigInt(1)) === BigInt(0);
		    };

		    BigInteger.prototype.isOdd = function () {
		        return (this.value[0] & 1) === 1;
		    };
		    SmallInteger.prototype.isOdd = function () {
		        return (this.value & 1) === 1;
		    };
		    NativeBigInt.prototype.isOdd = function () {
		        return (this.value & BigInt(1)) === BigInt(1);
		    };

		    BigInteger.prototype.isPositive = function () {
		        return !this.sign;
		    };
		    SmallInteger.prototype.isPositive = function () {
		        return this.value > 0;
		    };
		    NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

		    BigInteger.prototype.isNegative = function () {
		        return this.sign;
		    };
		    SmallInteger.prototype.isNegative = function () {
		        return this.value < 0;
		    };
		    NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

		    BigInteger.prototype.isUnit = function () {
		        return false;
		    };
		    SmallInteger.prototype.isUnit = function () {
		        return Math.abs(this.value) === 1;
		    };
		    NativeBigInt.prototype.isUnit = function () {
		        return this.abs().value === BigInt(1);
		    };

		    BigInteger.prototype.isZero = function () {
		        return false;
		    };
		    SmallInteger.prototype.isZero = function () {
		        return this.value === 0;
		    };
		    NativeBigInt.prototype.isZero = function () {
		        return this.value === BigInt(0);
		    };

		    BigInteger.prototype.isDivisibleBy = function (v) {
		        var n = parseValue(v);
		        if (n.isZero()) return false;
		        if (n.isUnit()) return true;
		        if (n.compareAbs(2) === 0) return this.isEven();
		        return this.mod(n).isZero();
		    };
		    NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

		    function isBasicPrime(v) {
		        var n = v.abs();
		        if (n.isUnit()) return false;
		        if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
		        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
		        if (n.lesser(49)) return true;
		        // we don't know if it's prime: let the other functions figure it out
		    }

		    function millerRabinTest(n, a) {
		        var nPrev = n.prev(),
		            b = nPrev,
		            r = 0,
		            d, i, x;
		        while (b.isEven()) b = b.divide(2), r++;
		        next: for (i = 0; i < a.length; i++) {
		            if (n.lesser(a[i])) continue;
		            x = bigInt(a[i]).modPow(b, n);
		            if (x.isUnit() || x.equals(nPrev)) continue;
		            for (d = r - 1; d != 0; d--) {
		                x = x.square().mod(n);
		                if (x.isUnit()) return false;
		                if (x.equals(nPrev)) continue next;
		            }
		            return false;
		        }
		        return true;
		    }

		    // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
		    BigInteger.prototype.isPrime = function (strict) {
		        var isPrime = isBasicPrime(this);
		        if (isPrime !== undefined$1) return isPrime;
		        var n = this.abs();
		        var bits = n.bitLength();
		        if (bits <= 64)
		            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
		        var logN = Math.log(2) * bits.toJSNumber();
		        var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
		        for (var a = [], i = 0; i < t; i++) {
		            a.push(bigInt(i + 2));
		        }
		        return millerRabinTest(n, a);
		    };
		    NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

		    BigInteger.prototype.isProbablePrime = function (iterations, rng) {
		        var isPrime = isBasicPrime(this);
		        if (isPrime !== undefined$1) return isPrime;
		        var n = this.abs();
		        var t = iterations === undefined$1 ? 5 : iterations;
		        for (var a = [], i = 0; i < t; i++) {
		            a.push(bigInt.randBetween(2, n.minus(2), rng));
		        }
		        return millerRabinTest(n, a);
		    };
		    NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

		    BigInteger.prototype.modInv = function (n) {
		        var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
		        while (!newR.isZero()) {
		            q = r.divide(newR);
		            lastT = t;
		            lastR = r;
		            t = newT;
		            r = newR;
		            newT = lastT.subtract(q.multiply(newT));
		            newR = lastR.subtract(q.multiply(newR));
		        }
		        if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
		        if (t.compare(0) === -1) {
		            t = t.add(n);
		        }
		        if (this.isNegative()) {
		            return t.negate();
		        }
		        return t;
		    };

		    NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

		    BigInteger.prototype.next = function () {
		        var value = this.value;
		        if (this.sign) {
		            return subtractSmall(value, 1, this.sign);
		        }
		        return new BigInteger(addSmall(value, 1), this.sign);
		    };
		    SmallInteger.prototype.next = function () {
		        var value = this.value;
		        if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
		        return new BigInteger(MAX_INT_ARR, false);
		    };
		    NativeBigInt.prototype.next = function () {
		        return new NativeBigInt(this.value + BigInt(1));
		    };

		    BigInteger.prototype.prev = function () {
		        var value = this.value;
		        if (this.sign) {
		            return new BigInteger(addSmall(value, 1), true);
		        }
		        return subtractSmall(value, 1, this.sign);
		    };
		    SmallInteger.prototype.prev = function () {
		        var value = this.value;
		        if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
		        return new BigInteger(MAX_INT_ARR, true);
		    };
		    NativeBigInt.prototype.prev = function () {
		        return new NativeBigInt(this.value - BigInt(1));
		    };

		    var powersOfTwo = [1];
		    while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
		    var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

		    function shift_isSmall(n) {
		        return Math.abs(n) <= BASE;
		    }

		    BigInteger.prototype.shiftLeft = function (v) {
		        var n = parseValue(v).toJSNumber();
		        if (!shift_isSmall(n)) {
		            throw new Error(String(n) + " is too large for shifting.");
		        }
		        if (n < 0) return this.shiftRight(-n);
		        var result = this;
		        if (result.isZero()) return result;
		        while (n >= powers2Length) {
		            result = result.multiply(highestPower2);
		            n -= powers2Length - 1;
		        }
		        return result.multiply(powersOfTwo[n]);
		    };
		    NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

		    BigInteger.prototype.shiftRight = function (v) {
		        var remQuo;
		        var n = parseValue(v).toJSNumber();
		        if (!shift_isSmall(n)) {
		            throw new Error(String(n) + " is too large for shifting.");
		        }
		        if (n < 0) return this.shiftLeft(-n);
		        var result = this;
		        while (n >= powers2Length) {
		            if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
		            remQuo = divModAny(result, highestPower2);
		            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
		            n -= powers2Length - 1;
		        }
		        remQuo = divModAny(result, powersOfTwo[n]);
		        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
		    };
		    NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

		    function bitwise(x, y, fn) {
		        y = parseValue(y);
		        var xSign = x.isNegative(), ySign = y.isNegative();
		        var xRem = xSign ? x.not() : x,
		            yRem = ySign ? y.not() : y;
		        var xDigit = 0, yDigit = 0;
		        var xDivMod = null, yDivMod = null;
		        var result = [];
		        while (!xRem.isZero() || !yRem.isZero()) {
		            xDivMod = divModAny(xRem, highestPower2);
		            xDigit = xDivMod[1].toJSNumber();
		            if (xSign) {
		                xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
		            }

		            yDivMod = divModAny(yRem, highestPower2);
		            yDigit = yDivMod[1].toJSNumber();
		            if (ySign) {
		                yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
		            }

		            xRem = xDivMod[0];
		            yRem = yDivMod[0];
		            result.push(fn(xDigit, yDigit));
		        }
		        var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
		        for (var i = result.length - 1; i >= 0; i -= 1) {
		            sum = sum.multiply(highestPower2).add(bigInt(result[i]));
		        }
		        return sum;
		    }

		    BigInteger.prototype.not = function () {
		        return this.negate().prev();
		    };
		    NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

		    BigInteger.prototype.and = function (n) {
		        return bitwise(this, n, function (a, b) { return a & b; });
		    };
		    NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

		    BigInteger.prototype.or = function (n) {
		        return bitwise(this, n, function (a, b) { return a | b; });
		    };
		    NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

		    BigInteger.prototype.xor = function (n) {
		        return bitwise(this, n, function (a, b) { return a ^ b; });
		    };
		    NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

		    var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
		    function roughLOB(n) { // get lowestOneBit (rough)
		        // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
		        // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
		        var v = n.value,
		            x = typeof v === "number" ? v | LOBMASK_I :
		                typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
		                    v[0] + v[1] * BASE | LOBMASK_BI;
		        return x & -x;
		    }

		    function integerLogarithm(value, base) {
		        if (base.compareTo(value) <= 0) {
		            var tmp = integerLogarithm(value, base.square(base));
		            var p = tmp.p;
		            var e = tmp.e;
		            var t = p.multiply(base);
		            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
		        }
		        return { p: bigInt(1), e: 0 };
		    }

		    BigInteger.prototype.bitLength = function () {
		        var n = this;
		        if (n.compareTo(bigInt(0)) < 0) {
		            n = n.negate().subtract(bigInt(1));
		        }
		        if (n.compareTo(bigInt(0)) === 0) {
		            return bigInt(0);
		        }
		        return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
		    };
		    NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

		    function max(a, b) {
		        a = parseValue(a);
		        b = parseValue(b);
		        return a.greater(b) ? a : b;
		    }
		    function min(a, b) {
		        a = parseValue(a);
		        b = parseValue(b);
		        return a.lesser(b) ? a : b;
		    }
		    function gcd(a, b) {
		        a = parseValue(a).abs();
		        b = parseValue(b).abs();
		        if (a.equals(b)) return a;
		        if (a.isZero()) return b;
		        if (b.isZero()) return a;
		        var c = Integer[1], d, t;
		        while (a.isEven() && b.isEven()) {
		            d = min(roughLOB(a), roughLOB(b));
		            a = a.divide(d);
		            b = b.divide(d);
		            c = c.multiply(d);
		        }
		        while (a.isEven()) {
		            a = a.divide(roughLOB(a));
		        }
		        do {
		            while (b.isEven()) {
		                b = b.divide(roughLOB(b));
		            }
		            if (a.greater(b)) {
		                t = b; b = a; a = t;
		            }
		            b = b.subtract(a);
		        } while (!b.isZero());
		        return c.isUnit() ? a : a.multiply(c);
		    }
		    function lcm(a, b) {
		        a = parseValue(a).abs();
		        b = parseValue(b).abs();
		        return a.divide(gcd(a, b)).multiply(b);
		    }
		    function randBetween(a, b, rng) {
		        a = parseValue(a);
		        b = parseValue(b);
		        var usedRNG = rng || Math.random;
		        var low = min(a, b), high = max(a, b);
		        var range = high.subtract(low).add(1);
		        if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
		        var digits = toBase(range, BASE).value;
		        var result = [], restricted = true;
		        for (var i = 0; i < digits.length; i++) {
		            var top = restricted ? digits[i] + (i + 1 < digits.length ? digits[i + 1] / BASE : 0) : BASE;
		            var digit = truncate(usedRNG() * top);
		            result.push(digit);
		            if (digit < digits[i]) restricted = false;
		        }
		        return low.add(Integer.fromArray(result, BASE, false));
		    }

		    var parseBase = function (text, base, alphabet, caseSensitive) {
		        alphabet = alphabet || DEFAULT_ALPHABET;
		        text = String(text);
		        if (!caseSensitive) {
		            text = text.toLowerCase();
		            alphabet = alphabet.toLowerCase();
		        }
		        var length = text.length;
		        var i;
		        var absBase = Math.abs(base);
		        var alphabetValues = {};
		        for (i = 0; i < alphabet.length; i++) {
		            alphabetValues[alphabet[i]] = i;
		        }
		        for (i = 0; i < length; i++) {
		            var c = text[i];
		            if (c === "-") continue;
		            if (c in alphabetValues) {
		                if (alphabetValues[c] >= absBase) {
		                    if (c === "1" && absBase === 1) continue;
		                    throw new Error(c + " is not a valid digit in base " + base + ".");
		                }
		            }
		        }
		        base = parseValue(base);
		        var digits = [];
		        var isNegative = text[0] === "-";
		        for (i = isNegative ? 1 : 0; i < text.length; i++) {
		            var c = text[i];
		            if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
		            else if (c === "<") {
		                var start = i;
		                do { i++; } while (text[i] !== ">" && i < text.length);
		                digits.push(parseValue(text.slice(start + 1, i)));
		            }
		            else throw new Error(c + " is not a valid character");
		        }
		        return parseBaseFromArray(digits, base, isNegative);
		    };

		    function parseBaseFromArray(digits, base, isNegative) {
		        var val = Integer[0], pow = Integer[1], i;
		        for (i = digits.length - 1; i >= 0; i--) {
		            val = val.add(digits[i].times(pow));
		            pow = pow.times(base);
		        }
		        return isNegative ? val.negate() : val;
		    }

		    function stringify(digit, alphabet) {
		        alphabet = alphabet || DEFAULT_ALPHABET;
		        if (digit < alphabet.length) {
		            return alphabet[digit];
		        }
		        return "<" + digit + ">";
		    }

		    function toBase(n, base) {
		        base = bigInt(base);
		        if (base.isZero()) {
		            if (n.isZero()) return { value: [0], isNegative: false };
		            throw new Error("Cannot convert nonzero numbers to base 0.");
		        }
		        if (base.equals(-1)) {
		            if (n.isZero()) return { value: [0], isNegative: false };
		            if (n.isNegative())
		                return {
		                    value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
		                        .map(Array.prototype.valueOf, [1, 0])
		                    ),
		                    isNegative: false
		                };

		            var arr = Array.apply(null, Array(n.toJSNumber() - 1))
		                .map(Array.prototype.valueOf, [0, 1]);
		            arr.unshift([1]);
		            return {
		                value: [].concat.apply([], arr),
		                isNegative: false
		            };
		        }

		        var neg = false;
		        if (n.isNegative() && base.isPositive()) {
		            neg = true;
		            n = n.abs();
		        }
		        if (base.isUnit()) {
		            if (n.isZero()) return { value: [0], isNegative: false };

		            return {
		                value: Array.apply(null, Array(n.toJSNumber()))
		                    .map(Number.prototype.valueOf, 1),
		                isNegative: neg
		            };
		        }
		        var out = [];
		        var left = n, divmod;
		        while (left.isNegative() || left.compareAbs(base) >= 0) {
		            divmod = left.divmod(base);
		            left = divmod.quotient;
		            var digit = divmod.remainder;
		            if (digit.isNegative()) {
		                digit = base.minus(digit).abs();
		                left = left.next();
		            }
		            out.push(digit.toJSNumber());
		        }
		        out.push(left.toJSNumber());
		        return { value: out.reverse(), isNegative: neg };
		    }

		    function toBaseString(n, base, alphabet) {
		        var arr = toBase(n, base);
		        return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
		            return stringify(x, alphabet);
		        }).join('');
		    }

		    BigInteger.prototype.toArray = function (radix) {
		        return toBase(this, radix);
		    };

		    SmallInteger.prototype.toArray = function (radix) {
		        return toBase(this, radix);
		    };

		    NativeBigInt.prototype.toArray = function (radix) {
		        return toBase(this, radix);
		    };

		    BigInteger.prototype.toString = function (radix, alphabet) {
		        if (radix === undefined$1) radix = 10;
		        if (radix !== 10) return toBaseString(this, radix, alphabet);
		        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
		        while (--l >= 0) {
		            digit = String(v[l]);
		            str += zeros.slice(digit.length) + digit;
		        }
		        var sign = this.sign ? "-" : "";
		        return sign + str;
		    };

		    SmallInteger.prototype.toString = function (radix, alphabet) {
		        if (radix === undefined$1) radix = 10;
		        if (radix != 10) return toBaseString(this, radix, alphabet);
		        return String(this.value);
		    };

		    NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

		    NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

		    BigInteger.prototype.valueOf = function () {
		        return parseInt(this.toString(), 10);
		    };
		    BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

		    SmallInteger.prototype.valueOf = function () {
		        return this.value;
		    };
		    SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
		    NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
		        return parseInt(this.toString(), 10);
		    };

		    function parseStringValue(v) {
		        if (isPrecise(+v)) {
		            var x = +v;
		            if (x === truncate(x))
		                return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
		            throw new Error("Invalid integer: " + v);
		        }
		        var sign = v[0] === "-";
		        if (sign) v = v.slice(1);
		        var split = v.split(/e/i);
		        if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
		        if (split.length === 2) {
		            var exp = split[1];
		            if (exp[0] === "+") exp = exp.slice(1);
		            exp = +exp;
		            if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
		            var text = split[0];
		            var decimalPlace = text.indexOf(".");
		            if (decimalPlace >= 0) {
		                exp -= text.length - decimalPlace - 1;
		                text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
		            }
		            if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
		            text += (new Array(exp + 1)).join("0");
		            v = text;
		        }
		        var isValid = /^([0-9][0-9]*)$/.test(v);
		        if (!isValid) throw new Error("Invalid integer: " + v);
		        if (supportsNativeBigInt) {
		            return new NativeBigInt(BigInt(sign ? "-" + v : v));
		        }
		        var r = [], max = v.length, l = LOG_BASE, min = max - l;
		        while (max > 0) {
		            r.push(+v.slice(min, max));
		            min -= l;
		            if (min < 0) min = 0;
		            max -= l;
		        }
		        trim(r);
		        return new BigInteger(r, sign);
		    }

		    function parseNumberValue(v) {
		        if (supportsNativeBigInt) {
		            return new NativeBigInt(BigInt(v));
		        }
		        if (isPrecise(v)) {
		            if (v !== truncate(v)) throw new Error(v + " is not an integer.");
		            return new SmallInteger(v);
		        }
		        return parseStringValue(v.toString());
		    }

		    function parseValue(v) {
		        if (typeof v === "number") {
		            return parseNumberValue(v);
		        }
		        if (typeof v === "string") {
		            return parseStringValue(v);
		        }
		        if (typeof v === "bigint") {
		            return new NativeBigInt(v);
		        }
		        return v;
		    }
		    // Pre-define numbers in range [-999,999]
		    for (var i = 0; i < 1000; i++) {
		        Integer[i] = parseValue(i);
		        if (i > 0) Integer[-i] = parseValue(-i);
		    }
		    // Backwards compatibility
		    Integer.one = Integer[1];
		    Integer.zero = Integer[0];
		    Integer.minusOne = Integer[-1];
		    Integer.max = max;
		    Integer.min = min;
		    Integer.gcd = gcd;
		    Integer.lcm = lcm;
		    Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
		    Integer.randBetween = randBetween;

		    Integer.fromArray = function (digits, base, isNegative) {
		        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
		    };

		    return Integer;
		})();

		// Node.js check
		if (module.hasOwnProperty("exports")) {
		    module.exports = bigInt;
		}
	} (BigInteger));
	return BigInteger.exports;
}

var BigIntegerExports = requireBigInteger();
var bigInt = /*@__PURE__*/getDefaultExportFromCjs(BigIntegerExports);

class Big {
    constructor(big) {
        if (big instanceof Big) {
            this.big = big.big;
            return;
        }
        switch (typeof big) {
            case "number":
            case "string":
            case "bigint":
                this.big = BigInt(big);
                break;
            case "object":
                if (big instanceof Uint8Array) {
                    this.big = this.bytesToBig(big);
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
    bytesToBig(bytes) {
        let hex = "";
        for (const b of bytes) {
            hex += b.toString(16).padStart(2, "0");
        }
        return BigInt("0x" + hex);
    }
    toBytes(option) {
        const size = this.byteLen();
        if (option === "fill") {
            Assert.check(size <= 8, MitumError.detail(ECODE.INVALID_BIG_INTEGER, "big out of range"));
            return new Uint8Array(new Int64.Uint64BE(this.toString()).toBuffer());
        }
        const buf = new Uint8Array(size);
        let n = bigInt(this.big);
        for (let i = size - 1; i >= 0; i--) {
            buf[i] = n.mod(256).valueOf();
            n = n.divide(256);
        }
        return buf;
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
class Bool {
    constructor(b) {
        this.b = b;
    }
    static from(b) {
        return b instanceof Bool ? b : new Bool(b);
    }
    toBytes() {
        return new Uint8Array([this.b ? 1 : 0]);
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
    toBytes() {
        return new TextEncoder().encode(this.UTC());
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
    toBytes(option) {
        return new TextEncoder().encode(option === "super" ? super.UTC() : this.UTC());
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
    CONTRACT_HANDLERS: getRangeConfig(0, 20),
    CONTRACT_RECIPIENTS: getRangeConfig(0, 20),
    KEYS_IN_ACCOUNT: getRangeConfig(1, 100),
    AMOUNTS_IN_ITEM: getRangeConfig(1, 10),
    ITEMS_IN_FACT: getRangeConfig(1, 100),
    OP_SIZE: getRangeConfig(1, 262144),
    FACT_HASHES: getRangeConfig(1, 40),
    MSG_SIZE: getRangeConfig(1, 1024),
    KEY: {
        MITUM: {
            PRIVATE: getRangeConfig(67),
            PUBLIC: getRangeConfig(69),
        }
    },
    NFT: {
        ROYALTY: getRangeConfig(0, 99),
        SHARE: getRangeConfig(0, 100),
        ADDRESS_IN_MINTER_WHITELIST: getRangeConfig(0, 20),
        SIGNERS_IN_SIGNERS: getRangeConfig(0, 10),
        HASH: getRangeConfig(1, 1024),
        URI: getRangeConfig(1, 1000),
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
        QUORUM: getRangeConfig(1, 100),
        VOTE: getRangeConfig(0, 255),
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
        FIXED_ITEM: "mitum-currency-fixed-item-feeer",
        FIXED_DETAILED: "mitum-currency-fixed-item-data-size-execution-feeer",
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
    },
    UPDATE_RECIPIENT: {
        FACT: "mitum-extension-update-recipient-operation-fact",
        OPERATION: "mitum-extension-update-recipient-operation",
    },
    EXTENSION: {
        AUTHENTICATION: "mitum-extension-base-authentication",
        PROXY_PAYER: "mitum-extension-base-proxy-payer",
        SETTLEMENT: "mitum-extension-base-settlement"
    }
};

var NFT$1 = {
    SIGNER: "mitum-nft-signer",
    SIGNERS: "mitum-nft-signers",
    REGISTER_MODEL: {
        FACT: "mitum-nft-register-model-operation-fact",
        OPERATION: "mitum-nft-register-model-operation",
    },
    UPDATE_MODEL_CONFIG: {
        FACT: "mitum-nft-update-model-config-operation-fact",
        OPERATION: "mitum-nft-update-model-config-operation",
    },
    MINT: {
        FORM: "mitum-nft-mint-form",
        ITEM: "mitum-nft-mint-item",
        FACT: "mitum-nft-mint-operation-fact",
        OPERATION: "mitum-nft-mint-operation",
    },
    APPROVE_ALL: {
        ITEM: "mitum-nft-approve-all-item",
        FACT: "mitum-nft-approve-all-operation-fact",
        OPERATION: "mitum-nft-approve-all-operation",
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
    ADD_SIGNATURE: {
        ITEM: "mitum-nft-add-signature-item",
        FACT: "mitum-nft-add-signature-operation-fact",
        OPERATION: "mitum-nft-add-signature-operation",
    }
};

var CREDENTIAL = {
    REGISTER_MODEL: {
        FACT: "mitum-credential-register-model-operation-fact",
        OPERATION: "mitum-credential-register-model-operation",
    },
    ADD_TEMPLATE: {
        FACT: "mitum-credential-add-template-operation-fact",
        OPERATION: "mitum-credential-add-template-operation",
    },
    ISSUE: {
        ITEM: "mitum-credential-issue-item",
        FACT: "mitum-credential-issue-operation-fact",
        OPERATION: "mitum-credential-issue-operation",
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
    REGISTER_MODEL: {
        FACT: "mitum-dao-register-model-operation-fact",
        OPERATION: "mitum-dao-register-model-operation",
    },
    UPDATE_MODEL_CONFIG: {
        FACT: "mitum-dao-update-model-config-operation-fact",
        OPERATION: "mitum-dao-update-model-config-operation",
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

var KYC = {
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

var STO = {
    CREATE_SECURITY_TOKEN: {
        ITEM: "mitum-sto-create-security-token-item",
        FACT: "mitum-sto-create-security-token-operation-fact",
        OPERATION: "mitum-sto-create-security-token-operation",
    },
    ISSUE: {
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
    TRANSFER_BY_PARTITION: {
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
    REGISTER_MODEL: {
        FACT: "mitum-timestamp-register-model-operation-fact",
        OPERATION: "mitum-timestamp-register-model-operation",
    },
    ISSUE: {
        FACT: "mitum-timestamp-issue-operation-fact",
        OPERATION: "mitum-timestamp-issue-operation",
    },
};

var TOKEN = {
    REGISTER_MODEL: {
        FACT: "mitum-token-register-model-operation-fact",
        OPERATION: "mitum-token-register-model-operation",
    },
    MINT: {
        FACT: "mitum-token-mint-operation-fact",
        OPERATION: "mitum-token-mint-operation",
    },
    TRANSFER: {
        ITEM: "mitum-token-transfer-item",
        FACT: "mitum-token-transfer-operation-fact",
        OPERATION: "mitum-token-transfer-operation"
    },
    APPROVE: {
        ITEM: "mitum-token-approve-item",
        FACT: "mitum-token-approve-operation-fact",
        OPERATION: "mitum-token-approve-operation",
    },
    BURN: {
        FACT: "mitum-token-burn-operation-fact",
        OPERATION: "mitum-token-burn-operation",
    },
    TRANSFER_FROM: {
        ITEM: "mitum-token-transfer-from-item",
        FACT: "mitum-token-transfer-from-operation-fact",
        OPERATION: "mitum-token-transfer-from-operation",
    }
};

var POINT = {
    REGISTER_MODEL: {
        FACT: "mitum-point-register-model-operation-fact",
        OPERATION: "mitum-point-register-model-operation",
    },
    MINT: {
        FACT: "mitum-point-mint-operation-fact",
        OPERATION: "mitum-point-mint-operation",
    },
    TRANSFER: {
        ITEM: "mitum-point-transfer-item",
        FACT: "mitum-point-transfer-operation-fact",
        OPERATION: "mitum-point-transfer-operation"
    },
    APPROVE: {
        ITEM: "mitum-point-approve-item",
        FACT: "mitum-point-approve-operation-fact",
        OPERATION: "mitum-point-approve-operation",
    },
    BURN: {
        FACT: "mitum-point-burn-operation-fact",
        OPERATION: "mitum-point-burn-operation",
    },
    TRANSFER_FROM: {
        ITEM: "mitum-point-transfer-from-item",
        FACT: "mitum-point-transfer-from-operation-fact",
        OPERATION: "mitum-point-transfer-from-operation",
    }
};

var STORAGE = {
    REGISTER_MODEL: {
        FACT: "mitum-storage-register-model-operation-fact",
        OPERATION: "mitum-storage-register-model-operation",
    },
    CREATE_DATA: {
        ITEM: "mitum-storage-create-data-item",
        FACT: "mitum-storage-create-data-operation-fact",
        OPERATION: "mitum-storage-create-data-operation",
    },
    DELETE_DATA: {
        FACT: "mitum-storage-delete-data-operation-fact",
        OPERATION: "mitum-storage-delete-data-operation",
    },
    UPDATE_DATA: {
        ITEM: "mitum-storage-update-data-item",
        FACT: "mitum-storage-update-data-operation-fact",
        OPERATION: "mitum-storage-update-data-operation",
    },
};

var PAYMENT = {
    REGISTER_MODEL: {
        FACT: "mitum-payment-register-model-operation-fact",
        OPERATION: "mitum-payment-register-model-operation",
    },
    DEPOSIT: {
        FACT: "mitum-payment-deposit-operation-fact",
        OPERATION: "mitum-payment-deposit-operation",
    },
    UPDATE_ACCOUNT_SETTING: {
        FACT: "mitum-payment-update-account-setting-operation-fact",
        OPERATION: "mitum-payment-update-account-setting-operation",
    },
    WITHDRAW: {
        FACT: "mitum-payment-withdraw-operation-fact",
        OPERATION: "mitum-payment-withdraw-operation",
    },
    TRANSFER: {
        FACT: "mitum-payment-transfer-operation-fact",
        OPERATION: "mitum-payment-transfer-operation",
    }
};

var DID = {
    REGISTER_MODEL: {
        FACT: "mitum-did-register-model-operation-fact",
        OPERATION: "mitum-did-register-model-operation",
    },
    CREATE_DID: {
        FACT: "mitum-did-create-did-operation-fact",
        OPERATION: "mitum-did-create-did-operation",
    },
    UPDATE_DID_DOCUMENT: {
        FACT: "mitum-did-update-did-document-operation-fact",
        OPERATION: "mitum-did-update-did-document-operation",
    },
    DOCUMENT: "mitum-did-document",
    AUTHENTICATION: "mitum-did-verification-method",
    VERIFICATION_METHOD: "mitum-did-verification-method-authentication"
};

var HINT = {
    FACT_SIGN: "base-fact-sign",
    CURRENCY,
    NFT: NFT$1,
    CREDENTIAL,
    DAO: DAO$1,
    KYC,
    STO,
    TIMESTAMP,
    TOKEN,
    POINT,
    STORAGE,
    PAYMENT,
    DID
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
    static hasVersion(s) {
        const suffix = `-${Version.get()}`;
        return s.endsWith(suffix);
    }
    static fromString(s) {
        if (!Hint.hasVersion(s)) {
            throw new Error(`Invalid hinted string (missing version): ${s}`);
        }
        const suffix = `-${Version.get()}`;
        return new Hint(s.slice(0, -suffix.length));
    }
}

function bytesToBase64(bytes) {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(bytes).toString("base64");
    }
    let binary = "";
    for (const b of bytes) {
        binary += String.fromCharCode(b);
    }
    return btoa(binary);
}
const base64ToBytes = (b64) => {
    if (typeof atob !== "undefined") {
        return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    }
    else {
        return Uint8Array.from(Buffer.from(b64, "base64"));
    }
};
const bytesToUtf8 = (bytes) => {
    return new TextDecoder().decode(bytes);
};

const encoder$g = new TextEncoder();
let Token$1 = class Token {
    constructor(s) {
        Assert.check(s !== "", MitumError.detail(ECODE.INVALID_TOKEN, "empty token"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Token ? s : new Token(s);
    }
    toBytes() {
        return encoder$g.encode(this.s);
    }
    toString() {
        return bytesToBase64(this.toBytes());
    }
};

const encoder$f = new TextEncoder();
class ID {
    constructor(s) {
        this.s = s;
    }
    equal(id) {
        return this.toString() === id.toString();
    }
    toBytes() {
        return encoder$f.encode(this.s);
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

function isBytes(data) {
    return (data instanceof Uint8Array ||
        (typeof data === "object" &&
            data !== null &&
            "buffer" in data &&
            "byteLength" in data));
}
function toBytes$2(data) {
    if (isBytes(data))
        return new Uint8Array(data);
    if (typeof data === "string") {
        return hexToBytes$1(data);
    }
    return new Uint8Array(data);
}
function concatBytes(arrays) {
    const total = arrays.reduce((sum, a) => sum + a.length, 0);
    const result = new Uint8Array(total);
    let offset = 0;
    for (const a of arrays) {
        result.set(a, offset);
        offset += a.length;
    }
    return result;
}
function hexToBytes$1(hex) {
    if (hex.length % 2 !== 0) {
        throw new Error("Invalid hex length");
    }
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

class Amount {
    constructor(currency, big) {
        this.hint = new Hint(HINT.CURRENCY.AMOUNT);
        this.currency = CurrencyID.from(currency);
        this.big = Big.from(big);
        Assert.check(this.big.big > 0, MitumError.detail(ECODE.INVALID_AMOUNT, "amount must be over zero"));
    }
    toBytes() {
        return concatBytes([
            this.big.toBytes(),
            this.currency.toBytes(),
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
class Fee {
    constructor(currency, big) {
        this.hint = new Hint(HINT.CURRENCY.AMOUNT);
        this.currency = CurrencyID.from(currency);
        this.big = Big.from(big);
        Assert.check(0 <= this.big.big, MitumError.detail(ECODE.INVALID_FACT, "fee must not be under zero"));
    }
    toBytes() {
        return concatBytes([
            this.big.toBytes(),
            this.currency.toBytes(),
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

var sha3$1 = {exports: {}};

/**
 * [js-sha3]{@link https://github.com/emn178/js-sha3}
 *
 * @version 0.8.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2015-2018
 * @license MIT
 */

var hasRequiredSha3;

function requireSha3 () {
	if (hasRequiredSha3) return sha3$1.exports;
	hasRequiredSha3 = 1;
	(function (module) {
		/*jslint bitwise: true */
		(function () {

		  var INPUT_ERROR = 'input is invalid type';
		  var FINALIZE_ERROR = 'finalize already called';
		  var WINDOW = typeof window === 'object';
		  var root = WINDOW ? window : {};
		  if (root.JS_SHA3_NO_WINDOW) {
		    WINDOW = false;
		  }
		  var WEB_WORKER = !WINDOW && typeof self === 'object';
		  var NODE_JS = !root.JS_SHA3_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
		  if (NODE_JS) {
		    root = commonjsGlobal;
		  } else if (WEB_WORKER) {
		    root = self;
		  }
		  var COMMON_JS = !root.JS_SHA3_NO_COMMON_JS && 'object' === 'object' && module.exports;
		  var ARRAY_BUFFER = !root.JS_SHA3_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
		  var HEX_CHARS = '0123456789abcdef'.split('');
		  var SHAKE_PADDING = [31, 7936, 2031616, 520093696];
		  var CSHAKE_PADDING = [4, 1024, 262144, 67108864];
		  var KECCAK_PADDING = [1, 256, 65536, 16777216];
		  var PADDING = [6, 1536, 393216, 100663296];
		  var SHIFT = [0, 8, 16, 24];
		  var RC = [1, 0, 32898, 0, 32906, 2147483648, 2147516416, 2147483648, 32907, 0, 2147483649,
		    0, 2147516545, 2147483648, 32777, 2147483648, 138, 0, 136, 0, 2147516425, 0,
		    2147483658, 0, 2147516555, 0, 139, 2147483648, 32905, 2147483648, 32771,
		    2147483648, 32770, 2147483648, 128, 2147483648, 32778, 0, 2147483658, 2147483648,
		    2147516545, 2147483648, 32896, 2147483648, 2147483649, 0, 2147516424, 2147483648];
		  var BITS = [224, 256, 384, 512];
		  var SHAKE_BITS = [128, 256];
		  var OUTPUT_TYPES = ['hex', 'buffer', 'arrayBuffer', 'array', 'digest'];
		  var CSHAKE_BYTEPAD = {
		    '128': 168,
		    '256': 136
		  };

		  if (root.JS_SHA3_NO_NODE_JS || !Array.isArray) {
		    Array.isArray = function (obj) {
		      return Object.prototype.toString.call(obj) === '[object Array]';
		    };
		  }

		  if (ARRAY_BUFFER && (root.JS_SHA3_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
		    ArrayBuffer.isView = function (obj) {
		      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
		    };
		  }

		  var createOutputMethod = function (bits, padding, outputType) {
		    return function (message) {
		      return new Keccak(bits, padding, bits).update(message)[outputType]();
		    };
		  };

		  var createShakeOutputMethod = function (bits, padding, outputType) {
		    return function (message, outputBits) {
		      return new Keccak(bits, padding, outputBits).update(message)[outputType]();
		    };
		  };

		  var createCshakeOutputMethod = function (bits, padding, outputType) {
		    return function (message, outputBits, n, s) {
		      return methods['cshake' + bits].update(message, outputBits, n, s)[outputType]();
		    };
		  };

		  var createKmacOutputMethod = function (bits, padding, outputType) {
		    return function (key, message, outputBits, s) {
		      return methods['kmac' + bits].update(key, message, outputBits, s)[outputType]();
		    };
		  };

		  var createOutputMethods = function (method, createMethod, bits, padding) {
		    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
		      var type = OUTPUT_TYPES[i];
		      method[type] = createMethod(bits, padding, type);
		    }
		    return method;
		  };

		  var createMethod = function (bits, padding) {
		    var method = createOutputMethod(bits, padding, 'hex');
		    method.create = function () {
		      return new Keccak(bits, padding, bits);
		    };
		    method.update = function (message) {
		      return method.create().update(message);
		    };
		    return createOutputMethods(method, createOutputMethod, bits, padding);
		  };

		  var createShakeMethod = function (bits, padding) {
		    var method = createShakeOutputMethod(bits, padding, 'hex');
		    method.create = function (outputBits) {
		      return new Keccak(bits, padding, outputBits);
		    };
		    method.update = function (message, outputBits) {
		      return method.create(outputBits).update(message);
		    };
		    return createOutputMethods(method, createShakeOutputMethod, bits, padding);
		  };

		  var createCshakeMethod = function (bits, padding) {
		    var w = CSHAKE_BYTEPAD[bits];
		    var method = createCshakeOutputMethod(bits, padding, 'hex');
		    method.create = function (outputBits, n, s) {
		      if (!n && !s) {
		        return methods['shake' + bits].create(outputBits);
		      } else {
		        return new Keccak(bits, padding, outputBits).bytepad([n, s], w);
		      }
		    };
		    method.update = function (message, outputBits, n, s) {
		      return method.create(outputBits, n, s).update(message);
		    };
		    return createOutputMethods(method, createCshakeOutputMethod, bits, padding);
		  };

		  var createKmacMethod = function (bits, padding) {
		    var w = CSHAKE_BYTEPAD[bits];
		    var method = createKmacOutputMethod(bits, padding, 'hex');
		    method.create = function (key, outputBits, s) {
		      return new Kmac(bits, padding, outputBits).bytepad(['KMAC', s], w).bytepad([key], w);
		    };
		    method.update = function (key, message, outputBits, s) {
		      return method.create(key, outputBits, s).update(message);
		    };
		    return createOutputMethods(method, createKmacOutputMethod, bits, padding);
		  };

		  var algorithms = [
		    { name: 'keccak', padding: KECCAK_PADDING, bits: BITS, createMethod: createMethod },
		    { name: 'sha3', padding: PADDING, bits: BITS, createMethod: createMethod },
		    { name: 'shake', padding: SHAKE_PADDING, bits: SHAKE_BITS, createMethod: createShakeMethod },
		    { name: 'cshake', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createCshakeMethod },
		    { name: 'kmac', padding: CSHAKE_PADDING, bits: SHAKE_BITS, createMethod: createKmacMethod }
		  ];

		  var methods = {}, methodNames = [];

		  for (var i = 0; i < algorithms.length; ++i) {
		    var algorithm = algorithms[i];
		    var bits = algorithm.bits;
		    for (var j = 0; j < bits.length; ++j) {
		      var methodName = algorithm.name + '_' + bits[j];
		      methodNames.push(methodName);
		      methods[methodName] = algorithm.createMethod(bits[j], algorithm.padding);
		      if (algorithm.name !== 'sha3') {
		        var newMethodName = algorithm.name + bits[j];
		        methodNames.push(newMethodName);
		        methods[newMethodName] = methods[methodName];
		      }
		    }
		  }

		  function Keccak(bits, padding, outputBits) {
		    this.blocks = [];
		    this.s = [];
		    this.padding = padding;
		    this.outputBits = outputBits;
		    this.reset = true;
		    this.finalized = false;
		    this.block = 0;
		    this.start = 0;
		    this.blockCount = (1600 - (bits << 1)) >> 5;
		    this.byteCount = this.blockCount << 2;
		    this.outputBlocks = outputBits >> 5;
		    this.extraBytes = (outputBits & 31) >> 3;

		    for (var i = 0; i < 50; ++i) {
		      this.s[i] = 0;
		    }
		  }

		  Keccak.prototype.update = function (message) {
		    if (this.finalized) {
		      throw new Error(FINALIZE_ERROR);
		    }
		    var notString, type = typeof message;
		    if (type !== 'string') {
		      if (type === 'object') {
		        if (message === null) {
		          throw new Error(INPUT_ERROR);
		        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
		          message = new Uint8Array(message);
		        } else if (!Array.isArray(message)) {
		          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
		            throw new Error(INPUT_ERROR);
		          }
		        }
		      } else {
		        throw new Error(INPUT_ERROR);
		      }
		      notString = true;
		    }
		    var blocks = this.blocks, byteCount = this.byteCount, length = message.length,
		      blockCount = this.blockCount, index = 0, s = this.s, i, code;

		    while (index < length) {
		      if (this.reset) {
		        this.reset = false;
		        blocks[0] = this.block;
		        for (i = 1; i < blockCount + 1; ++i) {
		          blocks[i] = 0;
		        }
		      }
		      if (notString) {
		        for (i = this.start; index < length && i < byteCount; ++index) {
		          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
		        }
		      } else {
		        for (i = this.start; index < length && i < byteCount; ++index) {
		          code = message.charCodeAt(index);
		          if (code < 0x80) {
		            blocks[i >> 2] |= code << SHIFT[i++ & 3];
		          } else if (code < 0x800) {
		            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
		            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
		          } else if (code < 0xd800 || code >= 0xe000) {
		            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
		            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
		            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
		          } else {
		            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
		            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
		            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
		            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
		            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
		          }
		        }
		      }
		      this.lastByteIndex = i;
		      if (i >= byteCount) {
		        this.start = i - byteCount;
		        this.block = blocks[blockCount];
		        for (i = 0; i < blockCount; ++i) {
		          s[i] ^= blocks[i];
		        }
		        f(s);
		        this.reset = true;
		      } else {
		        this.start = i;
		      }
		    }
		    return this;
		  };

		  Keccak.prototype.encode = function (x, right) {
		    var o = x & 255, n = 1;
		    var bytes = [o];
		    x = x >> 8;
		    o = x & 255;
		    while (o > 0) {
		      bytes.unshift(o);
		      x = x >> 8;
		      o = x & 255;
		      ++n;
		    }
		    if (right) {
		      bytes.push(n);
		    } else {
		      bytes.unshift(n);
		    }
		    this.update(bytes);
		    return bytes.length;
		  };

		  Keccak.prototype.encodeString = function (str) {
		    var notString, type = typeof str;
		    if (type !== 'string') {
		      if (type === 'object') {
		        if (str === null) {
		          throw new Error(INPUT_ERROR);
		        } else if (ARRAY_BUFFER && str.constructor === ArrayBuffer) {
		          str = new Uint8Array(str);
		        } else if (!Array.isArray(str)) {
		          if (!ARRAY_BUFFER || !ArrayBuffer.isView(str)) {
		            throw new Error(INPUT_ERROR);
		          }
		        }
		      } else {
		        throw new Error(INPUT_ERROR);
		      }
		      notString = true;
		    }
		    var bytes = 0, length = str.length;
		    if (notString) {
		      bytes = length;
		    } else {
		      for (var i = 0; i < str.length; ++i) {
		        var code = str.charCodeAt(i);
		        if (code < 0x80) {
		          bytes += 1;
		        } else if (code < 0x800) {
		          bytes += 2;
		        } else if (code < 0xd800 || code >= 0xe000) {
		          bytes += 3;
		        } else {
		          code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(++i) & 0x3ff));
		          bytes += 4;
		        }
		      }
		    }
		    bytes += this.encode(bytes * 8);
		    this.update(str);
		    return bytes;
		  };

		  Keccak.prototype.bytepad = function (strs, w) {
		    var bytes = this.encode(w);
		    for (var i = 0; i < strs.length; ++i) {
		      bytes += this.encodeString(strs[i]);
		    }
		    var paddingBytes = w - bytes % w;
		    var zeros = [];
		    zeros.length = paddingBytes;
		    this.update(zeros);
		    return this;
		  };

		  Keccak.prototype.finalize = function () {
		    if (this.finalized) {
		      return;
		    }
		    this.finalized = true;
		    var blocks = this.blocks, i = this.lastByteIndex, blockCount = this.blockCount, s = this.s;
		    blocks[i >> 2] |= this.padding[i & 3];
		    if (this.lastByteIndex === this.byteCount) {
		      blocks[0] = blocks[blockCount];
		      for (i = 1; i < blockCount + 1; ++i) {
		        blocks[i] = 0;
		      }
		    }
		    blocks[blockCount - 1] |= 0x80000000;
		    for (i = 0; i < blockCount; ++i) {
		      s[i] ^= blocks[i];
		    }
		    f(s);
		  };

		  Keccak.prototype.toString = Keccak.prototype.hex = function () {
		    this.finalize();

		    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
		      extraBytes = this.extraBytes, i = 0, j = 0;
		    var hex = '', block;
		    while (j < outputBlocks) {
		      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
		        block = s[i];
		        hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F] +
		          HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F] +
		          HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F] +
		          HEX_CHARS[(block >> 28) & 0x0F] + HEX_CHARS[(block >> 24) & 0x0F];
		      }
		      if (j % blockCount === 0) {
		        f(s);
		        i = 0;
		      }
		    }
		    if (extraBytes) {
		      block = s[i];
		      hex += HEX_CHARS[(block >> 4) & 0x0F] + HEX_CHARS[block & 0x0F];
		      if (extraBytes > 1) {
		        hex += HEX_CHARS[(block >> 12) & 0x0F] + HEX_CHARS[(block >> 8) & 0x0F];
		      }
		      if (extraBytes > 2) {
		        hex += HEX_CHARS[(block >> 20) & 0x0F] + HEX_CHARS[(block >> 16) & 0x0F];
		      }
		    }
		    return hex;
		  };

		  Keccak.prototype.arrayBuffer = function () {
		    this.finalize();

		    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
		      extraBytes = this.extraBytes, i = 0, j = 0;
		    var bytes = this.outputBits >> 3;
		    var buffer;
		    if (extraBytes) {
		      buffer = new ArrayBuffer((outputBlocks + 1) << 2);
		    } else {
		      buffer = new ArrayBuffer(bytes);
		    }
		    var array = new Uint32Array(buffer);
		    while (j < outputBlocks) {
		      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
		        array[j] = s[i];
		      }
		      if (j % blockCount === 0) {
		        f(s);
		      }
		    }
		    if (extraBytes) {
		      array[i] = s[i];
		      buffer = buffer.slice(0, bytes);
		    }
		    return buffer;
		  };

		  Keccak.prototype.buffer = Keccak.prototype.arrayBuffer;

		  Keccak.prototype.digest = Keccak.prototype.array = function () {
		    this.finalize();

		    var blockCount = this.blockCount, s = this.s, outputBlocks = this.outputBlocks,
		      extraBytes = this.extraBytes, i = 0, j = 0;
		    var array = [], offset, block;
		    while (j < outputBlocks) {
		      for (i = 0; i < blockCount && j < outputBlocks; ++i, ++j) {
		        offset = j << 2;
		        block = s[i];
		        array[offset] = block & 0xFF;
		        array[offset + 1] = (block >> 8) & 0xFF;
		        array[offset + 2] = (block >> 16) & 0xFF;
		        array[offset + 3] = (block >> 24) & 0xFF;
		      }
		      if (j % blockCount === 0) {
		        f(s);
		      }
		    }
		    if (extraBytes) {
		      offset = j << 2;
		      block = s[i];
		      array[offset] = block & 0xFF;
		      if (extraBytes > 1) {
		        array[offset + 1] = (block >> 8) & 0xFF;
		      }
		      if (extraBytes > 2) {
		        array[offset + 2] = (block >> 16) & 0xFF;
		      }
		    }
		    return array;
		  };

		  function Kmac(bits, padding, outputBits) {
		    Keccak.call(this, bits, padding, outputBits);
		  }

		  Kmac.prototype = new Keccak();

		  Kmac.prototype.finalize = function () {
		    this.encode(this.outputBits, true);
		    return Keccak.prototype.finalize.call(this);
		  };

		  var f = function (s) {
		    var h, l, n, c0, c1, c2, c3, c4, c5, c6, c7, c8, c9,
		      b0, b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12, b13, b14, b15, b16, b17,
		      b18, b19, b20, b21, b22, b23, b24, b25, b26, b27, b28, b29, b30, b31, b32, b33,
		      b34, b35, b36, b37, b38, b39, b40, b41, b42, b43, b44, b45, b46, b47, b48, b49;
		    for (n = 0; n < 48; n += 2) {
		      c0 = s[0] ^ s[10] ^ s[20] ^ s[30] ^ s[40];
		      c1 = s[1] ^ s[11] ^ s[21] ^ s[31] ^ s[41];
		      c2 = s[2] ^ s[12] ^ s[22] ^ s[32] ^ s[42];
		      c3 = s[3] ^ s[13] ^ s[23] ^ s[33] ^ s[43];
		      c4 = s[4] ^ s[14] ^ s[24] ^ s[34] ^ s[44];
		      c5 = s[5] ^ s[15] ^ s[25] ^ s[35] ^ s[45];
		      c6 = s[6] ^ s[16] ^ s[26] ^ s[36] ^ s[46];
		      c7 = s[7] ^ s[17] ^ s[27] ^ s[37] ^ s[47];
		      c8 = s[8] ^ s[18] ^ s[28] ^ s[38] ^ s[48];
		      c9 = s[9] ^ s[19] ^ s[29] ^ s[39] ^ s[49];

		      h = c8 ^ ((c2 << 1) | (c3 >>> 31));
		      l = c9 ^ ((c3 << 1) | (c2 >>> 31));
		      s[0] ^= h;
		      s[1] ^= l;
		      s[10] ^= h;
		      s[11] ^= l;
		      s[20] ^= h;
		      s[21] ^= l;
		      s[30] ^= h;
		      s[31] ^= l;
		      s[40] ^= h;
		      s[41] ^= l;
		      h = c0 ^ ((c4 << 1) | (c5 >>> 31));
		      l = c1 ^ ((c5 << 1) | (c4 >>> 31));
		      s[2] ^= h;
		      s[3] ^= l;
		      s[12] ^= h;
		      s[13] ^= l;
		      s[22] ^= h;
		      s[23] ^= l;
		      s[32] ^= h;
		      s[33] ^= l;
		      s[42] ^= h;
		      s[43] ^= l;
		      h = c2 ^ ((c6 << 1) | (c7 >>> 31));
		      l = c3 ^ ((c7 << 1) | (c6 >>> 31));
		      s[4] ^= h;
		      s[5] ^= l;
		      s[14] ^= h;
		      s[15] ^= l;
		      s[24] ^= h;
		      s[25] ^= l;
		      s[34] ^= h;
		      s[35] ^= l;
		      s[44] ^= h;
		      s[45] ^= l;
		      h = c4 ^ ((c8 << 1) | (c9 >>> 31));
		      l = c5 ^ ((c9 << 1) | (c8 >>> 31));
		      s[6] ^= h;
		      s[7] ^= l;
		      s[16] ^= h;
		      s[17] ^= l;
		      s[26] ^= h;
		      s[27] ^= l;
		      s[36] ^= h;
		      s[37] ^= l;
		      s[46] ^= h;
		      s[47] ^= l;
		      h = c6 ^ ((c0 << 1) | (c1 >>> 31));
		      l = c7 ^ ((c1 << 1) | (c0 >>> 31));
		      s[8] ^= h;
		      s[9] ^= l;
		      s[18] ^= h;
		      s[19] ^= l;
		      s[28] ^= h;
		      s[29] ^= l;
		      s[38] ^= h;
		      s[39] ^= l;
		      s[48] ^= h;
		      s[49] ^= l;

		      b0 = s[0];
		      b1 = s[1];
		      b32 = (s[11] << 4) | (s[10] >>> 28);
		      b33 = (s[10] << 4) | (s[11] >>> 28);
		      b14 = (s[20] << 3) | (s[21] >>> 29);
		      b15 = (s[21] << 3) | (s[20] >>> 29);
		      b46 = (s[31] << 9) | (s[30] >>> 23);
		      b47 = (s[30] << 9) | (s[31] >>> 23);
		      b28 = (s[40] << 18) | (s[41] >>> 14);
		      b29 = (s[41] << 18) | (s[40] >>> 14);
		      b20 = (s[2] << 1) | (s[3] >>> 31);
		      b21 = (s[3] << 1) | (s[2] >>> 31);
		      b2 = (s[13] << 12) | (s[12] >>> 20);
		      b3 = (s[12] << 12) | (s[13] >>> 20);
		      b34 = (s[22] << 10) | (s[23] >>> 22);
		      b35 = (s[23] << 10) | (s[22] >>> 22);
		      b16 = (s[33] << 13) | (s[32] >>> 19);
		      b17 = (s[32] << 13) | (s[33] >>> 19);
		      b48 = (s[42] << 2) | (s[43] >>> 30);
		      b49 = (s[43] << 2) | (s[42] >>> 30);
		      b40 = (s[5] << 30) | (s[4] >>> 2);
		      b41 = (s[4] << 30) | (s[5] >>> 2);
		      b22 = (s[14] << 6) | (s[15] >>> 26);
		      b23 = (s[15] << 6) | (s[14] >>> 26);
		      b4 = (s[25] << 11) | (s[24] >>> 21);
		      b5 = (s[24] << 11) | (s[25] >>> 21);
		      b36 = (s[34] << 15) | (s[35] >>> 17);
		      b37 = (s[35] << 15) | (s[34] >>> 17);
		      b18 = (s[45] << 29) | (s[44] >>> 3);
		      b19 = (s[44] << 29) | (s[45] >>> 3);
		      b10 = (s[6] << 28) | (s[7] >>> 4);
		      b11 = (s[7] << 28) | (s[6] >>> 4);
		      b42 = (s[17] << 23) | (s[16] >>> 9);
		      b43 = (s[16] << 23) | (s[17] >>> 9);
		      b24 = (s[26] << 25) | (s[27] >>> 7);
		      b25 = (s[27] << 25) | (s[26] >>> 7);
		      b6 = (s[36] << 21) | (s[37] >>> 11);
		      b7 = (s[37] << 21) | (s[36] >>> 11);
		      b38 = (s[47] << 24) | (s[46] >>> 8);
		      b39 = (s[46] << 24) | (s[47] >>> 8);
		      b30 = (s[8] << 27) | (s[9] >>> 5);
		      b31 = (s[9] << 27) | (s[8] >>> 5);
		      b12 = (s[18] << 20) | (s[19] >>> 12);
		      b13 = (s[19] << 20) | (s[18] >>> 12);
		      b44 = (s[29] << 7) | (s[28] >>> 25);
		      b45 = (s[28] << 7) | (s[29] >>> 25);
		      b26 = (s[38] << 8) | (s[39] >>> 24);
		      b27 = (s[39] << 8) | (s[38] >>> 24);
		      b8 = (s[48] << 14) | (s[49] >>> 18);
		      b9 = (s[49] << 14) | (s[48] >>> 18);

		      s[0] = b0 ^ (~b2 & b4);
		      s[1] = b1 ^ (~b3 & b5);
		      s[10] = b10 ^ (~b12 & b14);
		      s[11] = b11 ^ (~b13 & b15);
		      s[20] = b20 ^ (~b22 & b24);
		      s[21] = b21 ^ (~b23 & b25);
		      s[30] = b30 ^ (~b32 & b34);
		      s[31] = b31 ^ (~b33 & b35);
		      s[40] = b40 ^ (~b42 & b44);
		      s[41] = b41 ^ (~b43 & b45);
		      s[2] = b2 ^ (~b4 & b6);
		      s[3] = b3 ^ (~b5 & b7);
		      s[12] = b12 ^ (~b14 & b16);
		      s[13] = b13 ^ (~b15 & b17);
		      s[22] = b22 ^ (~b24 & b26);
		      s[23] = b23 ^ (~b25 & b27);
		      s[32] = b32 ^ (~b34 & b36);
		      s[33] = b33 ^ (~b35 & b37);
		      s[42] = b42 ^ (~b44 & b46);
		      s[43] = b43 ^ (~b45 & b47);
		      s[4] = b4 ^ (~b6 & b8);
		      s[5] = b5 ^ (~b7 & b9);
		      s[14] = b14 ^ (~b16 & b18);
		      s[15] = b15 ^ (~b17 & b19);
		      s[24] = b24 ^ (~b26 & b28);
		      s[25] = b25 ^ (~b27 & b29);
		      s[34] = b34 ^ (~b36 & b38);
		      s[35] = b35 ^ (~b37 & b39);
		      s[44] = b44 ^ (~b46 & b48);
		      s[45] = b45 ^ (~b47 & b49);
		      s[6] = b6 ^ (~b8 & b0);
		      s[7] = b7 ^ (~b9 & b1);
		      s[16] = b16 ^ (~b18 & b10);
		      s[17] = b17 ^ (~b19 & b11);
		      s[26] = b26 ^ (~b28 & b20);
		      s[27] = b27 ^ (~b29 & b21);
		      s[36] = b36 ^ (~b38 & b30);
		      s[37] = b37 ^ (~b39 & b31);
		      s[46] = b46 ^ (~b48 & b40);
		      s[47] = b47 ^ (~b49 & b41);
		      s[8] = b8 ^ (~b0 & b2);
		      s[9] = b9 ^ (~b1 & b3);
		      s[18] = b18 ^ (~b10 & b12);
		      s[19] = b19 ^ (~b11 & b13);
		      s[28] = b28 ^ (~b20 & b22);
		      s[29] = b29 ^ (~b21 & b23);
		      s[38] = b38 ^ (~b30 & b32);
		      s[39] = b39 ^ (~b31 & b33);
		      s[48] = b48 ^ (~b40 & b42);
		      s[49] = b49 ^ (~b41 & b43);

		      s[0] ^= RC[n];
		      s[1] ^= RC[n + 1];
		    }
		  };

		  if (COMMON_JS) {
		    module.exports = methods;
		  } else {
		    for (i = 0; i < methodNames.length; ++i) {
		      root[methodNames[i]] = methods[methodNames[i]];
		    }
		  }
		})(); 
	} (sha3$1));
	return sha3$1.exports;
}

var sha3Exports = requireSha3();

function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
function hash(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number(hash.outputLen);
    number(hash.blockLen);
}
function exists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated, we can just drop the import.
const u8a = (a) => a instanceof Uint8Array;
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
// big-endian hardware is rare. Just in case someone still decides to run hashes:
// early-throw an error because we don't support BE yet.
const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
if (!isLE)
    throw new Error('Non little-endian hardware is not supported');
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$1(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    if (!u8a(data))
        throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
}
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes$1(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}

// Polyfill for Safari 14
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
class SHA2 extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
    }
    update(data) {
        exists(this);
        const { view, buffer, blockLen } = this;
        data = toBytes$1(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        exists(this);
        output(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}

// SHA2-256 need to try 2^128 hashes to execute birthday attack.
// BTC network is doing 2^67 hashes/sec as per early 2023.
// Choice: a ? b : c
const Chi = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K = /* @__PURE__ */ new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV = /* @__PURE__ */ new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends SHA2 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = (sigma0 + Maj(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$1 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

const encoder$e = new TextEncoder();
function toBytes(msg) {
    return typeof msg === "string" ? encoder$e.encode(msg) : msg;
}
const sha256 = (msg) => {
    return sha256$1(toBytes(msg));
};
const sha3 = (msg) => {
    return new Uint8Array(sha3Exports.sha3_256.create().update(toBytes(msg)).digest());
};
const keccak256 = (msg) => {
    return new Uint8Array(sha3Exports.keccak256.create().update(toBytes(msg)).digest());
};
const getChecksum = (hex) => {
    const hexLower = hex.toLowerCase();
    const hashBytes = keccak256(encoder$e.encode(hexLower));
    let hashHex = "";
    for (const b of hashBytes) {
        hashHex += b.toString(16).padStart(2, "0");
    }
    let checksum = "";
    for (let i = 0; i < hexLower.length; i++) {
        checksum += parseInt(hashHex[i], 16) > 7
            ? hexLower[i].toUpperCase()
            : hexLower[i];
    }
    return checksum;
};

const encoder$d = new TextEncoder();
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
    toBytes() {
        return encoder$d.encode(this.s);
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

const encoder$c = new TextEncoder();
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
    toBytes() {
        return encoder$c.encode(this.toString());
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.weight.toBytes("fill"),
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
        this._keys = keys.map(k => k instanceof PubKey ? k : new PubKey(k[0], k[1]));
        this.threshold = threshold instanceof Big ? threshold : new Big(threshold);
        const _sum = this._keys.reduce((total, key) => total + key.weight.v, 0);
        Assert.check(this.threshold.v <= _sum, MitumError.detail(ECODE.INVALID_KEYS, `sum of weights under threshold, ${_sum} < ${this.threshold.v}`));
        Assert.check(Config.THRESHOLD.satisfy(this.threshold.v), MitumError.detail(ECODE.INVALID_KEYS, "threshold out of range"));
        Assert.check(new Set(this._keys.map(k => k.toString())).size === this._keys.length, MitumError.detail(ECODE.INVALID_KEYS, "duplicate keys found in keys"));
    }
    get keys() {
        return this._keys;
    }
    sortKeys() {
        return [...this._keys].sort((a, b) => {
            const ab = a.toBytes();
            const bb = b.toBytes();
            const len = Math.min(ab.length, bb.length);
            for (let i = 0; i < len; i++) {
                if (ab[i] !== bb[i])
                    return ab[i] - bb[i];
            }
            return ab.length - bb.length;
        });
    }
    get checksum() {
        const raw = keccak256(this.toBytes()).slice(12);
        let hex = "";
        for (const b of raw) {
            hex += b.toString(16).padStart(2, "0");
        }
        const hash = keccak256(encoder$c.encode(hex));
        const hashHex = Array.from(hash)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
        let checksum = "0x";
        for (let i = 0; i < hex.length; i++) {
            checksum += parseInt(hashHex[i], 16) > 7
                ? hex[i].toUpperCase()
                : hex[i];
        }
        return new Address(checksum + SUFFIX.ADDRESS.MITUM);
    }
    toBytes() {
        return concatBytes([
            concatBytes(this.sortKeys().map(k => k.toBytes())),
            this.threshold.toBytes("fill"),
        ]);
    }
    toHintedObject() {
        const eHash = sha3Exports.keccak256(this.toBytes());
        return {
            _hint: Keys.hint.toString(),
            hash: eHash.slice(24),
            keys: this.sortKeys().map(k => k.toHintedObject()),
            threshold: this.threshold.v,
        };
    }
}
Keys.hint = new Hint(HINT.CURRENCY.KEYS);

const compareBytes = (a, b) => {
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) {
            return a[i] - b[i];
        }
    }
    return a.length - b.length;
};
const SortFunc = (a, b) => compareBytes(a.toBytes(), b.toBytes());

const delegateUri = (delegateIP) => `${delegateIP}?uri=`;
const validatePositiveInteger = (val, name) => {
    if (!Number.isSafeInteger(val) || val < 0) {
        throw MitumError.detail(ECODE.INVALID_FLOAT, `${name} must be a integer >= 0`);
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
            throw MitumError.detail(ECODE.INVALID_TYPE, "reverse must be true(bool)");
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
            throw MitumError.detail(ECODE.INVALID_TYPE, "factHash must be a string");
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
            throw MitumError.detail(ECODE.INVALID_TYPE, "reverse must be true(bool)");
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
            throw MitumError.detail(ECODE.INVALID_TYPE, "offset must be a tuple with number");
        }
        validatePositiveInteger(offset[0], "offset element");
        validatePositiveInteger(offset[1], "offset element");
        query2 = `offset=${offset[0]},${offset[1]}`;
    }
    if (reverse !== undefined) {
        if (reverse !== true) {
            throw MitumError.detail(ECODE.INVALID_TYPE, "reverse must be true(bool)");
        }
        query3 = `reverse=1`;
    }
    const query = [query1, query2, query3].filter(str => str !== undefined).join("&");
    return query == "" ? apiPath : apiPath + "?" + query;
};

const calculateAllowance = (response, owner, approved) => {
    let amount = '0';
    if (response.data.policy && response.data.policy.approve_list) {
        const approveList = response.data.policy.approve_list;
        const approval = approveList.find(item => item.account === owner);
        if (approval) {
            const allowance = approval.approved.find(item => item.account === approved);
            if (allowance) {
                amount = allowance.amount;
            }
        }
        return { 'amount': amount };
    }
    else {
        throw MitumError.detail(ECODE.UNKNOWN, `Unknown error orccur: token policy or policy.approve_list does not exist`);
    }
};
const convertToArray = (contracts, length) => {
    if (typeof contracts === "string") {
        return Array(length).fill(contracts);
    }
    else if (Array.isArray(contracts)) {
        if (contracts.length !== length) {
            throw MitumError.detail(ECODE.INVALID_LENGTH, `length of contracts must be the same as length of the other array.`);
        }
        return contracts;
    }
    else {
        throw MitumError.detail(ECODE.INVALID_TYPE, `contracts must be a string or an array.`);
    }
};

/**
 * Cross-bundle-safe `instanceof Hint`.
 *
 * When the core (`@imfact/sdk`) and account-abstraction (`@imfact/sdk/account-abstraction`)
 * bundles are loaded together, each ships its own copy of the `Hint` class, so a `Hint`
 * created in one bundle is NOT an `instanceof` the `Hint` of the other bundle. A fact built
 * with the core `Mitum` and then wrapped by `MitumAA` would therefore fail an `instanceof`
 * check even though it is structurally a valid Hint.
 *
 * We accept either a genuine `instanceof` match (fast path, same bundle) or a structural
 * match by constructor name (cross-bundle). Class names are preserved by the bundler.
 */
const isHintLike = (value) => {
    if (value instanceof Hint)
        return true;
    return (typeof value === "object" &&
        value !== null &&
        typeof value.toString === "function" &&
        value.constructor?.name === "Hint");
};
const isOpFact = (operation) => {
    if (typeof operation !== "object" || operation === null)
        return false;
    const hasRequiredProps = "id" in operation &&
        "hint" in operation &&
        "fact" in operation &&
        "_factSigns" in operation &&
        "_hash" in operation;
    if (!hasRequiredProps)
        return false;
    const isIdValid = typeof operation.id === "string";
    const isHintValid = typeof operation.hint === "object" &&
        isHintLike(operation.hint);
    const isFactValid = typeof operation.fact === "object" &&
        operation.fact !== null &&
        'hint' in operation.fact &&
        'token' in operation.fact &&
        '_hash' in operation.fact &&
        isHintLike(operation.fact.hint);
    const isFactSignsValid = Array.isArray(operation._factSigns);
    const isHashValid = operation._hash instanceof Uint8Array;
    return (isIdValid &&
        isHintValid &&
        isFactValid &&
        isFactSignsValid &&
        isHashValid);
};
const isHintedObject = (object) => {
    if (typeof object !== "object" || object === null)
        return false;
    if (typeof object._hint !== "string")
        return false;
    if (typeof object.hash !== "string")
        return false;
    if (!("fact" in object))
        return false;
    const fact = object.fact;
    if (typeof fact !== "object" || fact === null)
        return false;
    if (typeof fact._hint !== "string")
        return false;
    if (typeof fact.hash !== "string")
        return false;
    if (typeof fact.token !== "string")
        return false;
    if ("sender" in fact && fact.sender !== undefined && typeof fact.sender !== "string")
        return false;
    if ("items" in fact && fact.items !== undefined && !Array.isArray(fact.items))
        return false;
    if (!("signs" in object) || !Array.isArray(object.signs))
        return false;
    if (object.signs.length === 0 ||
        (object.signs.length === 1 && object.signs[0] === "")) {
        return true;
    }
    for (const s of object.signs) {
        if (typeof s !== "object" || s === null)
            return false;
        if (typeof s.signer !== "string")
            return false;
        if (typeof s.signature !== "string")
            return false;
        if ("signed_at" in s && typeof s.signed_at !== "string")
            return false;
    }
    return true;
};
const isHintedObjectFromUserOp = (object) => {
    if (!isHintedObject(object))
        return false;
    if ('extension' in object) {
        const { authentication, settlement, proxy_payer } = object.extension;
        return ('_hint' in authentication &&
            'contract' in authentication &&
            'authentication_id' in authentication &&
            'proof_data' in authentication &&
            '_hint' in settlement &&
            'op_sender' in settlement &&
            (proxy_payer ? '_hint' in proxy_payer && 'proxy_payer' in proxy_payer : true));
    }
    return false;
};
// Duck-typed to avoid a circular import on UserOperation (mirrors isOpFact):
// a UserOperation is an operation that additionally carries the AA extension
// fields (auth / settlement).
const isUserOp = (userOperation) => {
    return isOpFact(userOperation) &&
        "auth" in userOperation &&
        "settlement" in userOperation;
};
const isHintedFactObject = (obj) => {
    return (typeof obj === "object" &&
        obj !== null &&
        "_hint" in obj &&
        "token" in obj &&
        "hash" in obj);
};
const isErrorResponse = (response) => {
    return 'error_code' in response;
};
const isSuccessResponse = (response) => {
    return 'data' in response;
};
const isBase58Encoded = (value) => {
    if (!value || typeof value !== 'string') {
        return false;
    }
    const base58Chars = /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
    return base58Chars.test(value);
};
const invalidDid = (value, reason) => {
    throw MitumError.detail(ECODE.DID.INVALID_DID, `Invalid DID: "${value}" (${reason})`);
};
const validateDID = (did, id) => {
    if (typeof did !== "string" || did.length === 0) {
        invalidDid(String(did), "value must be a non-empty string");
    }
    const parts = did.split(":");
    if (parts.length !== 3) {
        invalidDid(did, `expected format "did:<method>:<identifier>"`);
    }
    if (parts[0] !== "did") {
        invalidDid(did, `must start with "did:"`);
    }
    if (id) {
        const hashCount = (did.match(/#/g) || []).length;
        if (hashCount !== 1) {
            invalidDid(did, `authentication id (or service id) must contain exactly one "#" (did#key)`);
        }
        const subparts = parts[2].split("#");
        if (subparts.length !== 2 || !subparts[0] || !subparts[1]) {
            invalidDid(did, `invalid authentication (or service id) id format, expected "<did>#<key-id>"`);
        }
        return Address.from(subparts[0]);
    }
    return Address.from(parts[2]);
};

async function getAccount(api, address, delegateIP) {
    const apiPath = `${api}/account/${Address.from(address).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAccountByPublicKey(api, publicKey, delegateIP) {
    const apiPath = `${api}/accounts?publickey=${Key.from(publicKey).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var accountApi = {
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
var blockApi = {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
};

async function getNode(api, delegateIP) {
    const apiPath = `${api}/`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var nodeApi = {
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
async function getMultiOperations(api, hashes, delegateIP) {
    const apiPath = `${api}/block/operations/facts?hashes=${hashes.join(",")}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getBlockOperationsByHeight(api, height, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParams(`${api}/block/${Big.from(height).toString()}/operations`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
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
var operationApi = {
    getOperations,
    getOperation,
    getBlockOperationsByHeight,
    getMultiOperations,
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

const url$9 = (api, contract) => `${api}/nft/${Address.from(contract).toString()}`;
async function getNFT(api, contract, nftIdx, delegateIP) {
    const apiPath = `${url$9(api, contract)}/nftidx/${nftIdx}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getNFTs(api, contract, delegateIP, factHash, limit, offset, reverse) {
    const apiPath = apiPathWithHashParams(`${url$9(api, contract)}/nfts`, factHash, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getModel$8(api, contract, delegateIP) {
    const apiPath = `${url$9(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAccountOperators(api, contract, account, delegateIP) {
    const apiPath = `${url$9(api, contract)}/account/${Address.from(account).toString()}/allapproved`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var nft$1 = {
    getNFT,
    getNFTs,
    getModel: getModel$8,
    getAccountOperators,
};

const url$8 = (api, contract) => `${api}/did/${Address.from(contract).toString()}`;
async function getModel$7(api, contract, delegateIP) {
    const apiPath = `${url$8(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCredential(api, contract, templateID, credentialID, delegateIP) {
    new URIString(templateID, 'templateID');
    new URIString(credentialID, 'credentialID');
    const apiPath = `${url$8(api, contract)}/template/${templateID.toString()}/credential/${credentialID}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getTemplate(api, contract, templateID, delegateIP) {
    new URIString(templateID, 'templateID');
    const apiPath = `${url$8(api, contract)}/template/${templateID}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCredentials(api, contract, templateID, delegateIP) {
    new URIString(templateID, 'templateID');
    const apiPath = `${url$8(api, contract)}/template/${templateID}/credentials`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getCredentialByHolder(api, contract, holder, delegateIP) {
    const apiPath = `${url$8(api, contract)}/holder/${Address.from(holder).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var credential$1 = {
    getModel: getModel$7,
    getCredential,
    getTemplate,
    getCredentials,
    getCredentialByHolder,
};

const url$7 = (api, contract) => `${api}/dao/${Address.from(contract).toString()}`;
async function getModel$6(api, contract, delegateIP) {
    const apiPath = `${url$7(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getProposal(api, contract, proposalID, delegateIP) {
    const apiPath = `${url$7(api, contract)}/proposal/${proposalID}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getApproved(api, contract, proposalID, registrant, delegateIP) {
    const apiPath = `${url$7(api, contract)}/proposal/${proposalID}/registrant/${Address.from(registrant).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getVoters(api, contract, proposalID, delegateIP) {
    const apiPath = `${url$7(api, contract)}/proposal/${proposalID}/voter`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getVotingStatus(api, contract, proposalID, delegateIP) {
    const apiPath = `${url$7(api, contract)}/proposal/${proposalID}/votingpower`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var dao$1 = {
    getModel: getModel$6,
    getProposal,
    getApproved,
    getVoters,
    getVotingStatus,
};

var kyc = {};

const url$6 = (api, contract) => `${api}/sto/${Address.from(contract).toString()}`;
async function getService(api, contract, delegateIP) {
    const apiPath = `${url$6(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getPartitions(api, contract, holder, delegateIP) {
    const apiPath = `${url$6(api, contract)}/holder/${Address.from(holder).toString()}/partitions`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getBalanceByHolder(api, contract, holder, partition, delegateIP) {
    const apiPath = `${url$6(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/balance`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getOperatorsByHolder(api, contract, holder, partition, delegateIP) {
    const apiPath = `${url$6(api, contract)}/holder/${Address.from(holder).toString()}/partition/${partition}/operators`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getPartitionBalance(api, contract, partition, delegateIP) {
    const apiPath = `${url$6(api, contract)}/p
    artition/${partition}/balance`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAuthorized(api, contract, operator, delegateIP) {
    const apiPath = `${url$6(api, contract)}/operator/${Address.from(operator).toString()}/holders`;
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

const url$5 = (api, contract) => `${api}/timestamp/${Address.from(contract).toString()}`;
async function getModel$5(api, contract, delegateIP) {
    const apiPath = `${url$5(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getTimeStamp(api, contract, projectID, timestampIdx, delegateIP) {
    const apiPath = `${url$5(api, contract)}/project/${projectID}/idx/${Big.from(timestampIdx).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var timestamp$1 = {
    getModel: getModel$5,
    getTimeStamp,
};

const url$4 = (api, contract) => `${api}/token/${Address.from(contract).toString()}`;
async function getModel$4(api, contract, delegateIP) {
    const apiPath = `${url$4(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getTokenBalance(api, contract, account, delegateIP) {
    const apiPath = `${url$4(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var token$1 = {
    getModel: getModel$4,
    getTokenBalance,
};

const url$3 = (api, contract) => `${api}/point/${Address.from(contract).toString()}`;
async function getModel$3(api, contract, delegateIP) {
    const apiPath = `${url$3(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getPointBalance(api, contract, account, delegateIP) {
    const apiPath = `${url$3(api, contract)}/account/${Address.from(account).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var point$1 = {
    getModel: getModel$3,
    getPointBalance,
};

const url$2 = (api, contract) => `${api}/storage/${Address.from(contract).toString()}`;
async function getModel$2(api, contract, delegateIP) {
    const apiPath = `${url$2(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getData(api, contract, dataKey, delegateIP) {
    const apiPath = `${url$2(api, contract)}/datakey/${dataKey}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getDataHistory(api, contract, dataKey, delegateIP, limit, offset, reverse) {
    const apiPath = apiPathWithParams(`${url$2(api, contract)}/datakey/${dataKey}/history`, limit, offset, reverse);
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getDataCount(api, contract, delegateIP, deleted) {
    const apiPath = `${url$2(api, contract)}/datacount?deleted=${deleted ? 1 : 0}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var storage$1 = {
    getModel: getModel$2,
    getData,
    getDataHistory,
    getDataCount
};

const url$1 = (api, contract) => `${api}/payment/${Address.from(contract).toString()}`;
async function getModel$1(api, contract, delegateIP) {
    const apiPath = `${url$1(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getAccountInfo(api, contract, address, delegateIP) {
    const apiPath = `${url$1(api, contract)}/account/${Address.from(address).toString()}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var payment$1 = {
    getAccountInfo,
    getModel: getModel$1,
};

var src;
var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src;
	hasRequiredSrc = 1;
	// base-x encoding / decoding
	// Copyright (c) 2018 base-x contributors
	// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
	// Distributed under the MIT software license, see the accompanying
	// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
	function base (ALPHABET) {
	  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
	  var BASE_MAP = new Uint8Array(256);
	  for (var j = 0; j < BASE_MAP.length; j++) {
	    BASE_MAP[j] = 255;
	  }
	  for (var i = 0; i < ALPHABET.length; i++) {
	    var x = ALPHABET.charAt(i);
	    var xc = x.charCodeAt(0);
	    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
	    BASE_MAP[xc] = i;
	  }
	  var BASE = ALPHABET.length;
	  var LEADER = ALPHABET.charAt(0);
	  var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
	  var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
	  function encode (source) {
	    if (source instanceof Uint8Array) ; else if (ArrayBuffer.isView(source)) {
	      source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
	    } else if (Array.isArray(source)) {
	      source = Uint8Array.from(source);
	    }
	    if (!(source instanceof Uint8Array)) { throw new TypeError('Expected Uint8Array') }
	    if (source.length === 0) { return '' }
	        // Skip & count leading zeroes.
	    var zeroes = 0;
	    var length = 0;
	    var pbegin = 0;
	    var pend = source.length;
	    while (pbegin !== pend && source[pbegin] === 0) {
	      pbegin++;
	      zeroes++;
	    }
	        // Allocate enough space in big-endian base58 representation.
	    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
	    var b58 = new Uint8Array(size);
	        // Process the bytes.
	    while (pbegin !== pend) {
	      var carry = source[pbegin];
	            // Apply "b58 = b58 * 256 + ch".
	      var i = 0;
	      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
	        carry += (256 * b58[it1]) >>> 0;
	        b58[it1] = (carry % BASE) >>> 0;
	        carry = (carry / BASE) >>> 0;
	      }
	      if (carry !== 0) { throw new Error('Non-zero carry') }
	      length = i;
	      pbegin++;
	    }
	        // Skip leading zeroes in base58 result.
	    var it2 = size - length;
	    while (it2 !== size && b58[it2] === 0) {
	      it2++;
	    }
	        // Translate the result into a string.
	    var str = LEADER.repeat(zeroes);
	    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]); }
	    return str
	  }
	  function decodeUnsafe (source) {
	    if (typeof source !== 'string') { throw new TypeError('Expected String') }
	    if (source.length === 0) { return new Uint8Array() }
	    var psz = 0;
	        // Skip and count leading '1's.
	    var zeroes = 0;
	    var length = 0;
	    while (source[psz] === LEADER) {
	      zeroes++;
	      psz++;
	    }
	        // Allocate enough space in big-endian base256 representation.
	    var size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
	    var b256 = new Uint8Array(size);
	        // Process the characters.
	    while (source[psz]) {
	            // Decode character
	      var carry = BASE_MAP[source.charCodeAt(psz)];
	            // Invalid character
	      if (carry === 255) { return }
	      var i = 0;
	      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
	        carry += (BASE * b256[it3]) >>> 0;
	        b256[it3] = (carry % 256) >>> 0;
	        carry = (carry / 256) >>> 0;
	      }
	      if (carry !== 0) { throw new Error('Non-zero carry') }
	      length = i;
	      psz++;
	    }
	        // Skip leading zeroes in b256.
	    var it4 = size - length;
	    while (it4 !== size && b256[it4] === 0) {
	      it4++;
	    }
	    var vch = new Uint8Array(zeroes + (size - it4));
	    var j = zeroes;
	    while (it4 !== size) {
	      vch[j++] = b256[it4++];
	    }
	    return vch
	  }
	  function decode (string) {
	    var buffer = decodeUnsafe(string);
	    if (buffer) { return buffer }
	    throw new Error('Non-base' + BASE + ' character')
	  }
	  return {
	    encode: encode,
	    decodeUnsafe: decodeUnsafe,
	    decode: decode
	  }
	}
	src = base;
	return src;
}

var bs58;
var hasRequiredBs58;

function requireBs58 () {
	if (hasRequiredBs58) return bs58;
	hasRequiredBs58 = 1;
	const basex = requireSrc();
	const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

	bs58 = basex(ALPHABET);
	return bs58;
}

var bs58Exports = requireBs58();
var base58 = /*@__PURE__*/getDefaultExportFromCjs(bs58Exports);

// HMAC (RFC 2104)
class HMAC extends Hash {
    constructor(hash$1, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        hash(hash$1);
        const key = toBytes$1(_key);
        this.iHash = hash$1.create();
        if (typeof this.iHash.update !== 'function')
            throw new Error('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash$1.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash$1.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        exists(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        exists(this);
        bytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

const defaultPath = "m/44'/815'/0'/0/0";

function hexToBytes(hex) {
    if (hex.startsWith("0x"))
        hex = hex.slice(2);
    if (hex.length % 2 !== 0)
        throw new Error("Invalid hex length");
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}
const privateKeyToPublicKey = (privateKey) => {
    let privateBytes;
    if (typeof privateKey === "string") {
        privateBytes = hexToBytes(privateKey);
    }
    else if (privateKey instanceof Uint8Array) {
        privateBytes = privateKey;
    }
    else {
        throw MitumError.detail(ECODE.INVALID_TYPE, "Expected Uint8Array or hex string");
    }
    return getPublicKey(privateBytes, false);
};
const compress = (publicKey) => {
    const x = publicKey.slice(1, 33);
    const y = publicKey.slice(33);
    const prefix = 0x02 + (y[y.length - 1] % 2);
    const compressed = new Uint8Array(33);
    compressed[0] = prefix;
    compressed.set(x, 1);
    let hex = "";
    for (const b of compressed) {
        hex += b.toString(16).padStart(2, "0");
    }
    return hex;
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
            .chainAnd(s.endsWith(SUFFIX.KEY.MITUM.PRIVATE))
            .excute();
        return this.generator.fromPrivateKey(key);
    }
    static hdRandom(option) {
        return this.generator.hdRandom(option);
    }
    static fromPhrase(phrase, path, option) {
        return this.generator.fromPhrase(phrase, path, option);
    }
    async ethSign(msg) {
        const msgBytes = typeof msg === "string" ? utf8ToBytes(msg) : msg;
        const msgHash = sha256$1(msgBytes);
        // 64 bytes (r || s)
        const sig = await secp256k1.sign(msgHash, this.signer, { der: false });
        const r = sig.slice(0, 32);
        const s = sig.slice(32);
        const trim = (b) => {
            let i = 0;
            while (i < b.length - 1 && b[i] === 0)
                i++;
            return b.slice(i);
        };
        const rTrim = trim(r);
        const sTrim = trim(s);
        const out = new Uint8Array(4 + rTrim.length + sTrim.length);
        new DataView(out.buffer).setUint32(0, rTrim.length, true);
        out.set(rTrim, 4);
        out.set(sTrim, 4 + rTrim.length);
        return out;
    }
    ethVerify(sig, msg) {
        let sigBytes = typeof sig === "string" ? base58.decode(sig) : sig;
        const rlen = new DataView(sigBytes.buffer, sigBytes.byteOffset, 4).getUint32(0, true);
        const r = sigBytes.slice(4, 4 + rlen);
        const s = sigBytes.slice(4 + rlen);
        const der = concatBytes([
            new Uint8Array([48, sigBytes.length, 2]),
            new Uint8Array([r.length]),
            r,
            new Uint8Array([2, s.length]),
            s,
        ]);
        const msgBytes = typeof msg === "string" ? utf8ToBytes(msg) : msg;
        return secp256k1.verify(der, sha256(msgBytes), secp256k1.getPublicKey(this.signer, true));
    }
    static K(seed) {
        const seedBytes = typeof seed === "string" ? utf8ToBytes(seed) : seed;
        let hashed = sha3(seedBytes);
        let encoded = base58.encode(hashed);
        let bytes = utf8ToBytes(encoded);
        Assert.check(40 <= bytes.length, MitumError.detail(ECODE.INVALID_SEED, "seed length out of range"));
        bytes = bytes.slice(0, 40);
        const N = secp256k1.CURVE.n - BigInt(1);
        let k = new Big(bytes).big;
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
        return toBytes$2(this.privateKey.noSuffix);
    }
    getPub() {
        const pub = privateKeyToPublicKey("0x" + this.privateKey.noSuffix);
        return new Key(compress(pub) + SUFFIX.KEY.MITUM.PUBLIC);
    }
    async sign(msg) {
        return await this.ethSign(msg);
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
            path: wallet.path,
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
    },
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
     * - `path`: derivation path for HD wallet. Default set to "m/44'/815'/0'/0/0". 815 is a coin type for imFact.
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
     * - `path`: derivation path for HD wallet, default set to "m/44'/815'/0'/0/0". 815 is a coin type for imFact.
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

const url = (api, contract) => `${api}/did-registry/${Address.from(contract).toString()}`;
async function getModel(api, contract, delegateIP) {
    const apiPath = `${url(api, contract)}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getByAccount(api, contract, account, delegateIP) {
    const apiPath = `${url(api, contract)}/did/${account}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
async function getByDID(api, contract, did, delegateIP) {
    const apiPath = `${url(api, contract)}/document?did=${did}`;
    return !delegateIP ? await fetchAxios.get(apiPath) : await fetchAxios.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
}
var did$1 = {
    getModel,
    getByAccount,
    getByDID
};

var models = {
    currency: currency$1,
    contract: {
        nft: nft$1,
        credential: credential$1,
        dao: dao$1,
        kyc,
        sto,
        timestamp: timestamp$1,
        token: token$1,
        point: point$1,
        storage: storage$1,
        payment: payment$1,
        did: did$1
    },
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
            throw MitumError.detail(ECODE.UNKNOWN, `Unknown error orccur!\n${error}`);
        }
    }
}

const currencyApi = models.currency;
const contractApi = models.contract;

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
        return await getAPIData(() => nodeApi.getNode(this.api, this.delegateIP));
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
        return await getAPIData(() => blockApi.getBlocks(this.api, this.delegateIP, limit, offset, reverse));
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
        return await getAPIData(() => blockApi.getBlockByHash(this.api, hash, this.delegateIP));
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
        return await getAPIData(() => blockApi.getBlockByHeight(this.api, height, this.delegateIP));
    }
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
        return await getAPIData(() => operationApi.getBlockOperationsByHeight(this.api, height, this.delegateIP, limit, offset, reverse));
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
    toBytes() {
        return concatBytes([
            this.signer.toBytes(),
            this.signature,
            this.signedAt.toBytes("super"),
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
    toBytes() {
        return concatBytes([
            this.node.toBytes(),
            super.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            node: this.node.toString(),
        };
    }
}

const encoder$b = new TextEncoder();
class BaseOperation {
    constructor(networkID, fact) {
        this.id = networkID;
        this.fact = fact;
        this.hint = new Hint(fact.operationHint);
        this._factSigns = [];
        this._hash = new Uint8Array();
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
        const b = sha3(this.toBytes());
        if (force === "force") {
            this._hash = b;
        }
        return b;
    }
    async sign(privateKey, option) {
        const key = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey(key);
        const sigType = this.factSignType;
        if (sigType === "NodeFactSign") {
            Assert.check(option !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address in sign option"));
        }
        const node = option ? new NodeAddress(option.node ?? "") : undefined;
        const factSign = await this.signWithSigType(sigType, keypair, node);
        const signer = keypair.publicKey.toString();
        const idx = this._factSigns.findIndex(fs => fs.signer.toString() === signer);
        if (idx < 0) {
            this._factSigns.push(factSign);
        }
        else {
            this._factSigns[idx] = factSign;
        }
        this._hash = this.hashing("force");
    }
    async signWithSigType(sigType, keypair, node) {
        const now = TimeStamp$1.new();
        if (sigType === "NodeFactSign" || (!sigType && node)) {
            Assert.check(node !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address"));
            const sig = await keypair.sign(concatBytes([encoder$b.encode(this.id), node.toBytes(), this.fact.hash, now.toBytes()]));
            return new NodeFactSign(node.toString(), keypair.publicKey, sig, now.toString());
        }
        const sig = await keypair.sign(concatBytes([encoder$b.encode(this.id), this.fact.hash, now.toBytes()]));
        return new GeneralFactSign(keypair.publicKey, sig, now.toString());
    }
    toBytes() {
        if (this._factSigns.length === 0) {
            return this.fact.hash;
        }
        const sorted = [...this._factSigns].sort(SortFunc);
        return concatBytes([
            this.fact.hash,
            concatBytes(sorted.map(fs => fs.toBytes())),
        ]);
    }
    toHintedObject() {
        const operation = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        };
        const factSigns = this._factSigns.length === 0 ? [] : [...this._factSigns].sort(SortFunc);
        return {
            ...operation,
            signs: factSigns.map(fs => fs.toHintedObject())
        };
    }
}

class Fact {
    constructor(hint, token) {
        this.hint = new Hint(hint);
        this.token = new Token$1(token);
        this._hash = new Uint8Array();
    }
    get hash() {
        return this._hash;
    }
    hashing() {
        return sha3(this.toBytes());
    }
    toBytes() {
        return this.token.toBytes();
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
        if (hint !== HINT.NFT.MINT.FACT) {
            Assert.check(new Set(items.map(i => i.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate items found"));
        }
        this.items = items;
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            concatBytes(this.items.map((i) => i.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            items: this.items.map(i => i.toHintedObject()),
        };
    }
}
class ItemOperationFact extends Fact {
    constructor(hint, token, sender, items, currency) {
        super(hint, token);
        this.sender = Address.from(sender);
        this.currency = CurrencyID.from(currency);
        Assert.check(Config.ITEMS_IN_FACT.satisfy(items.length), MitumError.detail(ECODE.INVALID_ITEMS, "length of items is out of range"));
        if (hint !== HINT.NFT.MINT.FACT) {
            Assert.check(new Set(items.map(i => i.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate items found"));
        }
        this.items = items;
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            this.currency.toBytes(),
            concatBytes(this.items.map((i) => i.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            items: this.items.map(i => i.toHintedObject()),
            currency: this.currency.toString()
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            this.contract.toBytes(),
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

const encoder$a = new TextEncoder();
let Authentication$1 = class Authentication {
    constructor(contract, authenticationId, proofData) {
        this.hint = new Hint(HINT.CURRENCY.EXTENSION.AUTHENTICATION);
        this.contract = Address.from(contract);
        this.authenticationId = authenticationId;
        if (proofData) {
            Assert.check(isBase58Encoded(proofData), MitumError.detail(ECODE.INVALID_USER_OPERATION, `proof_data must in base58 encoded`));
        }
        this.proofData = proofData ? proofData : "";
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            contract: this.contract.toString(),
            authentication_id: this.authenticationId,
            proof_data: this.proofData,
        };
    }
};
class ProxyPayer {
    constructor(proxyPayer) {
        this.hint = new Hint(HINT.CURRENCY.EXTENSION.PROXY_PAYER);
        this.proxyPayer = Address.from(proxyPayer);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            proxy_payer: this.proxyPayer.toString(),
        };
    }
}
class Settlement {
    constructor(opSender) {
        this.hint = new Hint(HINT.CURRENCY.EXTENSION.SETTLEMENT);
        this.opSender = opSender ? Address.from(opSender) : "";
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            op_sender: this.opSender.toString(),
        };
    }
}
class RestoredFact extends Fact {
    constructor(factJson) {
        const token_seed = bytesToUtf8(base64ToBytes(factJson.token));
        const parts = factJson._hint.split('-');
        super(parts.slice(0, parts.length - 1).join('-'), token_seed);
        this.factJson = factJson;
        this.sender = new Address(factJson.sender);
        this._hash = factJson.hash ? this.hashing() : new Uint8Array();
    }
    get operationHint() {
        const parts = this.factJson._hint.split('-');
        return parts.slice(0, parts.length - 2).join('-');
    }
    toHintedObject() {
        return this.factJson;
    }
    hashing() {
        return this.factJson.hash ? base58.decode(this.factJson.hash) : new Uint8Array();
    }
}
class UserOperation extends BaseOperation {
    constructor(networkID, fact, auth, proxyPayer, settlement) {
        super(networkID, (!isHintedFactObject(fact) ? fact : UserOperation.restoreFactFromJson(fact)));
        this.id = networkID;
        this.fact = (!isHintedFactObject(fact) ? fact : UserOperation.restoreFactFromJson(fact));
        if ("sender" in fact) {
            this.isSenderDidOwner(fact.sender, auth.authenticationId, true);
        }
        this.auth = auth;
        this.proxyPayer = proxyPayer;
        this.settlement = settlement;
        this.hint = new Hint(this.fact.operationHint);
        this._factSigns = [];
        this._hash = this.hashing();
    }
    static restoreFactFromJson(factJson) {
        const fact = new RestoredFact(factJson);
        return fact;
    }
    get hash() {
        return this._hash;
    }
    toBytes() {
        if (!this._factSigns) {
            return this.fact.hash;
        }
        this._factSigns = this._factSigns.sort(SortFunc);
        return concatBytes([
            encoder$a.encode(JSON.stringify(this.toHintedExtension())),
            this.fact.hash,
            concatBytes(this._factSigns.map((fs) => fs.toBytes())),
        ]);
    }
    toHintedObject() {
        const operation = {
            _hint: this.hint.toString(),
            fact: this.fact.toHintedObject(),
            extension: this.proxyPayer ?
                {
                    authentication: this.auth.toHintedObject(),
                    proxy_payer: this.proxyPayer.toHintedObject(),
                    settlement: this.settlement.toHintedObject(),
                } :
                {
                    authentication: this.auth.toHintedObject(),
                    settlement: this.settlement.toHintedObject(),
                },
            hash: this._hash.length === 0 ? "" : base58.encode(this._hash)
        };
        const factSigns = this._factSigns.length === 0 ? [] : this._factSigns.sort(SortFunc);
        return {
            ...operation,
            signs: factSigns.map(fs => fs.toHintedObject())
        };
    }
    toHintedExtension() {
        return this.proxyPayer ?
            {
                authentication: this.auth.toHintedObject(),
                proxy_payer: this.proxyPayer.toHintedObject(),
                settlement: this.settlement.toHintedObject(),
            } :
            {
                authentication: this.auth.toHintedObject(),
                settlement: this.settlement.toHintedObject(),
            };
    }
    isSenderDidOwner(sender, did, id) {
        Assert.check(sender.toString() === validateDID(did.toString(), id).toString(), MitumError.detail(ECODE.DID.INVALID_DID, `The owner of did must match the sender(${sender.toString()}). check the did (${did.toString()})`));
    }
    /**
     * Adds an alternative signature to the user operation.
     * This fills the `proof_data` field of the `authentication` object using the provided private key.
     *
     * @param {string | Key} privateKey - The private key used to generate the alternative signature.
     * @returns {Promise<void>} Resolves when the alternative signature has been generated and applied.
     */
    async addAlterSign(privateKey) {
        privateKey = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey(privateKey);
        const alterSign = await keypair.sign(this.fact.hash);
        this.auth = new Authentication$1(this.auth.contract, this.auth.authenticationId, base58.encode(alterSign)); // base58 인코딩 후 저장
    }
    /**
     * Sets settlement information for the userOperation.
     * `op_sender` is the account address that will **sign this UserOperation**.
     * When signatures are added later, the operation **must be signed using the private key of `op_sender`**.
     * If no `proxyPayer` is specified, `op_sender` will also act as the **fee payer** for this UserOperation.
     * @param {string | Address} opSender - The account address that acts as the signer .
     * @returns void.
     **/
    setSettlement(opSender) {
        Address.from(opSender);
        this.settlement = new Settlement(opSender);
    }
    /**
     * Sets a proxy payer for the UserOperation.
     *
     * `proxyPayer` is an address of a **CA (Contract Account)** that pays the transaction fee
     * from its own balance when this userOperation is executed.
     * The proxy payer **must be preconfigured** to allow this operation:
     * the `sender` of the UserOperation's Fact must be registered as a
     * permitted recipient in the proxy payer contract.
     *
     * This setting is optional. If not set, the fee will be paid by `settlement.op_sender`.
     * @param {string | Address} proxyPayer - The CA address that will pay the transaction fee.
     * @returns void.
     **/
    setProxyPayer(proxyPayer) {
        Address.from(proxyPayer);
        this.proxyPayer = new ProxyPayer(proxyPayer);
    }
    /**
     * Signs the user operation using the provided private key.
     *
     * This method validates required fields, generates a signature, and updates the internal
     * factSigns and operation hash. The signing process is asynchronous and must be awaited.
     *
     * @param {string | Key} privatekey - The private key used for signing the operation.
     * @returns {Promise<void>} Resolves when the operation has been successfully signed.
     */
    async sign(privatekey) {
        const userOperationFields = {
            contract: this.auth.contract.toString(),
            authentication_id: this.auth.authenticationId,
            proof_data: this.auth.proofData,
            op_sender: this.settlement.opSender.toString(),
        };
        Object.entries(userOperationFields).forEach(([key, value]) => {
            if (!value) {
                if (key === "proof_data") {
                    throw MitumError.detail(ECODE.INVALID_USER_OPERATION, "Cannot sign the user operation: proof_data is empty. Did you forget to 'await' addAlterSign()?");
                }
                throw MitumError.detail(ECODE.INVALID_USER_OPERATION, `Cannot sign the user operation: ${key} must not be empty.`);
            }
        });
        const keypair = KeyPair.fromPrivateKey(privatekey);
        const now = TimeStamp$1.new();
        const factSign = new GeneralFactSign(keypair.publicKey, await keypair.sign(concatBytes([encoder$a.encode(this.id), this.fact.hash, now.toBytes()])), now.toString());
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
}

class ContractGenerator extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
}

const encoder$9 = new TextEncoder();
class AllowedOperation {
    constructor(operationHint, contract, requireContract = false) {
        this.operationHint =
            Hint.hasVersion(operationHint)
                ? Hint.fromString(operationHint)
                : new Hint(operationHint);
        if (requireContract && !contract) {
            throw MitumError.detail(ECODE.INVALID_ADDRESS, "Contract address is required for this operation.");
        }
        this.contract = contract
            ? contract instanceof Address
                ? contract
                : new Address(contract)
            : undefined;
    }
    toBytes() {
        if (!this.contract) {
            return encoder$9.encode(this.operationHint.toString());
        }
        return concatBytes([
            this.contract.toBytes(),
            encoder$9.encode(this.operationHint.toString())
        ]);
    }
    toHintedObject() {
        if (!this.contract) {
            return {
                operation: this.operationHint.toString()
            };
        }
        return {
            contract: this.contract.toString(),
            operation: this.operationHint.toString()
        };
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
    toBytes() {
        return concatBytes([
            this.keys.toBytes(),
            concatBytes(this.amounts.sort(SortFunc).map(am => am.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
        };
    }
    toString() {
        return base58.encode(this.keys.toBytes());
    }
}
class CreateAccountFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.CURRENCY.CREATE_ACCOUNT.FACT, token, sender, items, currency);
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            this.keys.toBytes(),
            this.currency.toBytes(),
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

let TransferItem$3 = class TransferItem extends CurrencyItem {
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
    toBytes() {
        return concatBytes([
            this.receiver.toBytes(),
            concatBytes(this.amounts.sort(SortFunc).map(am => am.toBytes())),
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
};
let TransferFact$4 = class TransferFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.CURRENCY.TRANSFER.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate receiver found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.receiver.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with receiver address")));
    }
    get operationHint() {
        return HINT.CURRENCY.TRANSFER.OPERATION;
    }
};

class CreateContractAccountItem extends CurrencyItem {
    constructor(keys, amounts) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.ITEM, amounts);
        this.keys = keys;
    }
    toBytes() {
        return concatBytes([
            this.keys.toBytes(),
            concatBytes(this.amounts.sort(SortFunc).map(am => am.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            keys: this.keys.toHintedObject(),
        };
    }
    toString() {
        return base58.encode(this.keys.toBytes());
    }
}
class CreateContractAccountFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.FACT, token, sender, items, currency);
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
    toBytes() {
        return concatBytes([
            this.target.toBytes(),
            concatBytes(this.amounts.sort(SortFunc).map(am => am.toBytes())),
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
let WithdrawFact$1 = class WithdrawFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.CURRENCY.WITHDRAW.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate target found in items"));
        this.items.forEach(it => Assert.check(this.sender.toString() != it.target.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with target address")));
    }
    get operationHint() {
        return HINT.CURRENCY.WITHDRAW.OPERATION;
    }
};

class UpdateHandlerFact extends Fact {
    constructor(token, sender, contract, currency, handlers) {
        super(HINT.CURRENCY.UPDATE_HANDLER.FACT, token);
        this.sender = Address.from(sender);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.handlers = handlers.map(a => Address.from(a));
        this._hash = this.hashing();
        ArrayAssert.check(handlers, "handlers")
            .rangeLength(Config.CONTRACT_HANDLERS)
            .noDuplicates();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            this.contract.toBytes(),
            this.currency.toBytes(),
            concatBytes(this.handlers.sort(SortFunc).map(a => a.toBytes())),
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

class UpdateRecipientFact extends Fact {
    constructor(token, sender, contract, currency, recipients) {
        super(HINT.CURRENCY.UPDATE_RECIPIENT.FACT, token);
        this.sender = Address.from(sender);
        this.contract = Address.from(contract);
        this.currency = CurrencyID.from(currency);
        this.recipients = recipients.map(a => Address.from(a));
        this._hash = this.hashing();
        ArrayAssert.check(recipients, "recipients")
            .rangeLength(Config.CONTRACT_RECIPIENTS)
            .noDuplicates();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            this.contract.toBytes(),
            this.currency.toBytes(),
            concatBytes(this.recipients.sort(SortFunc).map(a => a.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            contract: this.contract.toString(),
            currency: this.currency.toString(),
            recipients: this.recipients.sort(SortFunc).map((w) => w.toString()),
        };
    }
    get operationHint() {
        return HINT.CURRENCY.UPDATE_RECIPIENT.OPERATION;
    }
}

class RegisterCurrencyFact extends NodeFact {
    constructor(token, design) {
        super(HINT.CURRENCY.REGISTER_CURRENCY.FACT, token);
        this.design = design;
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            this.token.toBytes(),
            this.design.toBytes(),
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
            this.policy.toBytes(),
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

let MintFact$3 = class MintFact extends NodeFact {
    constructor(token, receiver, amount) {
        super(HINT.CURRENCY.MINT.FACT, token);
        this.amount = amount;
        this.receiver = Address.from(receiver);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
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
    get operationHint() {
        return HINT.CURRENCY.MINT.OPERATION;
    }
};

class CurrencyDesign {
    constructor(initialSupply, currencyID, genesisAccount, decimal, policy) {
        this.initialSupply = Big.from(initialSupply);
        this.currencyID = CurrencyID.from(currencyID);
        this.genesisAccount = Address.from(genesisAccount);
        this.policy = policy;
        this.totalSupply = Big.from(initialSupply);
        this.decimal = Big.from(decimal);
    }
    toBytes() {
        return concatBytes([
            this.initialSupply.toBytes(),
            this.currencyID.toBytes(),
            this.decimal.toBytes(),
            this.genesisAccount.toBytes(),
            this.policy.toBytes(),
            this.totalSupply.toBytes(),
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
    toBytes() {
        return concatBytes([
            this.newAccountMinBalance.toBytes(),
            this.feeer.toBytes(),
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
    constructor(hint) {
        this.hint = new Hint(hint);
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
    toBytes() {
        return new Uint8Array();
    }
}
class FixedFeeer extends Feeer {
    constructor(receiver, amount) {
        super(HINT.CURRENCY.FEEER.FIXED);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
    }
    toBytes() {
        return concatBytes([
            this.receiver.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        const feeer = {
            ...super.toHintedObject(),
            amount: this.amount.toString(),
            receiver: this.receiver.toString(),
        };
        return feeer;
    }
}
class FixedItemFeeer extends Feeer {
    constructor(receiver, amount, item_fee_amount) {
        super(HINT.CURRENCY.FEEER.FIXED_ITEM);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        this.item_fee_amount = Big.from(item_fee_amount);
    }
    toBytes() {
        return concatBytes([
            this.receiver.toBytes(),
            this.amount.toBytes(),
            this.item_fee_amount.toBytes(),
        ]);
    }
    toHintedObject() {
        const feeer = {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
            item_fee_amount: this.item_fee_amount.toString(),
        };
        return feeer;
    }
}

class TokenFact extends ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
        };
    }
}

let RegisterModelFact$8 = class RegisterModelFact extends TokenFact {
    constructor(token, sender, contract, currency, symbol, name, decimal, initialSupply) {
        super(HINT.TOKEN.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this.symbol = CurrencyID.from(symbol);
        this.name = LongString.from(name);
        this.decimal = Big.from(decimal);
        this.initialSupply = Big.from(initialSupply);
        Assert.check(this.initialSupply.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "initialSupply under zero"));
        Assert.check(this.decimal.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "decimal number under zero"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.symbol.toBytes(),
            this.name.toBytes(),
            this.decimal.toBytes(),
            this.initialSupply.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            symbol: this.symbol.toString(),
            name: this.name.toString(),
            decimal: this.decimal.toString(),
            initial_supply: this.initialSupply.toString(),
        };
    }
    get operationHint() {
        return HINT.TOKEN.REGISTER_MODEL.OPERATION;
    }
};

let MintFact$2 = class MintFact extends TokenFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.TOKEN.MINT.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "receiver is same with contract address"));
        Assert.check(this.amount.overZero(), MitumError.detail(ECODE.INVALID_FACT, "amount must be over zero"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.TOKEN.MINT.OPERATION;
    }
};

let BurnFact$1 = class BurnFact extends TokenFact {
    constructor(token, sender, contract, currency, amount) {
        super(HINT.TOKEN.BURN.FACT, token, sender, contract, currency);
        this.target = Address.from(sender);
        this.amount = Big.from(amount);
        // Assert.check(
        //     Address.from(contract).toString() !== this.target.toString(),
        //     MitumError.detail(ECODE.INVALID_FACT, "target is same with contract address")
        // )
        Assert.check(this.amount.overZero(), MitumError.detail(ECODE.INVALID_FACT, "amount must be over zero"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.target.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.TOKEN.BURN.OPERATION;
    }
};

class TokenItem extends Item {
    constructor(hint, contract, amount) {
        super(hint);
        this.contract = Address.from(contract);
        this.amount = Big.from(amount);
    }
    toBytes() {
        return this.contract.toBytes();
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
        };
    }
    toString() {
        return this.contract.toString();
    }
}

let TransferItem$2 = class TransferItem extends TokenItem {
    constructor(contract, receiver, amount) {
        super(HINT.TOKEN.TRANSFER.ITEM, contract, amount);
        this.receiver = Address.from(receiver);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.receiver.toString()}`;
    }
};
let TransferFact$3 = class TransferFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.TOKEN.TRANSFER.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicated receiver found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.receiver.toString() !== this.sender.toString(), MitumError.detail(ECODE.INVALID_FACT, "receiver is same with sender address"));
            Assert.check(it.receiver.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"));
            Assert.check(it.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "amount must not be under zero"));
        });
    }
    get operationHint() {
        return HINT.TOKEN.TRANSFER.OPERATION;
    }
};

let ApproveItem$2 = class ApproveItem extends TokenItem {
    constructor(contract, approved, amount) {
        super(HINT.TOKEN.APPROVE.ITEM, contract, amount);
        this.approved = Address.from(approved);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.approved.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            amount: this.amount.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
};
let ApproveFact$2 = class ApproveFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.TOKEN.APPROVE.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicated approve found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.approved.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "approved is same with contract address"));
            Assert.check(it.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "amount must not be under zero"));
        });
    }
    get operationHint() {
        return HINT.TOKEN.APPROVE.OPERATION;
    }
};

let TransferFromItem$1 = class TransferFromItem extends TokenItem {
    constructor(contract, receiver, target, amount) {
        super(HINT.TOKEN.TRANSFER_FROM.ITEM, contract, amount);
        this.receiver = Address.from(receiver);
        this.target = Address.from(target);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.target.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            target: this.target.toString(),
            amount: this.amount.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.receiver.toString()}-${this.target.toString()}`;
    }
};
let TransferFromFact$1 = class TransferFromFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.TOKEN.TRANSFER_FROM.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicated target-receiver pair found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.receiver.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"));
            Assert.check(it.target.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "target is same with contract address"));
            Assert.check(it.receiver.toString() != it.target.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "target is same with receiver address"));
            Assert.check(this.sender.toString() != it.target.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "target is same with sender address, use 'transfer' instead"));
            Assert.check(it.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_ITEMS, "amount must not be under zero"));
        });
    }
    get operationHint() {
        return HINT.TOKEN.TRANSFER_FROM.OPERATION;
    }
};

let RegisterModelFact$7 = class RegisterModelFact extends ContractFact {
    constructor(token, sender, contract, project, currency) {
        super(HINT.STORAGE.REGISTER_MODEL.FACT, token, sender, contract, currency);
        Assert.check(Config.STORAGE.PROJECT.satisfy(project.toString().length), MitumError.detail(ECODE.INVALID_FACT, `project length out of range, should be between ${Config.STORAGE.PROJECT.min} to ${Config.STORAGE.PROJECT.max}`));
        this.project = LongString.from(project);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.project.toBytes(),
            this.currency.toBytes(),
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
};

class CreateDataItem extends Item {
    constructor(contract, dataKey, dataValue) {
        super(HINT.STORAGE.CREATE_DATA.ITEM);
        this.contract = Address.from(contract);
        this.dataKey = new URIString(dataKey, "dataKey");
        this.dataValue = LongString.from(dataValue);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        Assert.check(Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`));
    }
    toBytes() {
        return concatBytes([
            this.contract.toBytes(),
            this.dataKey.toBytes(),
            this.dataValue.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            dataKey: this.dataKey.toString(),
            dataValue: this.dataValue.toString(),
        };
    }
    toString() {
        return this.dataKey.toString() + this.contract.toString();
    }
}
class CreateDataFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.STORAGE.CREATE_DATA.FACT, token, sender, items, currency);
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        });
    }
    get operationHint() {
        return HINT.STORAGE.CREATE_DATA.OPERATION;
    }
}

class UpdateDataItem extends Item {
    constructor(contract, dataKey, dataValue) {
        super(HINT.STORAGE.UPDATE_DATA.ITEM);
        this.contract = Address.from(contract);
        this.dataKey = new URIString(dataKey, "dataKey");
        this.dataValue = LongString.from(dataValue);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        Assert.check(Config.STORAGE.DATA_VALUE.satisfy(dataValue.toString().length), MitumError.detail(ECODE.INVALID_ITEM, `dataValue out of range, should be between ${Config.STORAGE.DATA_VALUE.min} to ${Config.STORAGE.DATA_VALUE.max}`));
    }
    toBytes() {
        return concatBytes([
            this.contract.toBytes(),
            this.dataKey.toBytes(),
            this.dataValue.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            dataKey: this.dataKey.toString(),
            dataValue: this.dataValue.toString(),
        };
    }
    toString() {
        return this.dataKey.toString() + this.contract.toString();
    }
}
class UpdateDataFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.STORAGE.UPDATE_DATA.FACT, token, sender, items, currency);
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        });
    }
    get operationHint() {
        return HINT.STORAGE.UPDATE_DATA.OPERATION;
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.dataKey.toBytes()
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            dataKey: this.dataKey.toString(),
        };
    }
}

class DeleteDataFact extends StorageFact {
    constructor(token, sender, contract, dataKey, currency) {
        super(HINT.STORAGE.DELETE_DATA.FACT, token, sender, contract, dataKey, currency);
        Assert.check(Config.STORAGE.DATA_KEY.satisfy(dataKey.toString().length), MitumError.detail(ECODE.INVALID_FACT, `dataKey length out of range, should be between ${Config.STORAGE.DATA_KEY.min} to ${Config.STORAGE.DATA_KEY.max}`));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
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

let RegisterModelFact$6 = class RegisterModelFact extends ContractFact {
    constructor(token, sender, contract, currency) {
        super(HINT.CREDENTIAL.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    get operationHint() {
        return HINT.CREDENTIAL.REGISTER_MODEL.OPERATION;
    }
};

const encoder$8 = new TextEncoder();
class AddTemplateFact extends ContractFact {
    constructor(token, sender, contract, templateID, templateName, serviceDate, expirationDate, templateShare, multiAudit, displayName, subjectKey, description, creator, currency) {
        super(HINT.CREDENTIAL.ADD_TEMPLATE.FACT, token, sender, contract, currency);
        this.templateID = new URIString(templateID, 'templateID');
        this.templateName = templateName;
        this.serviceDate = ShortDate.from(serviceDate);
        this.expirationDate = ShortDate.from(expirationDate);
        this.templateShare = Bool.from(templateShare);
        this.multiAudit = Bool.from(multiAudit);
        this.displayName = displayName;
        this.subjectKey = subjectKey;
        this.description = description;
        this.creator = Address.from(creator);
        Assert.check(contract.toString() !== sender.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        Assert.check(contract.toString() !== creator.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "creator is same with contract address"));
        Assert.check(Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), MitumError.detail(ECODE.INVALID_FACT, "template id length out of range"));
        Assert.check(Config.CREDENTIAL.TEMPLATE_NAME.satisfy(templateName.length), MitumError.detail(ECODE.INVALID_FACT, "template name length out of range"));
        Assert.check(Config.CREDENTIAL.DISPLAY_NAME.satisfy(displayName.length), MitumError.detail(ECODE.INVALID_FACT, "display name length out of range"));
        Assert.check(Config.CREDENTIAL.SUBJECT_KEY.satisfy(subjectKey.length), MitumError.detail(ECODE.INVALID_FACT, "subject key length out of range"));
        Assert.check(Config.CREDENTIAL.DESCRIPTION.satisfy(description.length), MitumError.detail(ECODE.INVALID_FACT, "description length out of range"));
        Assert.check(Date.parse(serviceDate.toString()) <= Date.parse(expirationDate.toString()), MitumError.detail(ECODE.INVALID_FACT, "expire date < service date"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.templateID.toBytes(),
            encoder$8.encode(this.templateName),
            this.serviceDate.toBytes(),
            this.expirationDate.toBytes(),
            this.templateShare.toBytes(),
            this.multiAudit.toBytes(),
            encoder$8.encode(this.displayName),
            encoder$8.encode(this.subjectKey),
            encoder$8.encode(this.description),
            this.creator.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            template_id: this.templateID.toString(),
            template_name: this.templateName,
            service_date: this.serviceDate.toString(),
            expiration_date: this.expirationDate.toString(),
            template_share: this.templateShare.v,
            multi_audit: this.multiAudit.v,
            display_name: this.displayName,
            subject_key: this.subjectKey,
            description: this.description,
            creator: this.creator.toString(),
        };
    }
    get operationHint() {
        return HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION;
    }
}

class CredentialItem extends Item {
    constructor(hint, contract, holder, templateID, credentialID, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.holder = Address.from(holder);
        this.templateID = new URIString(templateID, "templateID");
        this.credentialID = new URIString(credentialID, "credentialID");
        this.currency = CurrencyID.from(currency);
        Assert.check(Config.CREDENTIAL.TEMPLATE_ID.satisfy(templateID.length), MitumError.detail(ECODE.INVALID_ITEM, "template id length out of range"));
        Assert.check(Config.CREDENTIAL.ID.satisfy(credentialID.length), MitumError.detail(ECODE.INVALID_ITEM, "credential id length out of range"));
        Assert.check(this.contract.toString() !== this.holder.toString(), MitumError.detail(ECODE.INVALID_ITEM, "holder is same with contract address"));
    }
    toBytes() {
        return concatBytes([
            this.contract.toBytes(),
            this.holder.toBytes(),
            this.templateID.toBytes(),
            this.credentialID.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
            holder: this.holder.toString(),
            template_id: this.templateID.toString(),
            credential_id: this.credentialID.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return this.contract.toString();
    }
}

const encoder$7 = new TextEncoder();
class IssueItem extends CredentialItem {
    constructor(contract, holder, templateID, credentialID, value, validFrom, validUntil, did, currency) {
        super(HINT.CREDENTIAL.ISSUE.ITEM, contract, holder, templateID, credentialID, currency);
        this.value = value;
        this.validFrom = Big.from(validFrom);
        this.validUntil = Big.from(validUntil);
        this.did = did;
        Assert.check(Config.CREDENTIAL.VALUE.satisfy(value.length), MitumError.detail(ECODE.INVALID_ITEM, "credential value length out of range"));
        Assert.check(validFrom < validUntil, MitumError.detail(ECODE.INVALID_ITEM, "valid until <= valid from"));
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            encoder$7.encode(this.value),
            this.validFrom.toBytes(),
            this.validUntil.toBytes(),
            encoder$7.encode(this.did),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            value: this.value,
            valid_from: this.validFrom.v,
            valid_until: this.validUntil.v,
            did: this.did,
        };
    }
    toString() {
        return `${super.toString()}-${this.templateID}-${this.credentialID}`;
    }
}
let IssueFact$1 = class IssueFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CREDENTIAL.ISSUE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, `each item's combination of contract-templateID-credentialID must be unique`));
        items.forEach(item => {
            Assert.check(item.contract.toString() !== sender.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        });
    }
    get operationHint() {
        return HINT.CREDENTIAL.ISSUE.OPERATION;
    }
};

class RevokeItem extends CredentialItem {
    constructor(contract, holder, templateID, credentialID, currency) {
        super(HINT.CREDENTIAL.REVOKE.ITEM, contract, holder, templateID, credentialID, currency);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toString() {
        return `${super.toString()}-${this.templateID}-${this.credentialID}`;
    }
}
class RevokeFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.CREDENTIAL.REVOKE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, `each item's combination of contract-templateID-credentialID must be unique`));
        items.forEach(item => {
            Assert.check(item.contract.toString() !== sender.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
        });
    }
    get operationHint() {
        return HINT.CREDENTIAL.REVOKE.OPERATION;
    }
}

const encoder$6 = new TextEncoder();
let RegisterModelFact$5 = class RegisterModelFact extends ContractFact {
    constructor(votingPowerToken, sender, contract, option, policy, currency) {
        super(HINT.DAO.REGISTER_MODEL.FACT, votingPowerToken, sender, contract, currency);
        this.option = option;
        this.policy = policy;
        this.policy.proposerWhitelist.accounts.forEach(account => Assert.check(this.contract.toString() !== account.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            encoder$6.encode(this.option),
            this.policy.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            option: this.option,
            ...this.policy.toHintedObject(),
            _hint: new Hint(HINT.DAO.REGISTER_MODEL.FACT).toString()
        };
    }
    get operationHint() {
        return HINT.DAO.REGISTER_MODEL.OPERATION;
    }
};

const encoder$5 = new TextEncoder();
let UpdateModelConfigFact$1 = class UpdateModelConfigFact extends ContractFact {
    constructor(token, sender, contract, option, policy, currency) {
        super(HINT.DAO.UPDATE_MODEL_CONFIG.FACT, token, sender, contract, currency);
        this.option = option;
        this.policy = policy;
        this.policy.proposerWhitelist.accounts.forEach(account => Assert.check(this.contract.toString() !== account.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            encoder$5.encode(this.option),
            this.policy.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            option: this.option,
            ...this.policy.toHintedObject(),
            _hint: new Hint(HINT.DAO.UPDATE_MODEL_CONFIG.FACT).toString()
        };
    }
    get operationHint() {
        return HINT.DAO.UPDATE_MODEL_CONFIG.OPERATION;
    }
};

class DAOFact extends ContractFact {
    constructor(hint, token, sender, contract, proposalID, currency) {
        super(hint, token, sender, contract, currency);
        this.proposalID = new URIString(proposalID, 'proposalID');
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.proposalID.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            proposal_id: this.proposalID.toString(),
        };
    }
}

class ProposeFact extends DAOFact {
    constructor(token, sender, contract, proposalID, proposal, currency) {
        super(HINT.DAO.PROPOSE.FACT, token, sender, contract, proposalID, currency);
        this.proposal = proposal;
        Assert.check(proposal.proposer.toString() === sender, MitumError.detail(ECODE.DAO.UNMATCHED_SENDER, `sender is unmatched with proposer of given proposal`));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.proposal.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            proposal: this.proposal.toHintedObject(),
        };
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.CANCEL_PROPOSAL.OPERATION;
    }
}

class RegisterFact extends DAOFact {
    constructor(token, sender, contract, proposalID, approved, currency) {
        super(HINT.DAO.REGISTER.FACT, token, sender, contract, proposalID, currency);
        this.approved = Address.from(approved);
        Assert.check(this.contract.toString() !== this.approved.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with approved address"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.approved.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
        };
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.vote.v === 0 ? Uint8Array.from([0x00]) : this.vote.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            vote_option: this.vote.v,
        };
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    get operationHint() {
        return HINT.DAO.EXECUTE.OPERATION;
    }
}

class DAOPolicy {
    constructor(votingPowerToken, threshold, proposalFee, proposerWhitelist, proposalReviewPeriod, registrationPeriod, preSnapshotPeriod, votingPeriod, postSnapshotPeriod, executionDelayPeriod, turnout, quorum) {
        this.hint = new Hint(HINT.DAO.POLICY);
        this.votingPowerToken = CurrencyID.from(votingPowerToken);
        this.threshold = Big.from(threshold);
        this.proposalFee = proposalFee,
            this.proposerWhitelist = proposerWhitelist;
        this.proposalReviewPeriod = Big.from(proposalReviewPeriod);
        this.registrationPeriod = Big.from(registrationPeriod);
        this.preSnapshotPeriod = Big.from(preSnapshotPeriod);
        this.votingPeriod = Big.from(votingPeriod);
        this.postSnapshotPeriod = Big.from(postSnapshotPeriod);
        this.executionDelayPeriod = Big.from(executionDelayPeriod);
        this.turnout = Big.from(turnout);
        this.quorum = Big.from(quorum);
        Assert.check(0 < this.proposalReviewPeriod.big && 0 < this.registrationPeriod.big && 0 < this.preSnapshotPeriod.big
            && 0 < this.votingPeriod.big && 0 < this.postSnapshotPeriod.big && 0 < this.executionDelayPeriod.big, MitumError.detail(ECODE.DAO.INVALID_POLICY, "period must not be set to 0 or below"));
        Assert.check(0 < this.threshold.big, MitumError.detail(ECODE.DAO.INVALID_POLICY, "threhold must be over zero"));
        Assert.check(Config.DAO.QUORUM.satisfy(this.turnout.v), MitumError.detail(ECODE.DAO.INVALID_POLICY, "turnout out of range"));
        Assert.check(Config.DAO.QUORUM.satisfy(this.quorum.v), MitumError.detail(ECODE.DAO.INVALID_POLICY, "quorum out of range"));
    }
    toBytes() {
        return concatBytes([
            this.votingPowerToken.toBytes(),
            this.threshold.toBytes(),
            this.proposalFee.toBytes(),
            this.proposerWhitelist.toBytes(),
            this.proposalReviewPeriod.toBytes("fill"),
            this.registrationPeriod.toBytes("fill"),
            this.preSnapshotPeriod.toBytes("fill"),
            this.votingPeriod.toBytes("fill"),
            this.postSnapshotPeriod.toBytes("fill"),
            this.executionDelayPeriod.toBytes("fill"),
            this.turnout.toBytes(),
            this.quorum.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            voting_power_token: this.votingPowerToken.toString(),
            threshold: this.threshold.toString(),
            proposal_fee: this.proposalFee.toHintedObject(),
            proposer_whitelist: this.proposerWhitelist.toHintedObject(),
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
        ArrayAssert.check(accounts, "whitelist").rangeLength(Config.DAO.ADDRESS_IN_WHITELIST).noDuplicates();
    }
    toBytes() {
        return concatBytes([
            this.active.toBytes(),
            concatBytes(this.accounts.sort(SortFunc).map(a => a.toBytes())),
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
    toBytes() {
        return new Uint8Array();
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.sender.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            sender: this.sender.toString(),
            receiver: this.receiver.toString(),
            amount: this.amount.toHintedObject(),
        };
    }
}
class GovernanceCalldata extends Calldata {
    constructor(policy) {
        super(HINT.DAO.CALLDATA.GOVERNANCE);
        this.policy = policy;
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.policy.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            policy: this.policy.toHintedObject(),
        };
    }
}
class Proposal {
    constructor(hint, proposer, startTime) {
        this.hint = new Hint(hint);
        this.proposer = Address.from(proposer);
        this.startTime = Big.from(startTime);
    }
    toBytes() {
        return concatBytes([
            this.proposer.toBytes(),
            this.startTime.toBytes("fill"),
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
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.calldata.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            call_data: this.calldata.toHintedObject(),
        };
    }
}
class BizProposal extends Proposal {
    constructor(proposer, startTime, url, hash, options) {
        super(HINT.DAO.PROPOSAL.BIZ, proposer, startTime);
        this.url = LongString.from(url);
        this.hash = LongString.from(hash);
        this.options = Big.from(options);
        Assert.check(Config.DAO.VOTE.satisfy(Number(this.options)), MitumError.detail(ECODE.INVALID_FACT, "vote option out of range"));
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.url.toBytes(),
            this.hash.toBytes(),
            this.options.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            url: this.url.toString(),
            hash: this.hash.toString(),
            options: this.options.v,
        };
    }
}

let RegisterModelFact$4 = class RegisterModelFact extends ContractFact {
    constructor(token, sender, contract, name, royalty, uri, minterWhitelist, currency) {
        super(HINT.NFT.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this.name = LongString.from(name);
        this.royalty = Big.from(royalty);
        this.uri = LongString.from(uri);
        this.minterWhitelist = minterWhitelist ? minterWhitelist.map(w => Address.from(w)) : [];
        Assert.check(Config.NFT.ROYALTY.satisfy(this.royalty.v), MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"));
        ArrayAssert.check(this.minterWhitelist, "whitelist")
            .rangeLength(Config.NFT.ADDRESS_IN_MINTER_WHITELIST)
            .noDuplicates();
        this.minterWhitelist.forEach(account => Assert.check(this.contract.toString() !== account.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.name.toBytes(),
            this.royalty.toBytes("fill"),
            this.uri.toBytes(),
            this.currency.toBytes(),
            concatBytes(this.minterWhitelist.sort(SortFunc).map(w => w.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            name: this.name.toString(),
            royalty: this.royalty.v,
            uri: this.uri.toString(),
            minter_whitelist: this.minterWhitelist.sort(SortFunc).map(w => w.toString()),
        };
    }
    get operationHint() {
        return HINT.NFT.REGISTER_MODEL.OPERATION;
    }
};

class UpdateModelConfigFact extends ContractFact {
    constructor(token, sender, contract, name, royalty, uri, minterWhitelist, currency) {
        super(HINT.NFT.UPDATE_MODEL_CONFIG.FACT, token, sender, contract, currency);
        this.name = LongString.from(name);
        this.royalty = Big.from(royalty);
        this.uri = LongString.from(uri);
        this.minterWhitelist = minterWhitelist ? minterWhitelist.map(w => Address.from(w)) : [];
        Assert.check(Config.NFT.ROYALTY.satisfy(this.royalty.v), MitumError.detail(ECODE.INVALID_FACT, "royalty out of range"));
        ArrayAssert.check(this.minterWhitelist, "whitelist")
            .rangeLength(Config.NFT.ADDRESS_IN_MINTER_WHITELIST)
            .noDuplicates();
        this.minterWhitelist.forEach(account => Assert.check(this.contract.toString() !== account.toString(), MitumError.detail(ECODE.INVALID_FACT, "contract is same with whitelist address")));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.name.toBytes(),
            this.royalty.toBytes("fill"),
            this.uri.toBytes(),
            this.currency.toBytes(),
            concatBytes(this.minterWhitelist.sort(SortFunc).map(w => w.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            name: this.name.toString(),
            royalty: this.royalty.v,
            uri: this.uri.toString(),
            minter_whitelist: this.minterWhitelist.sort(SortFunc).map(w => w.toString()),
        };
    }
    get operationHint() {
        return HINT.NFT.UPDATE_MODEL_CONFIG.OPERATION;
    }
}

class NFTItem extends Item {
    constructor(hint, contract) {
        super(hint);
        this.contract = Address.from(contract);
    }
    toBytes() {
        return this.contract.toBytes();
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
        };
    }
    toString() {
        return this.contract.toString();
    }
}

class MintItem extends NFTItem {
    constructor(contract, receiver, hash, uri, creators) {
        super(HINT.NFT.MINT.ITEM, contract);
        Assert.check(Config.NFT.HASH.satisfy(hash.toString().length), MitumError.detail(ECODE.INVALID_LENGTH, "hash length is out of range"));
        Assert.check(Config.NFT.URI.satisfy(uri.toString().length), MitumError.detail(ECODE.INVALID_LENGTH, "uri length is out of range"));
        this.receiver = Address.from(receiver);
        this.hash = LongString.from(hash);
        this.uri = LongString.from(uri);
        this.creators = creators;
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.hash.toBytes(),
            this.uri.toBytes(),
            this.creators.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            hash: this.hash.toString(),
            uri: this.uri.toString(),
            creators: this.creators.toHintedObject(),
        };
    }
}
let MintFact$1 = class MintFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.NFT.MINT.FACT, token, sender, items, currency);
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.receiver.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"));
            it.creators.signers.forEach(signer => {
                Assert.check(signer.account.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "creator is same with contract address"));
            });
        });
    }
    get operationHint() {
        return HINT.NFT.MINT.OPERATION;
    }
};

const encoder$4 = new TextEncoder();
class ApproveAllItem extends NFTItem {
    constructor(contract, approved, mode) {
        super(HINT.NFT.APPROVE_ALL.ITEM, contract);
        this.approved = Address.from(approved);
        this.mode = mode;
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.approved.toBytes(),
            encoder$4.encode(this.mode),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            mode: this.mode,
        };
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
}
class ApproveAllFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.NFT.APPROVE_ALL.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approved found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.approved.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "approved is same with contract address"));
            Assert.check(this.sender.toString() != it.approved.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with approved address"));
        });
    }
    get operationHint() {
        return HINT.NFT.APPROVE_ALL.OPERATION;
    }
}

let ApproveItem$1 = class ApproveItem extends NFTItem {
    constructor(contract, approved, nftIdx) {
        super(HINT.NFT.APPROVE.ITEM, contract);
        this.approved = Address.from(approved);
        this.nftIdx = Big.from(nftIdx);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.approved.toBytes(),
            this.nftIdx.toBytes("fill"),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            nft_idx: this.nftIdx.v,
        };
    }
    toString() {
        return `${super.toString()}-${this.nftIdx.v}`;
    }
};
let ApproveFact$1 = class ApproveFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.NFT.APPROVE.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate approve found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.approved.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "approved is same with contract address"));
        });
    }
    get operationHint() {
        return HINT.NFT.APPROVE.OPERATION;
    }
};

let TransferItem$1 = class TransferItem extends NFTItem {
    constructor(contract, receiver, nftIdx) {
        super(HINT.NFT.TRANSFER.ITEM, contract);
        this.receiver = Address.from(receiver);
        this.nftIdx = Big.from(nftIdx);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.nftIdx.toBytes("fill"),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            nft_idx: this.nftIdx.v,
        };
    }
    toString() {
        return `${super.toString()}-${this.nftIdx.toString()}`;
    }
};
let TransferFact$2 = class TransferFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.NFT.TRANSFER.FACT, token, sender, items, currency);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicate nft found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.receiver.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"));
        });
    }
    get operationHint() {
        return HINT.NFT.TRANSFER.OPERATION;
    }
};

class AddSignatureItem extends NFTItem {
    constructor(contract, nftIdx) {
        super(HINT.NFT.ADD_SIGNATURE.ITEM, contract);
        this.nftIdx = Big.from(nftIdx);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.nftIdx.toBytes("fill"),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            nft_idx: this.nftIdx.v,
        };
    }
}
class AddSignatureFact extends ItemOperationFact {
    constructor(token, sender, items, currency) {
        super(HINT.NFT.ADD_SIGNATURE.FACT, token, sender, items, currency);
        this.items.forEach(it => Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address")));
    }
    get operationHint() {
        return HINT.NFT.ADD_SIGNATURE.OPERATION;
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
    toBytes() {
        return concatBytes([
            this.account.toBytes(),
            this.share.toBytes("fill"),
            this.signed.toBytes(),
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
    constructor(signers) {
        this.hint = new Hint(HINT.NFT.SIGNERS);
        this.signers = signers;
        const total = this.signers.reduce((prev, next) => prev + Big.from(next.share).v, 0);
        Assert.check(total <= 100, MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNERS, `total share over max, ${total} > 100`));
        Assert.check(Config.NFT.SIGNERS_IN_SIGNERS.satisfy(this.signers.length), MitumError.detail(ECODE.NFT.INVALID_NFT_SIGNERS, "signers length out of range"));
    }
    toBytes() {
        return concatBytes([
            concatBytes(this.signers.sort(SortFunc).map(s => s.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            signers: this.signers.sort(SortFunc).map(s => s.toHintedObject()),
        };
    }
}

class PaymentFact extends ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
        // this._hash = this.hashing()
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
        };
    }
}

let RegisterModelFact$3 = class RegisterModelFact extends PaymentFact {
    constructor(token, sender, contract, currency) {
        super(HINT.PAYMENT.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes()
        ]);
    }
    get operationHint() {
        return HINT.PAYMENT.REGISTER_MODEL.OPERATION;
    }
};

class DepositFact extends PaymentFact {
    constructor(token, sender, contract, currency, amount, transfer_limit, start_time, end_time, duration) {
        super(HINT.PAYMENT.DEPOSIT.FACT, token, sender, contract, currency);
        this.amount = Big.from(amount);
        this.transfer_limit = Big.from(transfer_limit);
        this.start_time = Big.from(start_time);
        this.end_time = Big.from(end_time);
        this.duration = Big.from(duration);
        Assert.check(this.amount.overZero(), MitumError.detail(ECODE.INVALID_FACT, "amount must be greater 0"));
        Assert.check(this.start_time.v < this.end_time.v, MitumError.detail(ECODE.INVALID_FACT, "end_time must be greater than start_time"));
        Assert.check(this.duration.v < this.end_time.v - this.start_time.v, MitumError.detail(ECODE.INVALID_FACT, "duration must be less than (end_time - start_time)"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.amount.toBytes(),
            this.transfer_limit.toBytes(),
            this.start_time.toBytes("fill"),
            this.end_time.toBytes("fill"),
            this.duration.toBytes("fill"),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            amount: this.amount.toString(),
            transfer_limit: this.transfer_limit.toString(),
            start_time: this.start_time.v,
            end_time: this.end_time.v,
            duration: this.duration.v,
        };
    }
    get operationHint() {
        return HINT.PAYMENT.DEPOSIT.OPERATION;
    }
}

let TransferFact$1 = class TransferFact extends PaymentFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.PAYMENT.TRANSFER.FACT, token, sender, contract, currency);
        this.amount = Big.from(amount);
        this.receiver = Address.from(receiver);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.PAYMENT.TRANSFER.OPERATION;
    }
};

class WithdrawFact extends PaymentFact {
    constructor(token, sender, contract, currency) {
        super(HINT.PAYMENT.WITHDRAW.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    get operationHint() {
        return HINT.PAYMENT.WITHDRAW.OPERATION;
    }
}

class UpdateFact extends PaymentFact {
    constructor(token, sender, contract, currency, transfer_limit, start_time, end_time, duration) {
        super(HINT.PAYMENT.UPDATE_ACCOUNT_SETTING.FACT, token, sender, contract, currency);
        this.transfer_limit = Big.from(transfer_limit);
        this.start_time = Big.from(start_time);
        this.end_time = Big.from(end_time);
        this.duration = Big.from(duration);
        Assert.check(this.start_time.v < this.end_time.v, MitumError.detail(ECODE.INVALID_FACT, "end_time must be greater than start_time"));
        Assert.check(this.duration.v < this.end_time.v - this.start_time.v, MitumError.detail(ECODE.INVALID_FACT, "duration must be less than (end_time - start_time)"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.transfer_limit.toBytes(),
            this.start_time.toBytes("fill"),
            this.end_time.toBytes("fill"),
            this.duration.toBytes("fill"),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            transfer_limit: this.transfer_limit.toString(),
            start_time: this.start_time.v,
            end_time: this.end_time.v,
            duration: this.duration.v,
        };
    }
    get operationHint() {
        return HINT.PAYMENT.UPDATE_ACCOUNT_SETTING.OPERATION;
    }
}

class PointFact extends ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
        };
    }
}

let RegisterModelFact$2 = class RegisterModelFact extends PointFact {
    constructor(token, sender, contract, currency, symbol, name, decimal, initialSupply) {
        super(HINT.POINT.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this.symbol = CurrencyID.from(symbol);
        this.name = LongString.from(name);
        this.decimal = Big.from(decimal);
        this.initialSupply = Big.from(initialSupply);
        Assert.check(this.decimal.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "decimal number under zero"));
        Assert.check(this.initialSupply.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "initialSupply under zero"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.symbol.toBytes(),
            this.name.toBytes(),
            this.decimal.toBytes(),
            this.initialSupply.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            symbol: this.symbol.toString(),
            name: this.name.toString(),
            decimal: this.decimal.toString(),
            initial_supply: this.initialSupply.toString(),
        };
    }
    get operationHint() {
        return HINT.POINT.REGISTER_MODEL.OPERATION;
    }
};

class MintFact extends PointFact {
    constructor(token, sender, contract, currency, receiver, amount) {
        super(HINT.POINT.MINT.FACT, token, sender, contract, currency);
        this.receiver = Address.from(receiver);
        this.amount = Big.from(amount);
        Assert.check(this.contract.toString() !== this.receiver.toString(), MitumError.detail(ECODE.INVALID_FACT, "receiver is same with contract address"));
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "amount must be over zero"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.POINT.MINT.OPERATION;
    }
}

class PointItem extends Item {
    constructor(hint, contract, amount, currency) {
        super(hint);
        this.contract = Address.from(contract);
        this.amount = Big.from(amount);
        this.currency = CurrencyID.from(currency);
    }
    toBytes() {
        return concatBytes([
            this.contract.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            contract: this.contract.toString(),
        };
    }
    toString() {
        return this.contract.toString();
    }
}

class TransferItem extends PointItem {
    constructor(contract, receiver, amount, currency) {
        super(HINT.POINT.TRANSFER.ITEM, contract, amount, currency);
        this.receiver = Address.from(receiver);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.amount.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            amount: this.amount.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.receiver.toString()}`;
    }
}
class TransferFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.POINT.TRANSFER.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicated receiver found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.receiver.toString() !== this.sender.toString(), MitumError.detail(ECODE.INVALID_FACT, "receiver is same with sender address"));
            Assert.check(it.receiver.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"));
            Assert.check(it.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "amount must not be under zero"));
        });
    }
    get operationHint() {
        return HINT.POINT.TRANSFER.OPERATION;
    }
}

class ApproveItem extends PointItem {
    constructor(contract, approved, amount, currency) {
        super(HINT.POINT.APPROVE.ITEM, contract, amount, currency);
        this.approved = Address.from(approved);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.approved.toBytes(),
            this.amount.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            approved: this.approved.toString(),
            amount: this.amount.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.approved.toString()}`;
    }
}
class ApproveFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.POINT.APPROVE.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicated approve found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.approved.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "approved is same with contract address"));
            Assert.check(it.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_FACT, "amount must not be under zero"));
        });
    }
    get operationHint() {
        return HINT.POINT.APPROVE.OPERATION;
    }
}

class BurnFact extends PointFact {
    constructor(token, sender, contract, currency, amount) {
        super(HINT.POINT.BURN.FACT, token, sender, contract, currency);
        this.target = Address.from(sender);
        this.amount = Big.from(amount);
        // Assert.check(
        //     Address.from(contract).toString() !== this.target.toString(),
        //     MitumError.detail(ECODE.INVALID_FACT, "target is same with contract address")
        // )
        Assert.check(this.amount.compare(0) > 0, MitumError.detail(ECODE.INVALID_FACT, "amount must be over zero"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.target.toBytes(),
            this.amount.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            target: this.target.toString(),
            amount: this.amount.toString(),
        };
    }
    get operationHint() {
        return HINT.POINT.BURN.OPERATION;
    }
}

class TransferFromItem extends PointItem {
    constructor(contract, receiver, target, amount, currency) {
        super(HINT.POINT.TRANSFER_FROM.ITEM, contract, amount, currency);
        this.receiver = Address.from(receiver);
        this.target = Address.from(target);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.receiver.toBytes(),
            this.target.toBytes(),
            this.amount.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            receiver: this.receiver.toString(),
            target: this.target.toString(),
            amount: this.amount.toString(),
            currency: this.currency.toString(),
        };
    }
    toString() {
        return `${super.toString()}-${this.receiver.toString()}-${this.target.toString()}`;
    }
}
class TransferFromFact extends OperationFact {
    constructor(token, sender, items) {
        super(HINT.POINT.TRANSFER_FROM.FACT, token, sender, items);
        Assert.check(new Set(items.map(it => it.toString())).size === items.length, MitumError.detail(ECODE.INVALID_ITEMS, "duplicated target-receiver pair found in items"));
        this.items.forEach(it => {
            Assert.check(this.sender.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "sender is same with contract address"));
            Assert.check(it.receiver.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "receiver is same with contract address"));
            Assert.check(it.target.toString() != it.contract.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "target is same with contract address"));
            Assert.check(it.receiver.toString() != it.target.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "target is same with receiver address"));
            Assert.check(this.sender.toString() != it.target.toString(), MitumError.detail(ECODE.INVALID_ITEMS, "target is same with sender address, use 'transfer' instead"));
            Assert.check(it.amount.compare(0) >= 0, MitumError.detail(ECODE.INVALID_ITEMS, "amount must not be under zero"));
        });
    }
    get operationHint() {
        return HINT.POINT.TRANSFER_FROM.OPERATION;
    }
}

class TimeStampFact extends ContractFact {
    constructor(hint, token, sender, contract, currency) {
        super(hint, token, sender, contract, currency);
        // this._hash = this.hashing()
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
        };
    }
}

let RegisterModelFact$1 = class RegisterModelFact extends TimeStampFact {
    constructor(token, sender, contract, currency) {
        super(HINT.TIMESTAMP.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
        ]);
    }
    get operationHint() {
        return HINT.TIMESTAMP.REGISTER_MODEL.OPERATION;
    }
};

const encoder$3 = new TextEncoder();
class IssueFact extends ContractFact {
    constructor(token, sender, contract, projectID, requestTimeStamp, data, currency) {
        super(HINT.TIMESTAMP.ISSUE.FACT, token, sender, contract, currency);
        this.projectID = projectID;
        this.requestTimeStamp = Big.from(requestTimeStamp);
        this.data = data;
        Assert.check(Config.TIMESTAMP.PROJECT_ID.satisfy(this.projectID.length), MitumError.detail(ECODE.INVALID_FACT, "project id length out of range"));
        Assert.check(Config.TIMESTAMP.DATA.satisfy(this.data.length), MitumError.detail(ECODE.INVALID_FACT, "data length out of range"));
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            encoder$3.encode(this.projectID),
            this.requestTimeStamp.toBytes("fill"),
            encoder$3.encode(this.data),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            project_id: this.projectID,
            request_timestamp: this.requestTimeStamp.v,
            data: this.data,
        };
    }
    get operationHint() {
        return HINT.TIMESTAMP.ISSUE.OPERATION;
    }
}

class RegisterModelFact extends ContractFact {
    constructor(token, sender, contract, didMethod, currency) {
        super(HINT.DID.REGISTER_MODEL.FACT, token, sender, contract, currency);
        this.didMethod = LongString.from(didMethod);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.didMethod.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            didMethod: this.didMethod.toString(),
        };
    }
    get operationHint() {
        return HINT.DID.REGISTER_MODEL.OPERATION;
    }
}

class CreateFact extends ContractFact {
    constructor(token, sender, contract, currency) {
        super(HINT.DID.CREATE_DID.FACT, token, sender, contract, currency);
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
        };
    }
    get operationHint() {
        return HINT.DID.CREATE_DID.OPERATION;
    }
}

class UpdateDocumentFact extends ContractFact {
    constructor(token, sender, contract, did, document, currency) {
        super(HINT.DID.UPDATE_DID_DOCUMENT.FACT, token, sender, contract, currency);
        this.did = LongString.from(did);
        this.document = document;
        this._hash = this.hashing();
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.did.toBytes(),
            this.document.toBytes(),
            this.currency.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            did: this.did.toString(),
            document: this.document.toHintedObject(),
        };
    }
    get operationHint() {
        return HINT.DID.UPDATE_DID_DOCUMENT.OPERATION;
    }
}

const SECP256K1_PUB_PREFIX = new Uint8Array([0xe7, 0x01]);
const encoder$2 = new TextEncoder();
class Authentication {
    constructor(hint) {
        this.hint = new Hint(hint);
    }
    toBytes() {
        return new Uint8Array();
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
        };
    }
}
class AsymKeyAuth extends Authentication {
    constructor(id, type, controller, publicKey) {
        super(HINT.DID.AUTHENTICATION);
        this.id = LongString.from(id);
        validateDID(this.id.toString(), true);
        this.type = type;
        this.controller = LongString.from(controller);
        this.publicKey = new PubKey(publicKey, 100);
        this.publicKeyMultibase = this.type == "EcdsaSecp256k1VerificationKey2019" ? this.setPublicKeyMultibase(this.publicKey.toString()) : undefined;
    }
    setPublicKeyMultibase(pubKey) {
        const hex = Key.from(pubKey).noSuffix;
        let compressed;
        try {
            compressed = hexToBytes$1(hex);
        }
        catch {
            throw MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid hex public key");
        }
        if (compressed.length !== 33) {
            throw MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid compressed secp256k1 public key length");
        }
        let normalizedCompressed;
        try {
            const point = secp256k1.Point.fromHex(compressed);
            normalizedCompressed = point.toRawBytes(true); // compressed
        }
        catch {
            throw MitumError.detail(ECODE.INVALID_PUBLIC_KEY, "invalid secp256k1 public key");
        }
        const data = new Uint8Array(SECP256K1_PUB_PREFIX.length + normalizedCompressed.length);
        data.set(SECP256K1_PUB_PREFIX, 0);
        data.set(normalizedCompressed, SECP256K1_PUB_PREFIX.length);
        return "z" + base58.encode(data);
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.id.toBytes(),
            encoder$2.encode(this.type),
            this.controller.toBytes(),
            ...(this.publicKeyMultibase
                ? [encoder$2.encode(this.publicKeyMultibase)]
                : []),
            encoder$2.encode(this.publicKey.toString()),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            id: this.id.toString(),
            controller: this.controller.toString(),
            type: this.type.toString(),
            ...(this.publicKeyMultibase
                ? { publicKeyMultibase: this.publicKeyMultibase }
                : {}),
            publicKeyImFact: this.publicKey.toString(),
        };
    }
    toString() {
        return this.id.toString();
    }
}
class LinkedAuth extends Authentication {
    constructor(id, controller, targetId, allowed) {
        super(HINT.DID.AUTHENTICATION);
        this.id = LongString.from(id);
        validateDID(this.id.toString(), true);
        this.type = "LinkedVerificationMethod";
        this.controller = LongString.from(controller);
        this.targetId = LongString.from(targetId);
        validateDID(this.id.toString(), true);
        this.allowed = allowed.map((el, idx) => {
            if (el instanceof AllowedOperation) {
                return el;
            }
            try {
                return new AllowedOperation(el.operation, el.contract);
            }
            catch (e) {
                throw MitumError.detail(ECODE.INVALID_TYPE, `allowed[${idx}] cannot be converted to AllowedOperation: ${JSON.stringify(el)}`);
            }
        });
    }
    toBytes() {
        return concatBytes([
            super.toBytes(),
            this.id.toBytes(),
            encoder$2.encode(this.type),
            this.controller.toBytes(),
            this.targetId.toBytes(),
            concatBytes(this.allowed.map((a) => a.toBytes())),
        ]);
    }
    toHintedObject() {
        return {
            ...super.toHintedObject(),
            id: this.id.toString(),
            controller: this.controller.toString(),
            type: this.type,
            targetId: this.targetId.toString(),
            allowed: this.allowed.map((a) => a.toHintedObject()),
        };
    }
    toString() {
        return this.id.toString();
    }
}
class Service {
    constructor(id, type, service_end_point) {
        this.id = LongString.from(id);
        this.type = LongString.from(type);
        this.service_end_point = LongString.from(service_end_point);
    }
    toBytes() {
        return concatBytes([
            this.id.toBytes(),
            this.type.toBytes(),
            this.service_end_point.toBytes(),
        ]);
    }
    toHintedObject() {
        return {
            id: this.id.toString(),
            type: this.type.toString(),
            service_end_point: this.service_end_point.toString(),
        };
    }
}
class Document {
    constructor(context, id, authentication, verificationMethod, service) {
        this.hint = new Hint(HINT.DID.DOCUMENT);
        const contexts = Array.isArray(context) ? context : [context];
        this.context = contexts.map(ctx => LongString.from(ctx));
        this.id = LongString.from(id);
        validateDID(this.id.toString());
        Assert.check(new Set(authentication.map(i => i.toString())).size === authentication.length, MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "duplicate authentication id found in authentication"));
        this.authentication = authentication;
        Assert.check(new Set(verificationMethod.map(i => i.toString())).size === verificationMethod.length, MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "duplicate authentication id found in verificationMethod"));
        this.verificationMethod = verificationMethod;
        if (service !== undefined) {
            Assert.check(Array.isArray(service) && service.every(s => s instanceof Service), MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "service must be an array of Service"));
            this.service = service;
        }
    }
    toBytes() {
        return concatBytes([
            concatBytes(this.context.map(ctx => ctx.toBytes())),
            this.id.toBytes(),
            concatBytes(this.authentication.map(el => concatBytes([el.toBytes(), Uint8Array.from([1])]))),
            concatBytes(this.verificationMethod.map(el => el.toBytes())),
            ...(this.service
                ? [concatBytes(this.service.map(s => s.toBytes()))]
                : []),
        ]);
    }
    toHintedObject() {
        const obj = {
            _hint: this.hint.toString(),
            "@context": this.context.map(ctx => ctx.toString()),
            id: this.id.toString(),
            authentication: this.authentication.map(el => el.toHintedObject()),
            verificationMethod: this.verificationMethod.map(el => el.toHintedObject()),
        };
        if (this.service) {
            obj.service = this.service.map(s => s.toHintedObject());
        }
        else {
            obj.service = [];
        }
        return obj;
    }
}

/**
 * Decodes the base64-encoded token back to the raw token string.
 *
 * Background: Token.toString() returns bytesToBase64(TextEncoder.encode(rawString)),
 * so toHintedObject() stores the token as base64. Constructors expect the raw
 * string, so we must reverse the encoding here.
 */
function decodeBase64Token(base64) {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(base64, "base64").toString("utf8");
    }
    // Browser fallback
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}
/** Reconstruct Amount instances from Amount.toHintedObject() JSON. */
function amountsFromJson(amountsJson) {
    return amountsJson.map(a => new Amount(a.currency, a.amount));
}
/** Reconstruct Keys from Keys.toHintedObject() JSON: { keys: [{key, weight}], threshold }. */
function keysFromJson(keysJson) {
    return new Keys(keysJson.keys.map(k => new PubKey(k.key, k.weight)), keysJson.threshold);
}
/** Reconstruct NFT Signers from Signers.toHintedObject() JSON: { signers: [{account, share, signed}] }. */
function signersFromJson(json) {
    return new Signers(json.signers.map(s => new Signer$1(s.account, s.share, s.signed)));
}
/** Reconstruct DAOPolicy from the fields spread into a DAO fact's toHintedObject(). */
function daoPolicyFromJson(json) {
    const whitelist = new Whitelist(json.proposer_whitelist.active, json.proposer_whitelist.accounts ?? []);
    return new DAOPolicy(json.voting_power_token, json.threshold, new Fee(json.proposal_fee.currency, json.proposal_fee.amount), whitelist, json.proposal_review_period, json.registration_period, json.pre_snapshot_period, json.voting_period, json.post_snapshot_period, json.execution_delay_period, json.turnout, json.quorum);
}
/** Reconstruct a DAO Proposal (CryptoProposal or BizProposal) from its JSON. */
function proposalFromJson(json) {
    const hint = json._hint;
    if (hint.includes(HINT.DAO.PROPOSAL.CRYPTO)) {
        const cd = json.call_data;
        const cdHint = cd._hint;
        let calldata;
        if (cdHint.includes(HINT.DAO.CALLDATA.TRANSFER)) {
            calldata = new TransferCalldata(cd.sender, cd.receiver, new Amount(cd.amount.currency, cd.amount.amount));
        }
        else {
            calldata = new GovernanceCalldata(daoPolicyFromJson(cd.policy));
        }
        return new CryptoProposal(json.proposer, json.start_time, calldata);
    }
    // BizProposal
    return new BizProposal(json.proposer, json.start_time, json.url, json.hash, json.options);
}
/** Reconstruct a DID authentication entry (AsymKeyAuth or LinkedAuth) from its JSON. */
function didAuthFromJson(json) {
    if (json.type === "LinkedVerificationMethod") {
        return new LinkedAuth(json.id, json.controller, json.targetId, json.allowed.map(a => new AllowedOperation(a.operation, a.contract)));
    }
    // AsymKeyAuth: type is one of the verification key types; publicKey comes from publicKeyImFact
    return new AsymKeyAuth(json.id, json.type, json.controller, json.publicKeyImFact);
}
/** Reconstruct a DID Document from its toHintedObject() JSON. */
function documentFromJson(json) {
    return new Document(json["@context"], json.id, json.authentication.map(didAuthFromJson), json.verificationMethod.map(didAuthFromJson), json.service && json.service.length > 0
        ? json.service.map(s => new Service(s.id, s.type, s.service_end_point))
        : undefined);
}
/**
 * Reconstructs a Fact instance from its JSON representation (the output of
 * BaseOperation.toHintedObject().fact). This lets you call fact.toBytes() when
 * only the serialised JSON is available — e.g. for FIXED_DETAILED fee estimation.
 *
 * Supported domains: Currency, Token, Storage, Credential, DAO, NFT, Payment,
 * Point, Timestamp. (KYC and STO are excluded.)
 *
 * To add a new type, follow the same pattern below.
 *
 * @throws {Error} when the hint is not recognised
 */
function factFromJson(factJson) {
    const hint = factJson._hint;
    const token = decodeBase64Token(factJson.token);
    // ======== CURRENCY ========
    if (hint.includes(HINT.CURRENCY.MINT.FACT)) {
        return new MintFact$3(token, factJson.receiver, new Amount(factJson.amount.currency, factJson.amount.amount));
    }
    if (hint.includes(HINT.CURRENCY.TRANSFER.FACT)) {
        const items = factJson.items.map(item => new TransferItem$3(item.receiver, amountsFromJson(item.amounts)));
        return new TransferFact$4(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.CURRENCY.WITHDRAW.FACT)) {
        const items = factJson.items.map(item => new WithdrawItem(item.target, amountsFromJson(item.amounts)));
        return new WithdrawFact$1(token, factJson.sender, items, factJson.currency);
    }
    // Check CREATE_CONTRACT_ACCOUNT before CREATE_ACCOUNT (more specific first)
    if (hint.includes(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.FACT)) {
        const items = factJson.items.map(item => new CreateContractAccountItem(keysFromJson(item.keys), amountsFromJson(item.amounts)));
        return new CreateContractAccountFact(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.CURRENCY.CREATE_ACCOUNT.FACT)) {
        const items = factJson.items.map(item => new CreateAccountItem(keysFromJson(item.keys), amountsFromJson(item.amounts)));
        return new CreateAccountFact(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.CURRENCY.UPDATE_KEY.FACT)) {
        return new UpdateKeyFact(token, factJson.sender, keysFromJson(factJson.keys), factJson.currency);
    }
    if (hint.includes(HINT.CURRENCY.UPDATE_HANDLER.FACT)) {
        return new UpdateHandlerFact(token, factJson.sender, factJson.contract, factJson.currency, factJson.handlers);
    }
    if (hint.includes(HINT.CURRENCY.UPDATE_RECIPIENT.FACT)) {
        return new UpdateRecipientFact(token, factJson.sender, factJson.contract, factJson.currency, factJson.recipients);
    }
    // ======== TOKEN ========
    if (hint.includes(HINT.TOKEN.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$8(token, factJson.sender, factJson.contract, factJson.currency, factJson.symbol, factJson.name, factJson.decimal, factJson.initial_supply);
    }
    if (hint.includes(HINT.TOKEN.MINT.FACT)) {
        return new MintFact$2(token, factJson.sender, factJson.contract, factJson.currency, factJson.receiver, factJson.amount);
    }
    if (hint.includes(HINT.TOKEN.BURN.FACT)) {
        return new BurnFact$1(token, factJson.sender, factJson.contract, factJson.currency, factJson.amount);
    }
    // Check TRANSFER_FROM before TRANSFER (more specific first)
    if (hint.includes(HINT.TOKEN.TRANSFER_FROM.FACT)) {
        const items = factJson.items.map(item => new TransferFromItem$1(item.contract, item.receiver, item.target, item.amount));
        return new TransferFromFact$1(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.TOKEN.TRANSFER.FACT)) {
        const items = factJson.items.map(item => new TransferItem$2(item.contract, item.receiver, item.amount));
        return new TransferFact$3(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.TOKEN.APPROVE.FACT)) {
        const items = factJson.items.map(item => new ApproveItem$2(item.contract, item.approved, item.amount));
        return new ApproveFact$2(token, factJson.sender, items, factJson.currency);
    }
    // ======== STORAGE ========
    if (hint.includes(HINT.STORAGE.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$7(token, factJson.sender, factJson.contract, factJson.project, factJson.currency);
    }
    if (hint.includes(HINT.STORAGE.CREATE_DATA.FACT)) {
        const items = factJson.items.map(item => new CreateDataItem(item.contract, item.dataKey, item.dataValue));
        return new CreateDataFact(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.STORAGE.UPDATE_DATA.FACT)) {
        const items = factJson.items.map(item => new UpdateDataItem(item.contract, item.dataKey, item.dataValue));
        return new UpdateDataFact(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.STORAGE.DELETE_DATA.FACT)) {
        return new DeleteDataFact(token, factJson.sender, factJson.contract, factJson.dataKey, factJson.currency);
    }
    // ======== CREDENTIAL ========
    if (hint.includes(HINT.CREDENTIAL.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$6(token, factJson.sender, factJson.contract, factJson.currency);
    }
    if (hint.includes(HINT.CREDENTIAL.ADD_TEMPLATE.FACT)) {
        return new AddTemplateFact(token, factJson.sender, factJson.contract, factJson.template_id, factJson.template_name, factJson.service_date, factJson.expiration_date, factJson.template_share, factJson.multi_audit, factJson.display_name, factJson.subject_key, factJson.description, factJson.creator, factJson.currency);
    }
    if (hint.includes(HINT.CREDENTIAL.ISSUE.FACT)) {
        const items = factJson.items.map(item => new IssueItem(item.contract, item.holder, item.template_id, item.credential_id, item.value, item.valid_from, item.valid_until, item.did, item.currency));
        return new IssueFact$1(token, factJson.sender, items);
    }
    if (hint.includes(HINT.CREDENTIAL.REVOKE.FACT)) {
        const items = factJson.items.map(item => new RevokeItem(item.contract, item.holder, item.template_id, item.credential_id, item.currency));
        return new RevokeFact(token, factJson.sender, items);
    }
    // ======== DAO ========
    // RegisterModel and UpdateModelConfig spread policy fields into the fact JSON directly.
    if (hint.includes(HINT.DAO.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$5(token, factJson.sender, factJson.contract, factJson.option, daoPolicyFromJson(factJson), factJson.currency);
    }
    if (hint.includes(HINT.DAO.UPDATE_MODEL_CONFIG.FACT)) {
        return new UpdateModelConfigFact$1(token, factJson.sender, factJson.contract, factJson.option, daoPolicyFromJson(factJson), factJson.currency);
    }
    if (hint.includes(HINT.DAO.PROPOSE.FACT)) {
        return new ProposeFact(token, factJson.sender, factJson.contract, factJson.proposal_id, proposalFromJson(factJson.proposal), factJson.currency);
    }
    if (hint.includes(HINT.DAO.CANCEL_PROPOSAL.FACT)) {
        return new CancelProposalFact(token, factJson.sender, factJson.contract, factJson.proposal_id, factJson.currency);
    }
    if (hint.includes(HINT.DAO.REGISTER.FACT)) {
        return new RegisterFact(token, factJson.sender, factJson.contract, factJson.proposal_id, factJson.approved, factJson.currency);
    }
    if (hint.includes(HINT.DAO.PRE_SNAP.FACT)) {
        return new PreSnapFact(token, factJson.sender, factJson.contract, factJson.proposal_id, factJson.currency);
    }
    if (hint.includes(HINT.DAO.POST_SNAP.FACT)) {
        return new PostSnapFact(token, factJson.sender, factJson.contract, factJson.proposal_id, factJson.currency);
    }
    if (hint.includes(HINT.DAO.VOTE.FACT)) {
        return new VoteFact(token, factJson.sender, factJson.contract, factJson.proposal_id, factJson.vote_option, factJson.currency);
    }
    if (hint.includes(HINT.DAO.EXECUTE.FACT)) {
        return new ExecuteFact(token, factJson.sender, factJson.contract, factJson.proposal_id, factJson.currency);
    }
    // ======== NFT ========
    if (hint.includes(HINT.NFT.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$4(token, factJson.sender, factJson.contract, factJson.name, factJson.royalty, factJson.uri, factJson.minter_whitelist ?? [], factJson.currency);
    }
    if (hint.includes(HINT.NFT.UPDATE_MODEL_CONFIG.FACT)) {
        return new UpdateModelConfigFact(token, factJson.sender, factJson.contract, factJson.name, factJson.royalty, factJson.uri, factJson.minter_whitelist ?? [], factJson.currency);
    }
    if (hint.includes(HINT.NFT.MINT.FACT)) {
        const items = factJson.items.map(item => new MintItem(item.contract, item.receiver, item.hash, item.uri, signersFromJson(item.creators)));
        return new MintFact$1(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.NFT.APPROVE_ALL.FACT)) {
        const items = factJson.items.map(item => new ApproveAllItem(item.contract, item.approved, item.mode));
        return new ApproveAllFact(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.NFT.APPROVE.FACT)) {
        const items = factJson.items.map(item => new ApproveItem$1(item.contract, item.approved, item.nft_idx));
        return new ApproveFact$1(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.NFT.TRANSFER.FACT)) {
        const items = factJson.items.map(item => new TransferItem$1(item.contract, item.receiver, item.nft_idx));
        return new TransferFact$2(token, factJson.sender, items, factJson.currency);
    }
    if (hint.includes(HINT.NFT.ADD_SIGNATURE.FACT)) {
        const items = factJson.items.map(item => new AddSignatureItem(item.contract, item.nft_idx));
        return new AddSignatureFact(token, factJson.sender, items, factJson.currency);
    }
    // ======== PAYMENT ========
    if (hint.includes(HINT.PAYMENT.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$3(token, factJson.sender, factJson.contract, factJson.currency);
    }
    if (hint.includes(HINT.PAYMENT.DEPOSIT.FACT)) {
        return new DepositFact(token, factJson.sender, factJson.contract, factJson.currency, factJson.amount, factJson.transfer_limit, factJson.start_time, factJson.end_time, factJson.duration);
    }
    if (hint.includes(HINT.PAYMENT.TRANSFER.FACT)) {
        return new TransferFact$1(token, factJson.sender, factJson.contract, factJson.currency, factJson.receiver, factJson.amount);
    }
    if (hint.includes(HINT.PAYMENT.WITHDRAW.FACT)) {
        return new WithdrawFact(token, factJson.sender, factJson.contract, factJson.currency);
    }
    if (hint.includes(HINT.PAYMENT.UPDATE_ACCOUNT_SETTING.FACT)) {
        return new UpdateFact(token, factJson.sender, factJson.contract, factJson.currency, factJson.transfer_limit, factJson.start_time, factJson.end_time, factJson.duration);
    }
    // ======== POINT ========
    if (hint.includes(HINT.POINT.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$2(token, factJson.sender, factJson.contract, factJson.currency, factJson.symbol, factJson.name, factJson.decimal, factJson.initial_supply);
    }
    if (hint.includes(HINT.POINT.MINT.FACT)) {
        return new MintFact(token, factJson.sender, factJson.contract, factJson.currency, factJson.receiver, factJson.amount);
    }
    if (hint.includes(HINT.POINT.BURN.FACT)) {
        return new BurnFact(token, factJson.sender, factJson.contract, factJson.currency, factJson.amount);
    }
    // Check TRANSFER_FROM before TRANSFER (more specific first)
    if (hint.includes(HINT.POINT.TRANSFER_FROM.FACT)) {
        const items = factJson.items.map(item => new TransferFromItem(item.contract, item.receiver, item.target, item.amount, item.currency));
        return new TransferFromFact(token, factJson.sender, items);
    }
    if (hint.includes(HINT.POINT.TRANSFER.FACT)) {
        const items = factJson.items.map(item => new TransferItem(item.contract, item.receiver, item.amount, item.currency));
        return new TransferFact(token, factJson.sender, items);
    }
    if (hint.includes(HINT.POINT.APPROVE.FACT)) {
        const items = factJson.items.map(item => new ApproveItem(item.contract, item.approved, item.amount, item.currency));
        return new ApproveFact(token, factJson.sender, items);
    }
    // ======== TIMESTAMP ========
    if (hint.includes(HINT.TIMESTAMP.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact$1(token, factJson.sender, factJson.contract, factJson.currency);
    }
    if (hint.includes(HINT.TIMESTAMP.ISSUE.FACT)) {
        return new IssueFact(token, factJson.sender, factJson.contract, factJson.project_id, factJson.request_timestamp, factJson.data, factJson.currency);
    }
    // ======== DID ========
    if (hint.includes(HINT.DID.REGISTER_MODEL.FACT)) {
        return new RegisterModelFact(token, factJson.sender, factJson.contract, factJson.didMethod, factJson.currency);
    }
    if (hint.includes(HINT.DID.CREATE_DID.FACT)) {
        return new CreateFact(token, factJson.sender, factJson.contract, factJson.currency);
    }
    if (hint.includes(HINT.DID.UPDATE_DID_DOCUMENT.FACT)) {
        return new UpdateDocumentFact(token, factJson.sender, factJson.contract, factJson.did, documentFromJson(factJson.document), factJson.currency);
    }
    throw new Error(`factFromJson: unsupported fact type "${hint}". ` +
        `Add support for this type in src/utils/factFromJson.ts.`);
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
        return await getAPIData(() => operationApi.getOperations(this.api, this.delegateIP, limit, offset, reverse));
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
        const response = await getAPIData(() => operationApi.getOperation(this.api, hash, this.delegateIP));
        if (isSuccessResponse(response)) {
            response.data = response.data ? response.data : null;
        }
        return response;
    }
    /**
     * Get multiple operations by array of fact hashes.
     * Returns excluding operations that have not yet been recorded.
     * @async
     * @param {string[]} [hashes] - Array of fact hashes, fact hash must be base58 encoded string with 43 or 44 length.
     * @returns The `data` of `SuccessResponse` is array of infomation of the operations:
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
     */
    async getMultiOperations(hashes) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        ArrayAssert.check(hashes, "hashes")
            .noDuplicates()
            .rangeLength(Config.FACT_HASHES);
        hashes.forEach((hash) => {
            Assert.check(isBase58Encoded(hash) && (hash.length === 44 || hash.length === 43), MitumError.detail(ECODE.INVALID_FACT_HASH, "fact hash must be base58 encoded string with 44 or 43 length."));
        });
        const response = await getAPIData(() => operationApi.getMultiOperations(this.api, hashes, this.delegateIP));
        if (isSuccessResponse(response) && Array.isArray(response.data)) {
            response.data = response.data.map((el) => { return el._embedded; });
        }
        return response;
    }
    /**
     * Sign the given operation using the provided private key or key pair.
     * @param {string | Key | KeyPair} privatekey - The private key or key pair for signing.
     * @param {OP<Fact>} operation - The operation to sign.
     * @param {SignOption} [option] - (Optional) Option for node sign.
     * @returns {Promise<OP<Fact>>} A Promise that resolves to the signed operation.
     */
    async sign(privatekey, operation, option) {
        const op = operation;
        await op.sign(privatekey instanceof KeyPair ? privatekey.privateKey : privatekey, option);
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
        if (operation && typeof operation.then === "function") {
            throw MitumError.detail(ECODE.INVALID_OPERATION, "Invalid operation: received a Promise instead of a signed operation. Did you forget to 'await' a signing function?");
        }
        Assert.check(isOpFact(operation) || isHintedObject(operation), MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`));
        operation = isOpFact(operation) ? operation.toHintedObject() : operation;
        Assert.check(operation.signs.length !== 0, MitumError.detail(ECODE.EMPTY_SIGN, `signature is required before sending the operation`));
        Assert.check(Config.OP_SIZE.satisfy(new TextEncoder().encode(JSON.stringify(operation)).length), MitumError.detail(ECODE.OP_SIZE_EXCEEDED, `Operation size exceeds the allowed limit of ${Config.OP_SIZE.max} bytes.`));
        const sendResponse = await getAPIData(() => operationApi.send(this.api, operation, this.delegateIP, headers));
        return new OperationResponse(sendResponse, this.networkID, this.api, this.delegateIP);
    }
    /**
     * Estimate the expected transaction fee based on the currency policy.
     *
     * This function fetches the currency policy from the blockchain and calculates
     * the fee according to its configured fee model.
     *
     * Supported fee types:
     * - NIL: always returns total_fee "0"
     * - FIXED: returns total_fee as a constant fee
     * - FIXED_ITEM:
     *   - If no items → treated as 1 item → total_fee = base_fee + item_fee
     *   - If items exist → total_fee = base_fee + (item_unit_fee × item_count)
     * - FIXED_DETAILED: total_fee = base_fee + item_fee + data_size_fee
     *
     * @param {HintedObject | BaseOperation<Fact>} operation - The operation to estimate fee for.
     * @param {string | CurrencyID} currencyID - The currency identifier.
     * @returns {Promise<FeeEstimate>} Detailed fee breakdown. All amounts are in the smallest unit of the currency.
     */
    async estimateFee(operation, currencyID) {
        const cid = CurrencyID.from(currencyID).toString();
        Assert.check(this.api != null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Assert.check(isOpFact(operation) || isHintedObject(operation), MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`));
        try {
            const res = await getAPIData(() => currencyApi.getCurrency(this.api, currencyID, this.delegateIP));
            if (isErrorResponse(res)) {
                throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, `Failed to fetch currency data: \n${JSON.stringify(res, null, 2)}`);
            }
            if (!isSuccessResponse(res)) {
                throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, `Invalid response format`);
            }
            const feeer = res.data.policy?.feeer;
            Assert.check(feeer != null, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "feeer policy not found"));
            const hint = feeer._hint;
            if (hint.includes(HINT.CURRENCY.FEEER.NIL)) {
                return { _hint: hint, currency_id: cid, total_fee: "0" };
            }
            if (hint.includes(HINT.CURRENCY.FEEER.FIXED)) {
                return { _hint: hint, currency_id: cid, total_fee: String(feeer.amount) };
            }
            const opJson = isOpFact(operation) ? operation.toHintedObject() : operation;
            const itemCount = "items" in opJson.fact && Array.isArray(opJson.fact.items)
                ? opJson.fact.items.length
                : 1;
            if (hint.includes(HINT.CURRENCY.FEEER.FIXED_ITEM) &&
                !hint.includes(HINT.CURRENCY.FEEER.FIXED_DETAILED)) {
                const baseFee = BigInt(feeer.amount);
                const itemUnitFee = BigInt(feeer.item_fee_amount);
                const itemFee = itemUnitFee * BigInt(itemCount);
                const totalFee = baseFee + itemFee;
                return {
                    _hint: hint,
                    currency_id: cid,
                    total_fee: String(totalFee),
                    base_fee: String(baseFee),
                    item_unit_fee: String(itemUnitFee),
                    item_count: itemCount,
                    item_fee: String(itemFee),
                };
            }
            if (hint.includes(HINT.CURRENCY.FEEER.FIXED_DETAILED)) {
                const fact = isOpFact(operation)
                    ? operation.fact
                    : factFromJson(opJson.fact);
                const byteLength = fact.toBytes().length;
                const baseFee = BigInt(feeer.amount);
                const itemUnitFee = BigInt(feeer.item_fee_amount);
                const itemFee = itemUnitFee * BigInt(itemCount);
                const dataSizeUnit = Number(feeer.data_size_unit);
                const dataSizeUnitFee = BigInt(feeer.data_size_fee_amount);
                const dataSizeFee = dataSizeUnitFee * BigInt(Math.ceil(byteLength / dataSizeUnit));
                const totalFee = baseFee + itemFee + dataSizeFee;
                return {
                    _hint: hint,
                    currency_id: cid,
                    total_fee: String(totalFee),
                    base_fee: String(baseFee),
                    item_unit_fee: String(itemUnitFee),
                    item_count: itemCount,
                    item_fee: String(itemFee),
                    data_size_unit_fee: String(dataSizeUnitFee),
                    data_size_unit: dataSizeUnit,
                    data_size: byteLength,
                    data_size_fee: String(dataSizeFee),
                };
            }
            throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, `Unsupported feeer type: ${hint}`);
        }
        catch (error) {
            throw MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_DESIGN, `Failed to estimate fee: ${error?.message ?? error}`);
        }
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
     * - `receipt`: Receipt for the operation fee
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
                throw MitumError.detail(ECODE.INVALID_FLOAT, `${name} must be a positive integer`);
            }
        };
        validatePositiveInteger(maxTimeout, "timeout");
        validatePositiveInteger(timeoutInterval, "interval");
        if (maxTimeout <= timeoutInterval) {
            if (interval === undefined) {
                throw MitumError.detail(ECODE.INVALID_FLOAT, "default interval is 1000, so timeout must be greater than that.");
            }
            else if (timeout === undefined) {
                throw MitumError.detail(ECODE.INVALID_FLOAT, "default timeout is 10000, so interval must be less than that.");
            }
            else {
                throw MitumError.detail(ECODE.INVALID_FLOAT, "timeout must be larger than interval.");
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
        const design = new CurrencyDesign(initialSupply, currencyID, genesisAddress, decimal, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.item_fee));
        return new BaseOperation(this.networkID, new RegisterCurrencyFact(TimeStamp$1.new().UTC(), design));
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
        return new BaseOperation(this.networkID, new UpdateCurrencyFact(TimeStamp$1.new().UTC(), currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.item_fee)));
    }
    buildPolicy(feeType, minBalance, receiver, fee, item_fee) {
        Address.from(receiver);
        switch (feeType) {
            case "nil":
                return new CurrencyPolicy(minBalance, new NilFeeer());
            case "fixed":
                Assert.check(fee !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no fee"));
                return new CurrencyPolicy(minBalance, new FixedFeeer(receiver, fee));
            case "fixed-item":
                Assert.check(fee !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no base fee"));
                Assert.check(item_fee !== undefined, MitumError.detail(ECODE.CURRENCY.INVALID_CURRENCY_FEEER, "no item fee"));
                return new CurrencyPolicy(minBalance, new FixedItemFeeer(receiver, fee, item_fee));
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
        return new BaseOperation(this.networkID, new TransferFact$4(TimeStamp$1.new().UTC(), sender, [
            new TransferItem$3(receiver, [new Amount(currency, amount)])
        ], currency));
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
        ArrayAssert.check(receivers, "receivers").rangeLength(Config.ITEMS_IN_FACT).noDuplicates().sameLength(amounts, "amounts");
        return new BaseOperation(this.networkID, new TransferFact$4(TimeStamp$1.new().UTC(), sender, receivers.map((receiver, idx) => new TransferItem$3(receiver, [new Amount(currency, amounts[idx])])), currency));
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
        return new BaseOperation(this.networkID, new WithdrawFact$1(TimeStamp$1.new().UTC(), sender, [
            new WithdrawItem(target, [new Amount(currency, amount)])
        ], currency));
    }
    /**
     * Generate a `withdraw` operation with multiple items for withdrawing currency from multiple contract accounts.
     * Only the owner account of the contract can execute the operation.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | Address[]} [targets] - The array of target contract account's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amounts] - The array of withdrawal amount.
     * @returns `withdraw`operation
     */
    multiWithdraw(sender, targets, currency, amounts) {
        ArrayAssert.check(targets, "targets").rangeLength(Config.ITEMS_IN_FACT).sameLength(amounts, "amounts");
        const items = targets.map((el, idx) => { return new WithdrawItem(el, [new Amount(currency, amounts[idx])]); });
        return new BaseOperation(this.networkID, new WithdrawFact$1(TimeStamp$1.new().UTC(), sender, items, currency));
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
        return new BaseOperation(this.networkID, new MintFact$3(TimeStamp$1.new().UTC(), receiver, new Amount(currency, amount)));
    }
    /**
     * Get a list of all currency in the blockchain network.
     * @async
     * @returns `data` of `SuccessResponse` is a array with currency id.
     */
    async getAllCurrencies() {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        const response = await getAPIData(() => currencyApi.getCurrencies(this.api, this.delegateIP), true);
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
        return await getAPIData(() => currencyApi.getCurrency(this.api, currencyID, this.delegateIP));
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
            operation: new BaseOperation(this.networkID, new TransferFact$4(TimeStamp$1.new().UTC(), sender, [
                new TransferItem$3(ks.checksum, [new Amount(currency, amount)])
            ], currency)),
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
        const items = keyArray.map((ks) => new TransferItem$3(ks.address, [new Amount(currency, amount)]));
        return {
            wallet: keyArray,
            operation: new BaseOperation(this.networkID, new TransferFact$4(TimeStamp$1.new().UTC(), sender, items, currency)),
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
        return new BaseOperation(this.networkID, new TransferFact$4(TimeStamp$1.new().UTC(), sender, [
            new TransferItem$3(ks.checksum, [new Amount(currency, amount)])
        ], currency));
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
        return new BaseOperation(this.networkID, new CreateAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateAccountItem(new Keys(keys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), [new Amount(currency, amount)])
        ], currency));
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
        return new BaseOperation(this.networkID, new UpdateKeyFact(TimeStamp$1.new().UTC(), sender, new Keys(newKeys.map(k => k instanceof PubKey ? k : new PubKey(k.key, k.weight)), threshold), currency));
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
        await op.sign(privatekey);
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
        const response = await getAPIData(() => accountApi.getAccount(this.api, address, this.delegateIP));
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
        const response = await getAPIData(() => operationApi.getAccountOperations(this.api, address, this.delegateIP, limit, offset, reverse));
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
        return await getAPIData(() => accountApi.getAccountByPublicKey(this.api, publickey, this.delegateIP));
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
        const response = await getAPIData(() => accountApi.getAccount(this.api, address, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.balance ? response.data.balance : null;
        }
        return response;
    }
}
class Contract extends KeyG {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate a key pair and the corresponding `create-contract-account` operation.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @param {string} [seed] - (Optional) The seed for deterministic key generation. If not provided, a random key pair will be generated.
     * @returns An object containing the wallet(key pair) and the `create-contract-account` operation.
     */
    createWallet(sender, currency, amount, seed) {
        const kp = seed ? KeyPair.fromSeed(seed, "mitum") : KeyPair.random("mitum");
        const ks = new Keys([new PubKey(kp.publicKey, 100)], 100);
        return {
            wallet: {
                privatekey: kp.privateKey.toString(),
                publickey: kp.publicKey.toString(),
                address: ks.checksum.toString()
            },
            operation: new BaseOperation(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)])
            ], currency)),
        };
    }
    /**
     * Generate `n` number of key pairs and the corresponding `create-contract-account` operation with multiple items.
     * @param {string | Address} [sender] - The sender's address.
     * @param {number} [n] - The number of account to create.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The initial amount. (to be paid by the sender)
     * @returns An object containing the wallet (key pairs) and the `create-contract-account` operation with multiple items.
     */
    createBatchWallet(sender, n, currency, amount) {
        const keyArray = this.keys(n);
        const items = keyArray.map((ks) => new CreateContractAccountItem(new Keys([new PubKey(ks.publickey, 100)], 100), [new Amount(currency, amount)]));
        return {
            wallet: keyArray,
            operation: new BaseOperation(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, items, currency)),
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
        return new BaseOperation(this.networkID, new CreateContractAccountFact(TimeStamp$1.new().UTC(), sender, [
            new CreateContractAccountItem(new Keys([new PubKey(key, 100)], 100), [new Amount(currency, amount)])
        ], currency));
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
        const response = await getAPIData(() => accountApi.getAccount(this.api, address, this.delegateIP));
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
        return new BaseOperation(this.networkID, new UpdateHandlerFact(TimeStamp$1.new().UTC(), sender, contract, currency, handlers));
    }
    /**
     * Generate an `update-recipient` operation to update recipients of contract to given accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [contract] - The contract account address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {(string | Address)[]} [recipients] - The array of addresses to be updated as recipients.
     * @returns `update-recipient` operation.
     */
    updateRecipient(sender, contract, currency, recipients) {
        return new BaseOperation(this.networkID, new UpdateRecipientFact(TimeStamp$1.new().UTC(), sender, contract, currency, recipients));
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
        await op.sign(privatekey);
        return await new Operation(this.networkID, this.api, this.delegateIP).send(op);
    }
}

class NFT extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate `register-model` operation to register a new NFT model for creating a collection on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The collection data to be registed. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `minterWhitelist` - Accounts who have permissions to mint. If it's empty, anyone can mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation
     */
    registerModel(contract, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'minterWhitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new BaseOperation(this.networkID, new RegisterModelFact$4(TimeStamp$1.new().UTC(), sender, contract, data.name, data.royalty, data.uri, data.minterWhitelist, currency));
    }
    /**
     * Generate `update-model-config` operation to update the policy of the nft collection on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {collectionData} [data] - The policy data for nft collection to be updated. The properties of `collectionData` include:
     * - {string | LongString} `name` - The name of the NFT collection.
     * - {string | LongString} `uri` - The uri of the NFT collection.
     * - {string | number | Big} `royalty` - The royalty of the NFT collection.
     * - {(string | Address)[]} `minterWhitelist` - Accounts who have permissions to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-model-config` operation.
     */
    updateModelConfig(contract, sender, data, currency) {
        const keysToCheck = ['name', 'uri', 'royalty', 'minterWhitelist'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the collectionData structure`));
        });
        return new BaseOperation(this.networkID, new UpdateModelConfigFact(TimeStamp$1.new().UTC(), sender, contract, data.name, data.royalty, data.uri, data.minterWhitelist, currency));
    }
    /**
     * Generate `mint` operation for minting a new NFT and assigns it to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    mint(contract, sender, receiver, uri, hash, currency, creator) {
        return new BaseOperation(this.networkID, new MintFact$1(TimeStamp$1.new().UTC(), sender, [new MintItem(contract, receiver, hash, uri, new Signers([new Signer$1(creator, 100, false)]))], currency));
    }
    /**
     * Generate `mint` operation with multiple item for minting multiple NFT and assigns it to a receiver.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receivers] - The array of address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The array of URI for the NFTs to mint.
     * @param {string | LongString} [hash] - The array of hash for the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [creator] - The address of the creator of the artwork for NFT.
     * @returns `mint` operation.
     */
    multiMint(contract, sender, receivers, uri, hash, currency, creator) {
        ArrayAssert.check(receivers, "receivers").rangeLength(Config.ITEMS_IN_FACT).sameLength(uri, "uri").sameLength(hash, "hash");
        const contractsArray = convertToArray(contract, receivers.length);
        const items = Array.from({ length: receivers.length }).map((_, idx) => new MintItem(contractsArray[idx], receivers[idx], hash[idx], uri[idx], new Signers([new Signer$1(creator, 100, false)])));
        return new BaseOperation(this.networkID, new MintFact$1(TimeStamp$1.new().UTC(), sender, items, currency));
    }
    /**
     * Generate `mint` operation in case of multiple creators.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the newly minted NFT.
     * @param {string | LongString} [uri] - The URI of the NFT to mint.
     * @param {string | LongString} [hash] - The hash of the NFT to mint.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {Creator[]} [creators] - An array of Creator object which has address of the creator of the artwork for NFT with their respective shares. The properties of `Creator` include:
     * - {string | Address} `account` - The creator's address.
     * - {string | number | Big} `share` - The share for the artworks. The total share can not over 100.
     * @returns `mint` operation.
     */
    mintForMultiCreators(contract, sender, receiver, uri, hash, currency, creators) {
        const keysToCheck = ['account', 'share'];
        keysToCheck.forEach((key) => {
            creators.forEach((creator) => {
                Assert.check(creator[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the Creator structure`));
            });
        });
        return new BaseOperation(this.networkID, new MintFact$1(TimeStamp$1.new().UTC(), sender, [
            new MintItem(contract, receiver, hash, uri, new Signers(creators.map(a => new Signer$1(a.account, a.share, false))))
        ], currency));
    }
    /**
     * Generate `transfer` operation for transferring an NFT from one address to another.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The address of the receiver of the NFT.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer` operation.
     */
    transfer(contract, sender, receiver, nftIdx, currency) {
        const fact = new TransferFact$2(TimeStamp$1.new().UTC(), sender, [
            new TransferItem$1(contract, receiver, nftIdx)
        ], currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Generate `transfer` operation with multiple itmes to transfer NFTs from one address to another.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | Address[]} [receiver] - The array of address of the receiver of the NFT.
     * @param {string[] | number[] | Big[]} [nftIdx] - The array of index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer` operation with multiple items.
     */
    multiTransfer(contract, sender, receiver, nftIdx, currency) {
        ArrayAssert.check(receiver, "receiver").rangeLength(Config.ITEMS_IN_FACT).sameLength(nftIdx, "nftIdx");
        const contractsArray = convertToArray(contract, receiver.length);
        const items = Array.from({ length: receiver.length }).map((_, idx) => new TransferItem$1(contractsArray[idx], receiver[idx], nftIdx[idx]));
        return new BaseOperation(this.networkID, new TransferFact$2(TimeStamp$1.new().UTC(), sender, items, currency));
    }
    /**
     * Generate `approve` operation to approve NFT to another account (approved).
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The address of the sender of the NFT.
     * @param {string | Address} [approved] - The address being granted approval to manage the NFT.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve` operation.
     */
    approve(contract, sender, approved, nftIdx, currency) {
        return new BaseOperation(this.networkID, new ApproveFact$1(TimeStamp$1.new().UTC(), sender, [
            new ApproveItem$1(contract, approved, nftIdx)
        ], currency));
    }
    /**
     * Generate `approve` operation with multiple items to approve NFT to another account (approved).
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The address of the sender of the NFT.
     * @param {string[] | Address[]} [approved] - The array of address being granted approval to manage the NFT.
     * @param {string[] | number[] | Big[]} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve` operation with multiple items.
     */
    multiApprove(contract, sender, approved, nftIdx, currency) {
        ArrayAssert.check(approved, "approved").rangeLength(Config.ITEMS_IN_FACT).sameLength(nftIdx, "nftIdx");
        const contractsArray = convertToArray(contract, approved.length);
        const items = Array.from({ length: approved.length }).map((_, idx) => new ApproveItem$1(contractsArray[idx], approved[idx], nftIdx[idx]));
        return new BaseOperation(this.networkID, new ApproveFact$1(TimeStamp$1.new().UTC(), sender, items, currency));
    }
    /**
     * Generate `approve-all` operation to grant or revoke approval for an account to manage all NFTs of the sender.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The address of the sender giving or revoking approval.
     * @param {string | Address} [approved] - The address being granted or denied approval to manage all NFTs.
     * @param {"allow" | "cancel"} [mode] - The mode indicating whether to allow or cancel the approval.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve-all` operation.
     */
    approveAll(contract, sender, approved, mode, currency) {
        return new BaseOperation(this.networkID, new ApproveAllFact(TimeStamp$1.new().UTC(), sender, [
            new ApproveAllItem(contract, approved, mode)
        ], currency));
    }
    /**
     * Generate `approve-all` operation with multiple items to grant or revoke approval for an account to manage all NFTs of the sender.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The address of the sender giving or revoking approval.
     * @param {string | Address} [approved] - The address being granted or denied approval to manage all NFTs.
     * @param {"allow" | "cancel"} [mode] - The mode indicating whether to allow or cancel the approval.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `approve-all` operation with multiple items.
     */
    multiApproveAll(contract, sender, approved, mode, currency) {
        ArrayAssert.check(approved, "approved").rangeLength(Config.ITEMS_IN_FACT);
        const contractsArray = convertToArray(contract, approved.length);
        const items = Array.from({ length: approved.length }).map((_, idx) => new ApproveAllItem(contractsArray[idx], approved[idx], mode));
        return new BaseOperation(this.networkID, new ApproveAllFact(TimeStamp$1.new().UTC(), sender, items, currency));
    }
    /**
     * Generate `add-signature` operation to signs an NFT as creator of the artwork.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The address of the creator signing the NFT.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns add-signature operation
     */
    addSignature(contract, sender, nftIdx, currency) {
        return new BaseOperation(this.networkID, new AddSignatureFact(TimeStamp$1.new().UTC(), sender, [
            new AddSignatureItem(contract, nftIdx)
        ], currency));
    }
    /**
     * Get information about an NFT collection on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the NFT collection:
     * - `_hint`: Hint for NFT design,
     * - `contract`: Address of the contract account,
     * - `creator`: Address of the creator,
     * - `active`: Bool represents activation,
     * - `policy`:
     * - - `_hint`: Hint for the NFT collection policy,
     * - - `name`: Name of the NFT collection,
     * - - `royalty`: Royalty of the NFT collection,
     * - - `uri`: URI of the NFT collection,
     * - - `minter_whitelist`: Array of the addresses of accounts who have permissions to mint
     */
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.nft.getModel(this.api, contract, this.delegateIP));
    }
    /**
     * Get the owner of a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | number | Big} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the address of the NFT owner.
     */
    async getOwner(contract, nftIdx) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFT(this.api, contract, nftIdx, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.owner ? response.data.owner : null;
        }
        return response;
    }
    /**
     * Get the address approved to manage a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is an address of the approved account to manage the NFT.
     */
    async getApproved(contract, nftIdx) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFT(this.api, contract, nftIdx, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.approved ? response.data.approved : null;
        }
        return response;
    }
    /**
     * Get the total supply of NFTs in a collection on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is the total supply of NFTs in the collection.
     */
    async getTotalSupply(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getModel(this.api, contract, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.collection_count ? Number(response.data.collection_count) : 0;
        }
        return response;
    }
    /**
     * Get the URI of a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is the URI of the NFT.
     */
    async getURI(contract, nftIdx) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        const response = await getAPIData(() => contractApi.nft.getNFT(this.api, contract, nftIdx, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.uri ? response.data.uri : null;
        }
        return response;
    }
    /**
     * Get the address is approved to manage all NFTs of a sepecfic owner.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [owner] - The address of the NFT owner.
     * @returns `data` of `SuccessResponse` is approval information:
     * - `_hint`: Hint for NFT operators book,
     * - `operators`: Array of the addresses of accounts that have been delegated authority over all of the owner’s NFTs
     */
    async getApprovedAll(contract, owner) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(owner);
        return await getAPIData(() => contractApi.nft.getAccountOperators(this.api, contract, owner, this.delegateIP));
    }
    /**
     * Get detailed information about a specific NFT.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [nftIdx] - The index of the NFT (Indicate the order of minted).
     * @returns `data` of `SuccessResponse` is detailed information about the NFT:
     * - `_hint`: Hint for NFT,
     * - `nft_idx`: Index of the NFT,
     * - `active`: Bool represents activation,
     * - `owner`: Address of the owner,
     * - `hash`: Hash for the NFT,
     * - `uri`: URI for the NFT,
     * - `approved`: Address of the approved account for the NFT,
     * - `creators`: Creator object,
     */
    async getNFT(contract, nftIdx) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.nft.getNFT(this.api, contract, nftIdx, this.delegateIP));
    }
    /**
     * Get information of all NFTs in a collection. If the optional parameter factHash is given, only the nft created by the operation is searched.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {number} [factHash] - (Optional) The hash of fact in the operation that minted NFT.
     * @param {number} [limit] - (Optional) The maximum number of items to retrieve.
     * @param {number} [offset] - (Optional) The number of items skip before starting to return data.
     * @param {boolean} [reverse] - (Optional) Whether to return the items in reverse newest order.
     * @returns `data` of `SuccessResponse` is an array of the information about all NFTs in the NFT collection:
     * - `_hint`: Hint for currency,
     * - `_embedded`:
     * - - `_hint`: Hint for NFT,
     * - - `nft_idx`: Index of the NFT,
     * - - `active`: Bool represents activation,
     * - - `owner`: Address of the owner,
     * - - `hash`: Hash for the NFT,
     * - - `uri`: URI for the NFT,
     * - - `approved`: Address of the approved account for the NFT,
     * - - `creators`: Creator object,
     * - `_links`: Links for additional information
     */
    async getNFTs(contract, factHash, limit, offset, reverse) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.nft.getNFTs(this.api, contract, this.delegateIP, factHash, limit, offset, reverse));
    }
}

class DAO extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate `register-model` operation to register a new DAO model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {daoData} [data] - Data for policy of DAO service to create. The properties of `daoData` include:
     * - {'crypto' | 'biz'} `option` - Option indicates the type of proposal to be registered.
     * - {string | CurrencyID} `votingPowerToken` - The currency ID to be used when calculating voting power.
     * - {string | number | Big} `threshold` - The minimum balance of a proposer must hold after paying for the proposal fee.
     * - {string | number | Big} `proposalFee` - The fee paid when registering a proposal.
     * - {(string | Address)[]} `proposerWhitelist` - An array of addresses for accounts who can propose the new proposals.
     * - {string | number | Big} `proposalReviewPeriod` - The duration of the proposal review period (in seconds).
     * - {string | number | Big} `registrationPeriod` - The duration of the registration period (in seconds).
     * - {string | number | Big} `preSnapshotPeriod` - The duration of the pre-snapshot period (in seconds).
     * - {string | number | Big} `votingPeriod` - The duration of the voting period (in seconds).
     * - {string | number | Big} `postSnapshotPeriod` - The duration of the post-snapshot period (in seconds).
     * - {string | number | Big} `executionDelayPeriod` - The duration of the execution delay period (in seconds).
     * - {string | number | Big} `turnout` - The minimum rate of attendees for a proposal to pass (in percentage)
     * - {string | number | Big} `quorum` - The minimum rate of upvotes for a proposal to pass (in percentage)
     * @param {string | CurrencyID} currency - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract, sender, data, currency) {
        const keysToCheck = ['option', 'votingPowerToken', 'threshold', 'proposalFee', 'proposerWhitelist', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new BaseOperation(this.networkID, new RegisterModelFact$5(TimeStamp$1.new().UTC(), sender, contract, data.option, new DAOPolicy(data.votingPowerToken, data.threshold, new Fee(currency, data.proposalFee), new Whitelist(true, data.proposerWhitelist.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum), currency));
    }
    /**
     * Generate `update-model-config` operation for updating the DAO policy on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {daoData} [data] - Data for policy of DAO service to update. The properties of `daoData` include:
     * - {'crypto' | 'biz'} `option` - Option indicates the type of proposal to be registered.
     * - {string | CurrencyID} `votingPowerToken` - The currency ID to be used when calculating voting power.
     * - {string | number | Big} `threshold` - The minimum balance of a proposer must hold after paying for the proposal fee.
     * - {string | number | Big} `proposalFee` - The fee paid when registering a proposal.
     * - {(string | Address)[]} `proposerWhitelist` - An array of addresses for accounts who can propose the new proposals.
     * - {string | number | Big} `proposalReviewPeriod` - The duration of the proposal review period (in seconds).
     * - {string | number | Big} `registrationPeriod` - The duration of the registration period (in seconds).
     * - {string | number | Big} `preSnapshotPeriod` - The duration of the pre-snapshot period (in seconds).
     * - {string | number | Big} `votingPeriod` - The duration of the voting period (in seconds).
     * - {string | number | Big} `postSnapshotPeriod` - The duration of the post-snapshot period (in seconds).
     * - {string | number | Big} `executionDelayPeriod` - The duration of the execution delay period (in seconds).
     * - {string | number | Big} `turnout` - The minimum rate of attendees for a proposal to pass (in percentage)
     * - {string | number | Big} `quorum` - The minimum rate of upvotes for a proposal to pass (in percentage)
     * @param {string | CurrencyID} currency - The currency ID.
     * @returns `update-model-config` operation
     */
    updateModelConfig(contract, sender, data, currency) {
        const keysToCheck = ['option', 'votingPowerToken', 'threshold', 'proposalFee', 'proposerWhitelist', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the daoData structure`));
        });
        return new BaseOperation(this.networkID, new UpdateModelConfigFact$1(TimeStamp$1.new().UTC(), sender, contract, data.option, new DAOPolicy(data.votingPowerToken, data.threshold, new Fee(currency, data.proposalFee), new Whitelist(true, data.proposerWhitelist.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum), currency));
    }
    /**
     * Create transfer calldata for the crypto proposal to transfer crypto currency.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns Transfer calldata.
     */
    formTransferCalldata(sender, receiver, currency, amount) {
        return new TransferCalldata(sender, receiver, new Amount(currency, amount));
    }
    /**
     * Create governance calldata for the crypto proposal to update DAO policy.
     * @param {policyData} [data] - Data for policy of DAO service to update. The properties of `policyData` include:
     * - {string | CurrencyID} `votingPowerToken` - The currency ID to be used when calculating voting power.
     * - {string | number | Big} `threshold` - The minimum balance of a proposer must hold after paying for the proposal fee.
     * - {string | number | Big} `proposalFee` - The fee paid when registering a proposal.
     * - {(string | Address)[]} `proposerWhitelist` - An array of addresses for accounts who can propose the new proposals.
     * - {string | number | Big} `proposalReviewPeriod` - The duration of the proposal review period (in seconds).
     * - {string | number | Big} `registrationPeriod` - The duration of the registration period (in seconds).
     * - {string | number | Big} `preSnapshotPeriod` - The duration of the pre-snapshot period (in seconds).
     * - {string | number | Big} `votingPeriod` - The duration of the voting period (in seconds).
     * - {string | number | Big} `postSnapshotPeriod` - The duration of the post-snapshot period (in seconds).
     * - {string | number | Big} `executionDelayPeriod` - The duration of the execution delay period (in seconds).
     * - {string | number | Big} `turnout` - The minimum rate of attendees for a proposal to pass (in percentage)
     * - {string | number | Big} `quorum` - The minimum rate of upvotes for a proposal to pass (in percentage)
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns governance calldata.
     */
    formSetPolicyCalldata(data, currency) {
        const keysToCheck = ['votingPowerToken', 'threshold', 'proposalFee', 'proposerWhitelist', 'proposalReviewPeriod', 'registrationPeriod', 'preSnapshotPeriod', 'votingPeriod', 'postSnapshotPeriod', 'executionDelayPeriod', 'turnout', 'quorum'];
        keysToCheck.forEach((key) => {
            Assert.check(data[key] !== undefined, MitumError.detail(ECODE.INVALID_DATA_STRUCTURE, `${key} is undefined, check the policyData structure`));
        });
        return new GovernanceCalldata(new DAOPolicy(data.votingPowerToken, data.threshold, new Fee(currency, data.proposalFee), new Whitelist(true, data.proposerWhitelist.map(a => Address.from(a))), data.proposalReviewPeriod, data.registrationPeriod, data.preSnapshotPeriod, data.votingPeriod, data.postSnapshotPeriod, data.executionDelayPeriod, data.turnout, data.quorum));
    }
    /**
     * Write a crypto proposal include `TransferCalldata` or `GovernanceCalldata` .
     * @param {string} [proposer] - The address of the proposer.
     * @param {number} [startTime] - The time to start `proposalReviewPeriod` (in UTC timestamp).
     * @param {TransferCalldata | GovernanceCalldata} [calldata] - Calldata for the crypto proposal.
     * @returns Crypto proposal to be proposed.
     */
    writeCryptoProposal(proposer, startTime, calldata) {
        return new CryptoProposal(proposer, startTime, calldata);
    }
    /**
     * Write a business proposal providing multiple choice voting.
     * @param {string | Address} [proposer] - The address of the proposer.
     * @param {string | number | Big} [startTime] - The time to start `proposalReviewPeriod` (in UTC timestamp).
     * @param {string | LongString} [url] - The URL associated with the proposal.
     * @param {string | LongString} [hash] - The hash associated with the proposal.
     * @param {string | number | Big} [options] - The number of multiple choices.
     * @returns Business proposal to be proposed.
     */
    writeBizProposal(proposer, startTime, url, hash, options) {
        return new BizProposal(proposer, startTime, url, hash, options);
    }
    /**
     * Generate `propose` operation for propose a new proposal. Only the account in the whitelist can propose.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The unique identifier for the proposal.
     * @param {CryptoProposal | BizProposal} [proposal] - The proposal written by `writeBizProposal` or `writeCryptoProposal`.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `propose` operation.
     */
    propose(contract, sender, proposalID, proposal, currency) {
        return new BaseOperation(this.networkID, new ProposeFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, proposal, currency));
    }
    /**
     * Generate `register` operation to register to get voting right to the proposal. If approved is given, delegate voting rights to the account.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [approved] - (Optional) The address of the account to which voting rights will be delegated..
     * @returns `register` operation
     */
    register(contract, sender, proposalID, currency, approved) {
        return new BaseOperation(this.networkID, new RegisterFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, approved ? approved : sender, currency));
    }
    /**
     * Generate `cancel-proposal` operation to cancel a DAO proposal.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The unique identifier for the proposal.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `cancel-proposal` operation
     */
    cancelProposal(contract, sender, proposalID, currency) {
        return new BaseOperation(this.networkID, new CancelProposalFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, currency));
    }
    /**
     * Generate `pre-snap` operation to take a snapshot before the voting period.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `pre-snap` operation.
     */
    preSnap(contract, sender, proposalID, currency) {
        return new BaseOperation(this.networkID, new PreSnapFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, currency));
    }
    /**
     * Generate `vote` operation to cast a vote for the proposal.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {number} [voteOption] - The option chosen for the vote. (crypto: 0-approve, 1-disapprove, biz: choose from multiple choices)
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `vote` operation.
     */
    vote(contract, sender, proposalID, voteOption, currency) {
        return new BaseOperation(this.networkID, new VoteFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, voteOption, currency));
    }
    /**
     * Generate `post-snap` operation to take a snapshot after the voting period.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `post-snap` operation
     */
    postSnap(contract, sender, proposalID, currency) {
        return new BaseOperation(this.networkID, new PostSnapFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, currency));
    }
    /**
     * Generate `execute` operation to reflect voting results.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `execute` operation
     */
    execute(contract, sender, proposalID, currency) {
        return new BaseOperation(this.networkID, new ExecuteFact(TimeStamp$1.new().UTC(), sender, contract, proposalID, currency));
    }
    /**
     * Get DAO model information for a specific contract address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of the DAO service:
     * - `_hint`: Hint for dao design,
     * - `option`: 'biz' or 'crypto',
     * - `policy`: [Policy]
     */
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.dao.getModel(this.api, contract, this.delegateIP));
    }
    /**
     * Get information about a specific DAO proposal. The `status` does not accurately reflect the current state of the proposal because it is updated only when an operation occurs.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @returns `data` of `SuccessResponse` is information about the DAO proposal:
     * - `_hint`: Hint for the dao proposal state value,
     * - `reason`: Indicates the reason if the propose was canceled before voting,
     * - `status`: Proposal status - Proposed (0), Canceled (1), PreSnapped (2), PostSnapped (3), Completed (4), Rejected (5), Executed (6), NilStatus (7),
     * - `proposal`: [BizProposal] or [CryptoProposal],
     * - `policy`: [Policy]
     */
    async getProposal(contract, proposalID) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getProposal(this.api, contract, proposalID, this.delegateIP));
    }
    /**
     * Get the approved account who has taken over the voting rights from the registrant account.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @param {string | Address} [account] - The address of the account that has approved another account.
     * @returns `data` of `SuccessResponse` is approval information:
     * - `_hint`: Hint for DAO approval voting info,
     * - `account`: Address of the registrant that has approved another account,
     * - `approved`: Address of the approved account,
     */
    async getApproved(contract, proposalID, account) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getApproved(this.api, contract, proposalID, account, this.delegateIP));
    }
    /**
     * Get information about voters in a specific DAO proposal.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @returns `data` of `SuccessResponse` is an array of information of the voters:
     * - `_hint`: Hint for dao voter,
     * - `voter`: Address of account that can vote,
     * - `votring_power_holders`: List of accounts that have delegated their voting power to voter.
     */
    async getVoters(contract, proposalID) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getVoters(this.api, contract, proposalID, this.delegateIP));
    }
    /**
     * Get the status of the voting for the proposal.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [proposalID] - The proposal ID.
     * @returns `data` of `SuccessResponse` is information of voting power and the voting result:
     * - `_hint`: Hint for voting power box.
     * - `total`: Total voting power.
     * - `voting_powers`: Object mapping registered account addresses to their corresponding voting information represents `_hint`, `account`,`voted`, `vote_for`, `voting_power`.
     * - `result`: Object consisting of the selected option and the number of votes.
     */
    async getVotingStatus(contract, proposalID) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(proposalID, 'proposalID');
        return await getAPIData(() => contractApi.dao.getVotingStatus(this.api, contract, proposalID, this.delegateIP));
    }
}

new TextEncoder();

new TextEncoder();

class TimeStamp extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate a `register-model` operation to register new timestamp model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract, sender, currency) {
        return new BaseOperation(this.networkID, new RegisterModelFact$1(TimeStamp$1.new().UTC(), sender, contract, currency));
    }
    /**
     * Generate `issue` operation to issue new timestamp to the project on the timestamp model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string} [projectID] - The ID of the project to issue.
     * @param {string | number | Big} [requestTimeStamp] - Value of the timestamp to record.
     * @param {string} [data] - The data to be appended.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `issue` operation
     */
    issue(contract, sender, projectID, requestTimeStamp, data, currency) {
        new URIString(projectID, 'projectID');
        const fact = new IssueFact(TimeStamp$1.new().UTC(), sender, contract, projectID, requestTimeStamp, data, currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Get information about a timestamp service on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the timestamp service:
     * - `_hint`: Hint for timestamp design,
     * - `projects`: Array of all project's id
     */
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.timestamp.getModel(this.api, contract, this.delegateIP));
    }
    /**
     * Get detailed information about a timestamp on the project.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string} [projectID] - The ID of the project.
     * @param {string | number | Big} [timestampIdx] - The index of timestamp (Indicate the order of appended to the project)
     * @returns `data` of `SuccessResponse` is information about the timestamp with certain tid on the certain project:
     * - `_hint`: Hint for timestamp item,
     * - `project_id`: ID of the timestamp project,
     * - `request_timestamp`: Request timestamp entered when appending timestamp,
     * - `response_timestamp`: Time when the timestamp was registered,
     * - `timestamp_idx`: A index for the timestamp ,
     * - `data`: Data string
     */
    async getTimestamp(contract, projectID, timestampIdx) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        new URIString(projectID, 'projectID');
        return await getAPIData(() => contractApi.timestamp.getTimeStamp(this.api, contract, projectID, timestampIdx, this.delegateIP));
    }
}

class Token extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate a `register-model` operation to register new token model on a contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | LongString} [name] - The name of the token to register.
     * @param {string | CurrencyID} [symbol] - The symbol of the token to register.
     * @param {string | number | Big} [decimal] - (Optional) The decimal number to the token to register. If not provided, the default value is 0.
     * @param {string | number | Big} [initialSupply] - (Optional) The initial supply of the token to register. If not provided, the default value is 0.
     * @returns `register-model` operation.
     */
    registerModel(contract, sender, currency, name, symbol, decimal, initialSupply) {
        return new BaseOperation(this.networkID, new RegisterModelFact$8(TimeStamp$1.new().UTC(), sender, contract, currency, symbol, name, decimal ?? 0, initialSupply ?? 0));
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
    mint(contract, sender, currency, receiver, amount) {
        return new BaseOperation(this.networkID, new MintFact$2(TimeStamp$1.new().UTC(), sender, contract, currency, receiver, amount));
    }
    /**
     * Generate a `burn` operation for burning tokens from sender account.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | number | Big} [amount] - The amount to burn.
     * @returns `burn` operation
     */
    burn(contract, sender, currency, amount) {
        return new BaseOperation(this.networkID, new BurnFact$1(TimeStamp$1.new().UTC(), sender, contract, currency, amount));
    }
    /**
     * Generate an `transfer` operation for transferring tokens from the sender to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @returns `transfer` operation.
     */
    transfer(contract, sender, currency, receiver, amount) {
        const item = new TransferItem$2(contract, receiver, amount);
        return new BaseOperation(this.networkID, new TransferFact$3(TimeStamp$1.new().UTC(), sender, [item], currency));
    }
    /**
     * Generate an `transfer` operation with multi items to transfer tokens from the sender to a receiver.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string[] | Address[]} [receiver] - The array of receiver's address.
     * @param {string[] | number[] | Big[]} [amount] - The array of amounts to transfer.
     * @returns `transfer` operation with multi items.
     */
    multiTransfer(contract, sender, currency, receiver, amount) {
        ArrayAssert.check(receiver, "receiver").rangeLength(Config.ITEMS_IN_FACT).sameLength(amount, "amount");
        const contractsArray = convertToArray(contract, receiver.length);
        const items = Array.from({ length: receiver.length }).map((_, idx) => new TransferItem$2(contractsArray[idx], receiver[idx], amount[idx]));
        return new BaseOperation(this.networkID, new TransferFact$3(TimeStamp$1.new().UTC(), sender, items, currency));
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
    transferFrom(contract, sender, currency, receiver, target, amount) {
        const item = new TransferFromItem$1(contract, receiver, target, amount);
        return new BaseOperation(this.networkID, new TransferFromFact$1(TimeStamp$1.new().UTC(), sender, [item], currency));
    }
    /**
     * Generate a `transfer-from` operation with multi item to transfer tokens from targets account to receivers.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string[] | Address[]} [receiver] - The array of receiver's addresses.
     * @param {string[] | Address[]} [target] - The array of target account's addresses.
     * @param {string[] | number[] | Big[]} [amount] - The array of amounts to transfer.
     * @returns `transfer-from` operation.
     */
    multiTransferFrom(contract, sender, currency, receiver, target, amount) {
        ArrayAssert.check(receiver, "receiver")
            .rangeLength(Config.ITEMS_IN_FACT)
            .sameLength(amount, "amount")
            .sameLength(target, "target");
        const contractsArray = convertToArray(contract, receiver.length);
        const items = Array.from({ length: receiver.length }).map((_, idx) => new TransferFromItem$1(contractsArray[idx], receiver[idx], target[idx], amount[idx]));
        return new BaseOperation(this.networkID, new TransferFromFact$1(TimeStamp$1.new().UTC(), sender, items, currency));
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
    approve(contract, sender, currency, approved, amount) {
        const item = new ApproveItem$2(contract, approved, amount);
        return new BaseOperation(this.networkID, new ApproveFact$2(TimeStamp$1.new().UTC(), sender, [item], currency));
    }
    /**
     * Generate an `approve` operation with multi items to approve certain amount tokens to approved account.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {string[] | Address[]} [approved] - The array of addresses to approve.
     * @param {string[] | number[] | Big[]} [amount] - The array amounts to approve.
     * @returns `approve` operation with multi item
     */
    multiApprove(contract, sender, currency, approved, amount) {
        ArrayAssert.check(approved, "approved").rangeLength(Config.ITEMS_IN_FACT).sameLength(amount, "amount");
        const contractsArray = convertToArray(contract, approved.length);
        const items = Array.from({ length: approved.length }).map((_, idx) => new ApproveItem$2(contractsArray[idx], approved[idx], amount[idx]));
        return new BaseOperation(this.networkID, new ApproveFact$2(TimeStamp$1.new().UTC(), sender, items, currency));
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
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.token.getModel(this.api, contract, this.delegateIP));
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
    async getAllowance(contract, owner, approved) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(owner);
        Address.from(approved);
        const response = await getAPIData(() => contractApi.token.getModel(this.api, contract, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = calculateAllowance(response, owner, approved);
        }
        return response;
    }
    /**
     * Get token balance for given account.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [account] - The token owner's address.
     * @returns`data` of `SuccessResponse` is token balance information:
     * - `amount`: String of amount
     */
    async getBalance(contract, account) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(account);
        return await getAPIData(() => contractApi.token.getTokenBalance(this.api, contract, account, this.delegateIP));
    }
}

class Storage extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
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
        return new BaseOperation(this.networkID, new RegisterModelFact$7(TimeStamp$1.new().UTC(), sender, contract, project, currency));
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
        const item = new CreateDataItem(contract, dataKey, dataValue);
        const fact = new CreateDataFact(TimeStamp$1.new().UTC(), sender, [item], currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Generate `create-data` operation to create multiple data on the storage model.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[]} [dataKeys] - The array with key of multiple data to create.
     * @param {string[] | LongString[]} [dataValues] - The array with value of the multiple data to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-data` operation
     */
    createMultiData(contract, sender, dataKeys, dataValues, currency) {
        ArrayAssert.check(dataKeys, "dataKeys")
            .rangeLength(Config.ITEMS_IN_FACT)
            .sameLength(dataValues, "dataValues");
        const contractsArray = convertToArray(contract, dataKeys.length);
        const items = dataKeys.map((_, idx) => new CreateDataItem(contractsArray[idx], dataKeys[idx], dataValues[idx]));
        return new BaseOperation(this.networkID, new CreateDataFact(TimeStamp$1.new().UTC(), sender, items, currency));
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
        const item = new UpdateDataItem(contract, dataKey, dataValue);
        const fact = new UpdateDataFact(TimeStamp$1.new().UTC(), sender, [item], currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Generate `update-data` operation to update multiple data on the storage model.
     * @param {string | Address | string[] | Address[]} [contract] - A single contract address (converted to an array) or an array of multiple contract addresses.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[]} [dataKeys] - The array with key of multiple data to update.
     * @param {string[] | LongString[]} [dataValues] - The array with value of the multiple data to update.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-data` operation
     */
    updateMultiData(contract, sender, dataKeys, dataValues, currency) {
        ArrayAssert.check(dataKeys, "dataKeys")
            .rangeLength(Config.ITEMS_IN_FACT)
            .sameLength(dataValues, "dataValues");
        const contractsArray = convertToArray(contract, dataKeys.length);
        const items = dataKeys.map((_, idx) => new UpdateDataItem(contractsArray[idx], dataKeys[idx], dataValues[idx]));
        return new BaseOperation(this.networkID, new UpdateDataFact(TimeStamp$1.new().UTC(), sender, items, currency));
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
        const fact = new DeleteDataFact(TimeStamp$1.new().UTC(), sender, contract, dataKey, currency);
        return new BaseOperation(this.networkID, fact);
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

class Payment extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Generate a `register-model` operation to register new payment model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract, sender, currency) {
        return new BaseOperation(this.networkID, new RegisterModelFact$3(TimeStamp$1.new().UTC(), sender, contract, currency));
    }
    /**
     * Generate `deposit` operation to deposit currency to a payment model with configurable transfer settings.
     *
     * amount > 0 && end_time > start_time && duration <= (end_time - start_time)
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | number | Big} [amount] - The amount to deposit.
     * @param {string | number} [transfer_limit] - The maximum amount that can be sent in a single transaction.
     * @param {string | number | Big} [start_time] - The start time when a transfer becomes possible.
     * @param {string | number | Big} [end_time] - The end time after which a transfer is no longer allowed.
     * @param {string | number | Big} [duration] - The cooldown period (in seconds) after the last transfer, during which further transfers are blocked.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `deposit` operation
     */
    deposit(contract, sender, amount, transfer_limit, start_time, end_time, duration, currency) {
        const fact = new DepositFact(TimeStamp$1.new().UTC(), sender, contract, currency, amount, transfer_limit, start_time, end_time, duration);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Generate `update-account-setting` operation to update transfer setting.
     *
     * end_time > start_time && duration <= (end_time - start_time)
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | number} [transfer_limit] - The maximum amount that can be sent in a single transaction.
     * @param {string | number | Big} [start_time] - The start time when a transfer becomes possible.
     * @param {string | number | Big} [end_time] - The end time after which a transfer is no longer allowed.
     * @param {string | number | Big} [duration] - The cooldown period (in seconds) after the last transfer, during which further transfers are blocked.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `update-account-setting` operation
     */
    updateSetting(contract, sender, transfer_limit, start_time, end_time, duration, currency) {
        const fact = new UpdateFact(TimeStamp$1.new().UTC(), sender, contract, currency, transfer_limit, start_time, end_time, duration);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Generate an `transfer` operation for transferring certain currency from the deposit to a receiver.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [receiver] - The receiver's address.
     * @param {string | number | Big} [amount] - The amount to transfer.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `transfer` operation.
     */
    transfer(contract, sender, receiver, amount, currency) {
        return new BaseOperation(this.networkID, new TransferFact$1(TimeStamp$1.new().UTC(), sender, contract, currency, receiver, amount));
    }
    /**
     * Generate an `withdraw` operation to withdraw all deposits with certain currency at once and delete account information.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `withdraw` operation.
     */
    withdraw(contract, sender, currency) {
        return new BaseOperation(this.networkID, new WithdrawFact(TimeStamp$1.new().UTC(), sender, contract, currency));
    }
    /**
     * Get information about a payment service on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the payment service:
     * - `_hint`: Hint for the payment design structure,
     * - `transfer_settings`: A mapping of addresses to their respective payment settings,
     * - - `<address>`: A unique identifier for each user's payment setting,
     * - - - `_hint`: Hint for the payment setting structure,
     * - - - `address`: The address associated with this payment setting,
     * - - - `items`: A mapping of tokens to their transfer conditions,
     * - - - - `<currency id>`: The currency id,
     * - - - - - `transfer_limit`: The maximum amount that can be transferred,
     * - - - - - `start_time`: The start time when a transfer becomes possible,
     * - - - - - `end_time`: The end time after which a transfer is no longer allowed,
     * - - - - - `duration`: The cooldown period after the last transfer, during which further transfers are blocked.
     */
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => contractApi.payment.getModel(this.api, contract, this.delegateIP));
    }
    /**
     * Get information about the remaining deposit and transfer settings for a given user address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [address] - The address of account.
     * @returns `data` of `SuccessResponse` is information about the timestamp with certain tid on the certain project:
     * - `_hint`: Hint for the payment account information structure,
     * - `transfer_setting`: Transfer conditions set for the account,
     * - - `_hint`: Hint for the payment setting structure,
     * - - `address`: The address associated with this payment setting,
     * - - `items`: A mapping of tokens to their transfer conditions,
     * - - - `<currency id>`: The currency id,
     * - - - - `transfer_limit`: The maximum amount that can be transferred,
     * - - - - `start_time`: The start time when a transfer becomes possible,
     * - - - - `end_time`: The end time after which a transfer is no longer allowed,
     * - - - - `duration`: The cooldown period after the last transfer, during which further transfers are blocked.
     * - `deposit_record`: Deposit details of the account,
     * - - `_hint`: Hint for the deposit record structure,
     * - - `address`: The address associated with this deposit record,
     * - - `items`: A mapping of tokens to their deposit information,
     * - - - `<currency id>`: The currency id,
     * - - - - `amount`: The remainning deposited,
     * - - - - `transferred_at`: The timestamp of the last transfer (Unix timestamp).
     */
    async getPaymentInfo(contract, address) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        return await getAPIData(() => contractApi.payment.getAccountInfo(this.api, contract, address, this.delegateIP));
    }
}

const encoder$1 = new TextEncoder();
const MESSAGE_PREFIX = "\x19ImFACT Signed Message:\n";
function encodePersonalMessage(message) {
    const msg = encoder$1.encode(message);
    const prefix = encoder$1.encode(MESSAGE_PREFIX + msg.length.toString());
    return concatBytes([prefix, msg]);
}

const encoder = new TextEncoder();
class Signer extends Generator {
    constructor(networkID, api) {
        super(networkID, api);
    }
    /**
     * Signs the given operation using the provided private key.
     *
     * This method supports both raw Operation instances and JSON representations.
     * Internally, all inputs are normalized into OperationJson format before signing.
     *
     * @param {string | Key} privatekey - The private key used for signing.
     * @param {BaseOperation<Fact> | OperationJson | string} operation - The operation to sign.
     *        Accepts:
     *          - BaseOperation instance
     *          - OperationJson object
     *          - JSON string (parsable to OperationJson)
     * @param {SignOption} [option] - Optional signing options (e.g. node address for NodeFactSign).
     *
     * @returns {Promise<OperationJson>} The signed operation in OperationJson format.
     *
     * @throws {MitumError} If the operation format is invalid or signing fails.
     */
    async sign(privatekey, operation, option) {
        if (typeof operation === "string") {
            try {
                operation = JSON.parse(operation);
            }
            catch {
                throw MitumError.detail(ECODE.INVALID_OPERATION, `input can not be recontructed into HintedObject format`);
            }
        }
        Assert.check(isOpFact(operation) || isHintedObject(operation), MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`));
        let opJson;
        if (isOpFact(operation)) {
            opJson = operation.toHintedObject();
        }
        else if (isHintedObject(operation)) {
            opJson = operation;
        }
        else {
            throw MitumError.detail(ECODE.INVALID_OPERATION, "invalid operation type");
        }
        Key.from(privatekey);
        const keypair = KeyPair.fromPrivateKey(privatekey);
        return option
            ? await this.nodeSign(keypair, opJson, option.node ?? "")
            : await this.accSign(keypair, opJson);
    }
    async accSign(keypair, operation) {
        const now = TimeStamp$1.new();
        const hash = operation.fact.hash;
        Assert.check(typeof hash === "string" && hash.length > 0, MitumError.detail(ECODE.INVALID_OPERATION, "empty fact hash"));
        const msgToSign = concatBytes([
            encoder.encode(this.networkID),
            base58.decode(operation.fact.hash),
            now.toBytes(),
        ]);
        const fs = new GeneralFactSign(keypair.publicKey.toString(), await keypair.sign(msgToSign), now.toString()).toHintedObject();
        if (operation.signs !== undefined) {
            operation.signs = [...operation.signs, fs];
        }
        else {
            operation.signs = [fs];
        }
        Assert.check(new Set(operation.signs.map(fs => fs.signer.toString())).size === operation.signs.length, MitumError.detail(ECODE.INVALID_FACTSIGNS, "duplicate signers found in factsigns"));
        const factSigns = operation.signs.map((s) => concatBytes([
            encoder.encode(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBytes("super"),
        ]));
        const msg = concatBytes([
            base58.decode(operation.fact.hash),
            concatBytes(factSigns),
        ]);
        if (isHintedObjectFromUserOp(operation)) {
            return this.FillUserOpHash(operation);
        }
        operation.hash = base58.encode(sha3(msg));
        return operation;
    }
    async nodeSign(keypair, operation, node) {
        const nd = new NodeAddress(node);
        const now = TimeStamp$1.new();
        const msgToSign = concatBytes([
            encoder.encode(this.networkID),
            nd.toBytes(),
            base58.decode(operation.fact.hash),
            now.toBytes(),
        ]);
        const fs = new NodeFactSign(node, keypair.publicKey.toString(), await keypair.sign(msgToSign), now.toString()).toHintedObject();
        operation.signs = operation.signs ? [...operation.signs, fs] : [fs];
        const factSigns = operation.signs
            .map((s) => concatBytes([
            encoder.encode(s.signer),
            base58.decode(s.signature),
            new FullTimeStamp(s.signed_at).toBytes("super"),
        ]))
            .sort((a, b) => {
            const len = Math.min(a.length, b.length);
            for (let i = 0; i < len; i++) {
                if (a[i] !== b[i])
                    return a[i] - b[i];
            }
            return a.length - b.length;
        });
        const msg = concatBytes([
            base58.decode(operation.fact.hash),
            concatBytes(factSigns),
        ]);
        operation.hash = base58.encode(sha3(msg));
        return operation;
    }
    FillUserOpHash(userOperation) {
        const { extension } = userOperation;
        const { authentication, settlement, proxy_payer } = extension;
        this.validateUserOpFields({ ...authentication, ...settlement, ...proxy_payer });
        const hintedExtension = (() => {
            const auth = new Authentication$1(authentication.contract, authentication.authentication_id, authentication.proof_data).toHintedObject();
            const settlementObj = new Settlement(settlement.op_sender).toHintedObject();
            if (proxy_payer) {
                const proxyPayerObj = new ProxyPayer(proxy_payer.proxy_payer).toHintedObject();
                return { authentication: auth, proxy_payer: proxyPayerObj, settlement: settlementObj };
            }
            return { authentication: auth, settlement: settlementObj };
        })();
        const msg = concatBytes([
            encoder.encode(JSON.stringify(hintedExtension)),
            base58.decode(userOperation.fact.hash),
            concatBytes(userOperation.signs.map((s) => concatBytes([
                encoder.encode(s.signer),
                base58.decode(s.signature),
                new FullTimeStamp(s.signed_at).toBytes("super"),
            ]))),
        ]);
        userOperation.hash = base58.encode(sha3(msg));
        return userOperation;
    }
    validateUserOpFields(fields) {
        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined) {
                StringAssert.with(value, MitumError.detail(ECODE.INVALID_USER_OPERATION, `Cannot sign the user operation: ${key} must not be empty.`)).empty().not().excute();
            }
        });
    }
    /**
     * Signs a personal message using the provided private key.
     *
     * @param {string | Key} privatekey - The private key used for signing.
     * @param {string} message - The message to sign.
     * @returns {Promise<string>} Base58-encoded signature.
     */
    async signMessage(privatekey, message) {
        StringAssert.with(message, MitumError.detail(ECODE.INVALID_LENGTH, `message must not be empty or too long (over ${Config.MSG_SIZE.max} bytes)`))
            .empty().not()
            .satisfyConfig({ satisfy: (len) => len <= Config.MSG_SIZE.max })
            .excute();
        const keypair = KeyPair.fromPrivateKey(privatekey);
        const msg = encodePersonalMessage(message);
        const sig = await keypair.sign(msg);
        return base58.encode(sig);
    }
    /**
     * Verifies a personal message signature using the provided public key.
     *
     * @param {string | Key} publickey - The public key of the signer.
     * @param {string} message - The original message.
     * @param {string} signature - The base58-encoded signature.
     * @returns {Promise<boolean>} True if valid, otherwise false.
     */
    async verifyMessage(publickey, message, signature) {
        try {
            StringAssert.with(message, MitumError.detail(ECODE.INVALID_LENGTH, `message must not be empty or too long (over ${Config.MSG_SIZE.max} bytes)`))
                .empty().not()
                .satisfyConfig({ satisfy: (len) => len <= Config.MSG_SIZE.max })
                .excute();
            StringAssert.with(signature, MitumError.detail(ECODE.INVALID_SIG_TYPE, "signature must not be empty"))
                .empty().not()
                .excute();
            Assert.check(isBase58Encoded(signature), MitumError.detail(ECODE.INVALID_SIG_TYPE, "signature must be base58 encoded"));
            const pub = Key.from(publickey);
            const sigBytes = typeof signature === "string" ? base58.decode(signature) : signature;
            Assert.check(sigBytes.length > 4, MitumError.detail(ECODE.INVALID_SIG_TYPE, "invalid signature length"));
            const view = new DataView(sigBytes.buffer, sigBytes.byteOffset, 4);
            const rlen = view.getUint32(0, true);
            Assert.check(rlen > 0 && rlen <= sigBytes.length - 4, MitumError.detail(ECODE.INVALID_SIG_TYPE, "invalid r length in signature"));
            const r = sigBytes.slice(4, 4 + rlen);
            const s = sigBytes.slice(4 + rlen);
            const der = concatBytes([
                new Uint8Array([0x30]),
                new Uint8Array([2 + r.length + 2 + s.length]),
                new Uint8Array([0x02, r.length]),
                r,
                new Uint8Array([0x02, s.length]),
                s,
            ]);
            const digest = encodePersonalMessage(message);
            const msgHash = sha256$1(digest);
            const pubBytes = toBytes$2(pub.noSuffix);
            return secp256k1.verify(der, msgHash, pubBytes);
        }
        catch {
            return false;
        }
    }
}

const ASYMKEY_TYPE_MAP = {
    SECP256K1_2019: "EcdsaSecp256k1VerificationKey2019",
    SECP256K1_IMFACT_2025: "EcdsaSecp256k1VerificationKeyImFact2025",
};
const isOfType = (obj, keys) => typeof obj === "object" && obj !== null && keys.every((key) => key in obj);
const validateAuthentication = (auth, index) => {
    const baseKeys = ["_hint", "id", "type", "controller"];
    if (!isOfType(auth, baseKeys)) {
        throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, "Invalid authentication type");
    }
    if (auth.type === "Ed25519VerificationKey2020" || auth.type === "EcdsaSecp256k1VerificationKeyImFact2025" || auth.type === "EcdsaSecp256k1VerificationKey2019") {
        const asymkeyAuthKeys = [...baseKeys, "publicKeyImFact"];
        if (!isOfType(auth, asymkeyAuthKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Asymkey authentication at index ${index} is missing required fields.`);
        }
    }
    else if (auth.type === "LinkedVerificationMethod") {
        const linkedAuthKeys = [...baseKeys, "targetId", "allowed"];
        if (!isOfType(auth, linkedAuthKeys)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Linked authentication at index ${index} is missing required fields.`);
        }
        if (!Array.isArray(auth.allowed)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `The 'allowed' field in linked authentication at index ${index} must be an array.`);
        }
        if (typeof auth.targetId !== "string" &&
            !(auth.targetId instanceof LongString)) {
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Invalid 'targetId' in linked authentication at index ${index}.`);
        }
    }
    else {
        throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Unknown authentication type at index ${index}.`);
    }
};
class Did extends ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    normalizeDocument(doc, sender) {
        if (doc instanceof Document) {
            return doc;
        }
        this.validateDocument(doc);
        this.isSenderDidOwner(sender, doc.id);
        if (doc.service) {
            doc.service.forEach(service => {
                this.isSenderDidOwner(sender, service.id, true);
            });
        }
        return new Document(doc["@context"], doc.id, doc.authentication.map(el => this.mapAuthToClass(el, sender)), doc.verificationMethod.map(el => this.mapAuthToClass(el, sender)), doc.service
            ? doc.service.map(service => new Service(service.id, service.type, service.service_end_point))
            : undefined);
    }
    validateDocument(doc) {
        if (!doc || typeof doc !== "object") {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, `document must be an object, got ${doc === null ? "null" : typeof doc}`);
        }
        const d = doc;
        if (typeof d._hint !== "string") {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "_hint must be a string");
        }
        if (!Array.isArray(d["@context"])) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "@context must be an array");
        }
        if (!d.id) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "id is required");
        }
        if (!Array.isArray(d.authentication)) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "authentication must be an array");
        }
        if (!Array.isArray(d.verificationMethod)) {
            throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "verificationMethod must be an array");
        }
        for (const [i, ctx] of d["@context"].entries()) {
            if (typeof ctx !== "string" && !(ctx instanceof LongString)) {
                throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, `@context[${i}] must be string or LongString`);
            }
        }
        d.authentication.forEach((auth, i) => {
            try {
                validateAuthentication(auth, i);
            }
            catch (e) {
                throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, `invalid authentication[${i}]: ${e.message}`);
            }
        });
        d.verificationMethod.forEach((vm, i) => {
            try {
                validateAuthentication(vm, i);
            }
            catch (e) {
                throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, `invalid verificationMethod[${i}]: ${e.message}`);
            }
        });
        if (d.service !== undefined && d.service !== null) {
            if (!Array.isArray(d.service)) {
                throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, "service must be an array if provided");
            }
            d.service.forEach((el, i) => {
                if (!el || typeof el !== "object") {
                    throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, `service[${i}] must be an object`);
                }
                if (!el.id || !el.type || !el.service_end_point) {
                    throw MitumError.detail(ECODE.DID.INVALID_DOCUMENT, `service[${i}] requires id, type, service_end_point`);
                }
            });
        }
    }
    isSenderDidOwner(sender, did, id) {
        Assert.check(sender.toString() === validateDID(did.toString(), id).toString(), MitumError.detail(ECODE.DID.INVALID_DID, `The owner of did must match the sender(${sender.toString()}). check the did (${did.toString()})`));
    }
    mapAuth(auth) {
        if (auth.type === "LinkedVerificationMethod") {
            return new LinkedAuth(auth.id, auth.controller, auth.targetId, auth.allowed);
        }
        if (auth.type === "Ed25519VerificationKey2020" ||
            auth.type === "EcdsaSecp256k1VerificationKey2019" ||
            auth.type === "EcdsaSecp256k1VerificationKeyImFact2025") {
            return new AsymKeyAuth(auth.id, auth.type, auth.controller, auth.publicKeyImFact);
        }
        throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `Unknown authentication type: ${String(auth.type)}`);
    }
    mapAuthToClass(el, sender) {
        this.isSenderDidOwner(sender, el.id, true);
        this.isSenderDidOwner(sender, el.controller);
        return this.mapAuth(el);
    }
    /**
     * Creates an AsymKeyAuth object with the provided authentication details.
     * @param {string} id - The unique identifier for the authentication. <did>#<key-id> format.
     * @param {"SECP256K1_2019" | "SECP256K1_IMFACT_2025"} option - Short identifier for verification key type.
     *  - SECP256K1_2019 → EcdsaSecp256k1VerificationKey2019
     *  - SECP256K1_IMFACT_2025 → EcdsaSecp256k1VerificationKeyImFact2025
     * @param {string} controller - The controller responsible for the authentication.
     * @param {string} publicKeyImFact - The public key associated with the authentication.
     * @returns {AsymKeyAuth} An AsymKeyAuth Instance.
     */
    writeAsymkeyAuth(id, option, controller, publicKeyImFact) {
        const verificationType = ASYMKEY_TYPE_MAP[option];
        if (!verificationType) {
            throw MitumError.detail(ECODE.INVALID_TYPE, `Unsupported asym key option: ${option}`);
        }
        return new AsymKeyAuth(id, verificationType, controller, publicKeyImFact);
    }
    /**
     * Creates a LinkedAuth object that allows another authentication method
     * (e.g. OAuth provider, biometric service, custody service)
     * to act on behalf of the DID subject with restricted operation capabilities.
     * @param {string} id - The unique identifier of this linked authentication method. <did>#<key-id> format.
     * @param {string} controller - The DID controller that authorizes this linked authentication.
     * @param {string} targetId - The identifier of the authentication method that performs verification on behalf of the DID subject.
     * @param {AllowedOperation[]} allowedOperations - A list of operation capabilities that this linked authentication is permitted to execute on behalf of the DID subject.
     *   Each allowedOperation must be created using {@link Mitum.allowedOperation}, which provides a safe, typed registry of core-supported operations.
     *   Example:
     *   ```ts
     *   const allowed = [
     *     Mitum.allowedOperation.currency.transfer(),
     *     Mitum.allowedOperation.did.create(contract),
     *   ];
     *   ```
     * @returns {LinkedAuth} LinkedAuth instance.
     */
    writeLinkedAuth(id, controller, targetId, allowedOperations) {
        return new LinkedAuth(id, controller, targetId, allowedOperations);
    }
    /**
     * The returned Document can be passed directly to `updateDocument()`.
     * @param {Array<string | LongString>} didContext - DID document contexts (e.g. DID Core context, service-specific context).
     * @param {string} didID - DID identifier.
     * @param {Array<AsymKeyAuth | LinkedAuth>} authentications - Authentication methods for the DID.
     * @param {Array<AsymKeyAuth | LinkedAuth>} [verificationMethods] - Verification methods for the DID.
     * @param {Array<Object>} [services] - Optional service definitions.
     * @param {string} services[].id - Service identifier. <did>#<key-id> format.
     * @param {string} services[].type - Service type.
     * @param {string} services[].service_end_point - Service endpoint URL.
     * @returns {Document} DID Document instance.
     */
    writeDocument(didContext, didID, authentications, verificationMethods = [], service) {
        return new Document(didContext, didID, authentications.map((auth, idx) => {
            if (auth instanceof AsymKeyAuth || auth instanceof LinkedAuth) {
                return auth;
            }
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `authentication[${idx}] must be AsymKeyAuth or LinkedAuth instance`);
        }), verificationMethods.map((auth, idx) => {
            if (auth instanceof AsymKeyAuth || auth instanceof LinkedAuth) {
                return auth;
            }
            throw MitumError.detail(ECODE.DID.INVALID_AUTHENTICATION, `verificationMethods[${idx}] must be AsymKeyAuth or LinkedAuth instance`);
        }), service
            ? service.map(el => new Service(el.id, el.type, el.service_end_point))
            : undefined);
    }
    /**
     * Generate a `register-model` operation to register new did registry model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [didMethod] - The did method
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract, sender, didMethod, currency) {
        return new BaseOperation(this.networkID, new RegisterModelFact(TimeStamp$1.new().UTC(), sender, contract, didMethod, currency));
    }
    /**
     * Generate `create-did` operation to create new did and did document.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(contract, sender, currency) {
        const fact = new CreateFact(TimeStamp$1.new().UTC(), sender, contract, currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Update an Auth DID document using a strongly-typed document object.
     *
     * This method expects the `document` parameter to conform to the SDK's
     * internal `document` type. All authentication entries must already be
     * validated and structurally correct, and will be converted into
     * corresponding class instances (`AsymKeyAuth`, `LinkedAuth`, etc.).
     *
     * Ownership checks are enforced:
     * - The sender must be the owner of the document DID.
     * - The sender must also own any controller or service DID referenced
     *   in the document
     * @param contract - The Auth DID contract address.
     * @param sender - The transaction sender; must be the owner of the document DID.
     * @param document - A validated document object matching the SDK `document` type.
     * @param currency - Currency ID used for the operation fee.
     * @returns An `BaseOperation` instance that can be signed and submitted to the network.
     */
    updateDocument(contract, sender, document, currency) {
        const normalized = this.normalizeDocument(document, sender);
        const fact = new UpdateDocumentFact(TimeStamp$1.new().UTC(), sender, contract, normalized.id.toString(), normalized, currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Update an Auth DID document from a raw JSON object.
     *
     * This method accepts an untyped document (e.g. parsed JSON), validates
     * its structure and authentication entries, and converts it into internal
     * SDK classes before creating the operation.
     *
     * Use this method when the document comes from external or untrusted sources.
     * @param contract - The Auth DID contract address.
     * @param sender - The transaction sender; must own the document DID.
     * @param documentJson - A raw JSON object representing an Auth DID document.
     * @param currency - Currency ID used for the operation fee.
     * @returns An `BaseOperation` instance ready to be signed and submitted.
     */
    updateDocumentByDocumentJson(contract, sender, documentJson, currency) {
        const normalized = this.normalizeDocument(documentJson, sender);
        const fact = new UpdateDocumentFact(TimeStamp$1.new().UTC(), sender, contract, normalized.id.toString(), normalized, currency);
        return new BaseOperation(this.networkID, fact);
    }
    /**
     * Get information for did-registry model.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information of did model:
     * - `_hint`: hint for did model design,
     * - `didMethod`: The did method
     */
    async getModelInfo(contract) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        return await getAPIData(() => contractApi.did.getModel(this.api, contract, this.delegateIP));
    }
    /**
     * Get did by account address.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [account] - The account address.
     * @returns `data` of `SuccessResponse` is did:
     * - `did`: The did value,
     */
    async getDID(contract, account) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        Address.from(account);
        const response = await getAPIData(() => contractApi.did.getByAccount(this.api, contract, account, this.delegateIP));
        if (isSuccessResponse(response) && response.data) {
            response.data = response.data.did ? { did: response.data.did } : null;
        }
        return response;
    }
    /**
     * Get did document by did.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [did] - The did value.
     * @returns `data` of `SuccessResponse` is did document.
     */
    async getDocument(contract, did) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Address.from(contract);
        validateDID(did);
        const response = await getAPIData(() => contractApi.did.getByDID(this.api, contract, did, this.delegateIP));
        return response;
    }
}

const currency = {
    transfer() {
        return new AllowedOperation(HINT.CURRENCY.TRANSFER.OPERATION);
    },
};
const account = {
    create() {
        return new AllowedOperation(HINT.CURRENCY.CREATE_ACCOUNT.OPERATION);
    },
    updateKey() {
        return new AllowedOperation(HINT.CURRENCY.UPDATE_HANDLER.OPERATION);
    },
};
const contract = {
    create() {
        return new AllowedOperation(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.OPERATION);
    },
    withdraw() {
        return new AllowedOperation(HINT.CURRENCY.WITHDRAW.OPERATION);
    },
    updateRecipient() {
        return new AllowedOperation(HINT.CURRENCY.UPDATE_RECIPIENT.OPERATION);
    },
    updateHandler() {
        return new AllowedOperation(HINT.CURRENCY.UPDATE_HANDLER.OPERATION);
    },
};
const credential = {
    registerModel(contract) {
        return new AllowedOperation(HINT.CREDENTIAL.REGISTER_MODEL.OPERATION, contract, true);
    },
    addTemplate(contract) {
        return new AllowedOperation(HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION, contract, true);
    },
    issue(contract) {
        return new AllowedOperation(HINT.CREDENTIAL.ISSUE.OPERATION, contract, true);
    },
    revoke(contract) {
        return new AllowedOperation(HINT.CREDENTIAL.REVOKE.OPERATION, contract, true);
    },
};
const dao = {
    registerModel(contract) {
        return new AllowedOperation(HINT.DAO.REGISTER_MODEL.OPERATION, contract, true);
    },
    updateModelConfig(contract) {
        return new AllowedOperation(HINT.DAO.UPDATE_MODEL_CONFIG.OPERATION, contract, true);
    },
    propose(contract) {
        return new AllowedOperation(HINT.DAO.PROPOSE.OPERATION, contract, true);
    },
    cancelProposal(contract) {
        return new AllowedOperation(HINT.DAO.CANCEL_PROPOSAL.OPERATION, contract, true);
    },
    register(contract) {
        return new AllowedOperation(HINT.DAO.REGISTER.OPERATION, contract, true);
    },
    preSnap(contract) {
        return new AllowedOperation(HINT.DAO.PRE_SNAP.OPERATION, contract, true);
    },
    postSnap(contract) {
        return new AllowedOperation(HINT.DAO.POST_SNAP.OPERATION, contract, true);
    },
    vote(contract) {
        return new AllowedOperation(HINT.DAO.VOTE.OPERATION, contract, true);
    },
    execute(contract) {
        return new AllowedOperation(HINT.DAO.EXECUTE.OPERATION, contract, true);
    },
};
const nft = {
    registerModel(contract) {
        return new AllowedOperation(HINT.NFT.REGISTER_MODEL.OPERATION, contract, true);
    },
    updateModelConfig(contract) {
        return new AllowedOperation(HINT.NFT.UPDATE_MODEL_CONFIG.OPERATION, contract, true);
    },
    mint(contract) {
        return new AllowedOperation(HINT.NFT.MINT.OPERATION, contract, true);
    },
    approveAll(contract) {
        return new AllowedOperation(HINT.NFT.APPROVE_ALL.OPERATION, contract, true);
    },
    approve(contract) {
        return new AllowedOperation(HINT.NFT.APPROVE.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation(HINT.NFT.TRANSFER.OPERATION, contract, true);
    },
    addSignature(contract) {
        return new AllowedOperation(HINT.NFT.ADD_SIGNATURE.OPERATION, contract, true);
    },
};
const payment = {
    registerModel(contract) {
        return new AllowedOperation(HINT.PAYMENT.REGISTER_MODEL.OPERATION, contract, true);
    },
    deposit(contract) {
        return new AllowedOperation(HINT.PAYMENT.DEPOSIT.OPERATION, contract, true);
    },
    updateAccountSetting(contract) {
        return new AllowedOperation(HINT.PAYMENT.UPDATE_ACCOUNT_SETTING.OPERATION, contract, true);
    },
    withdraw(contract) {
        return new AllowedOperation(HINT.PAYMENT.WITHDRAW.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation(HINT.PAYMENT.REGISTER_MODEL.OPERATION, contract, true);
    },
};
const point = {
    registerModel(contract) {
        return new AllowedOperation(HINT.POINT.REGISTER_MODEL.OPERATION, contract, true);
    },
    mint(contract) {
        return new AllowedOperation(HINT.POINT.MINT.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation(HINT.POINT.TRANSFER.OPERATION, contract, true);
    },
    approve(contract) {
        return new AllowedOperation(HINT.POINT.APPROVE.OPERATION, contract, true);
    },
    burn(contract) {
        return new AllowedOperation(HINT.POINT.BURN.OPERATION, contract, true);
    },
    transferFrom(contract) {
        return new AllowedOperation(HINT.POINT.TRANSFER_FROM.OPERATION, contract, true);
    },
};
const storage = {
    registerModel(contract) {
        return new AllowedOperation(HINT.STORAGE.REGISTER_MODEL.OPERATION, contract, true);
    },
    createData(contract) {
        return new AllowedOperation(HINT.STORAGE.CREATE_DATA.OPERATION, contract, true);
    },
    deleteData(contract) {
        return new AllowedOperation(HINT.STORAGE.DELETE_DATA.OPERATION, contract, true);
    },
    updateData(contract) {
        return new AllowedOperation(HINT.STORAGE.UPDATE_DATA.OPERATION, contract, true);
    },
};
const timestamp = {
    registerModel(contract) {
        return new AllowedOperation(HINT.TIMESTAMP.REGISTER_MODEL.OPERATION, contract, true);
    },
    issue(contract) {
        return new AllowedOperation(HINT.TIMESTAMP.ISSUE.OPERATION, contract, true);
    },
};
const token = {
    registerModel(contract) {
        return new AllowedOperation(HINT.TOKEN.REGISTER_MODEL.OPERATION, contract, true);
    },
    mint(contract) {
        return new AllowedOperation(HINT.TOKEN.MINT.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation(HINT.TOKEN.TRANSFER.OPERATION, contract, true);
    },
    approve(contract) {
        return new AllowedOperation(HINT.TOKEN.APPROVE.OPERATION, contract, true);
    },
    burn(contract) {
        return new AllowedOperation(HINT.TOKEN.BURN.OPERATION, contract, true);
    },
    transferFrom(contract) {
        return new AllowedOperation(HINT.TOKEN.TRANSFER_FROM.OPERATION, contract, true);
    },
};
const did = {
    registerModel(contract) {
        return new AllowedOperation(HINT.DID.REGISTER_MODEL.OPERATION, contract, true);
    },
    create(contract) {
        return new AllowedOperation(HINT.DID.CREATE_DID.OPERATION, contract, true);
    },
    updateDocument(contract) {
        return new AllowedOperation(HINT.DID.UPDATE_DID_DOCUMENT.OPERATION, contract, true);
    },
};
const allowedOperation = {
    currency,
    account,
    contract,
    did,
    credential,
    dao,
    nft,
    payment,
    point,
    storage,
    timestamp,
    token,
};

class AccountAbstraction extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Creates a `UserOperation` for account abstraction.
     * @param {Fact | HintedFactObject} fact - The operation fact or fact property (json) of HintedObject of operation.
     * @param {string | Address} contract - The did contract address.
     * @param {string} authentication_id - The authentication ID for the did contract.
     * @returns {UserOperation<Fact>} The created `UserOperation` instance.
     */
    createUserOperation(fact, contract, authentication_id) {
        return new UserOperation(this.networkID, fact, new Authentication$1(contract, authentication_id, undefined), null, new Settlement(undefined));
    }
    /**
     * Adds an alternative signature to a user operation by filling the `proof_data`
     * field of the `authentication` object.
     *
     * This method accepts either a `UserOperation` instance or a JSON-formatted
     * hinted object. The operation is normalized internally and returned in
     * hinted-object (JSON) format after the signature is applied.
     *
     * @param {string | Key} privateKey - The private key used to generate the signature.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update.
     * @returns {Promise<HintedObject | OperationJson>} A hinted-object representation of the user operation
     * with the `authentication.proof_data` field populated.
     */
    async addAlterSign(privateKey, userOperation) {
        Assert.check(isUserOp(userOperation) || isHintedObjectFromUserOp(userOperation), MitumError.detail(ECODE.INVALID_USER_OPERATION, `Input must in UserOperation format`));
        const hintedUserOp = isUserOp(userOperation) ? userOperation.toHintedObject() : userOperation;
        privateKey = Key.from(privateKey);
        const keypair = KeyPair.fromPrivateKey(privateKey);
        const hashBytes = base58.decode(hintedUserOp.fact.hash);
        const alterSign = await keypair.sign(hashBytes);
        hintedUserOp.extension.authentication.proof_data = base58.encode(alterSign);
        return hintedUserOp;
    }
    /**
     * Updates the settlement details of a userOperation and returns a new hinted object of user operation.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update settlement.
     * @param {string | Address} opSender - The operation sender's address (Bundler's address).
     * @returns {HintedObject} A new hinted object representing the updated user operation.
     **/
    setSettlement(userOperation, opSender) {
        const hintedUserOp = this.getHintedUserOperation(userOperation);
        const { authentication, proxy_payer } = hintedUserOp.extension;
        return this.buildHintedObject(hintedUserOp, {
            authentication: this.createAuthentication(authentication),
            settlement: new Settlement(opSender).toHintedObject(),
            ...(proxy_payer && { proxy_payer: new ProxyPayer(proxy_payer.proxy_payer).toHintedObject() })
        });
    }
    /**
     * Updates the proxy payer details of a userOperation and returns a new hinted object of user operation.
     * @param {UserOperation<Fact> | HintedObject} userOperation - The user operation to update proxy payer.
     * @param {string | Address} proxyPayer - The proxy payer's address. (address of CA)
     * @returns {HintedObject} A new hinted object representing the updated user operation.
     **/
    setProxyPayer(userOperation, proxyPayer) {
        const hintedUserOp = this.getHintedUserOperation(userOperation);
        const { authentication, settlement } = hintedUserOp.extension;
        return this.buildHintedObject(hintedUserOp, {
            authentication: this.createAuthentication(authentication),
            proxy_payer: new ProxyPayer(proxyPayer).toHintedObject(),
            settlement: new Settlement(settlement.op_sender).toHintedObject(),
        });
    }
    /** Private method to validate and convert userOperation to HintedObject */
    getHintedUserOperation(userOperation) {
        Assert.check(isUserOp(userOperation) || isHintedObjectFromUserOp(userOperation), MitumError.detail(ECODE.INVALID_USER_OPERATION, `Input must be in UserOperation format`));
        return isUserOp(userOperation) ? userOperation.toHintedObject() : userOperation;
    }
    /** Private method to create an Authentication object */
    createAuthentication(authentication) {
        return new Authentication$1(authentication.contract, authentication.authentication_id, authentication.proof_data).toHintedObject();
    }
    /** Private method to build a HintedObject with the updated extension */
    buildHintedObject(hintedUserOp, extension) {
        return {
            _hint: hintedUserOp._hint,
            fact: hintedUserOp.fact,
            extension,
            hash: "",
            signs: []
        };
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @file The BrowserProvider class, which provides a standard interface for
 * interacting with browser-based wallets that follow the EIP-1193 standard.
 */
var _BrowserProvider_injectedProvider;
/**
 * @class BrowserProvider
 * @description A provider class for interacting with browser-based wallets
 * that inject a provider object (like window.imfact) into the window.
 * It wraps the injected provider to offer a consistent, high-level API familiar to web3 developers.
 */
class BrowserProvider {
    /**
     * Creates an instance of BrowserProvider.
     * @param {InjectedProvider} injectedProvider The provider object injected by the browser wallet (e.g., `window.imfact`).
     * @throws {Error} If the injectedProvider is invalid or does not have a 'request' method.
     */
    constructor(injectedProvider) {
        /**
         * The underlying provider injected by the wallet extension.
         * @private
         */
        _BrowserProvider_injectedProvider.set(this, void 0);
        if (!injectedProvider || typeof injectedProvider.request !== 'function') {
            throw new Error("Invalid injected provider. A provider object with a 'request' method is required.");
        }
        __classPrivateFieldSet(this, _BrowserProvider_injectedProvider, injectedProvider, "f");
    }
    /**
     * Sends a raw request to the injected wallet provider.
     * This is the core method used by all other convenience methods.
     * @template T The expected return type of the method.
     * @param {RequestArguments} args The request arguments, including method and parameters.
     * @returns {Promise<T>} A promise that resolves with the result of the call.
     */
    async request(args) {
        return __classPrivateFieldGet(this, _BrowserProvider_injectedProvider, "f").request(args);
    }
    /**
     * Subscribes to an event emitted by the wallet.
     * This passes the call directly to the injected provider's `on` method.
     * @param {string} eventName The name of the event to subscribe to (e.g., "accountsChanged").
     * @param {function} listener The function to execute when the event is emitted.
     */
    on(eventName, listener) {
        if (typeof __classPrivateFieldGet(this, _BrowserProvider_injectedProvider, "f").on === 'function') {
            __classPrivateFieldGet(this, _BrowserProvider_injectedProvider, "f").on(eventName, listener);
        }
        else {
            console.warn("The connected wallet provider does not support the 'on' method.");
        }
    }
    /**
     * Unsubscribes from an event.
     * This passes the call directly to the injected provider's `removeListener` method.
     * @param {string} eventName The name of the event to unsubscribe from.
     * @param {function} listener The original callback function used to subscribe.
     */
    removeListener(eventName, listener) {
        if (typeof __classPrivateFieldGet(this, _BrowserProvider_injectedProvider, "f").removeListener === 'function') {
            __classPrivateFieldGet(this, _BrowserProvider_injectedProvider, "f").removeListener(eventName, listener);
        }
        else {
            console.warn("The connected wallet provider does not support the 'removeListener' method.");
        }
    }
    // --- High-Level Convenience Methods (EIP-1193 Standard) ---
    /**
     * Requests that the user provides an account address to the dApp.
     * This will trigger a connection prompt from the wallet if the dApp is not already connected.
     * This is the standard method for connecting a dApp to a wallet.
     * @returns {Promise<string[]>} A promise that resolves to an array containing a single account address.
     */
    async requestAccounts() {
        return this.request({ method: 'imfact_requestAccounts' });
    }
    /**
     * Returns a list of addresses owned by client that the dApp is permitted to access.
     * Does not open any popups. Returns an empty array if no accounts are connected.

     * @returns {Promise<string[]>} A promise that resolves to an array of permitted account addresses.
     */
    async getAccounts() {
        return this.request({ method: 'imfact_accounts' });
    }
    /**
     * Requests the wallet to sign and broadcast a transaction to the ImFACT network.
     * This will trigger a signing confirmation prompt from the wallet.
     * @param {object} transactionObject A transaction object created by the ImFACT SDK.
     * @returns {Promise<string>} A promise that resolves to the transaction hash upon successful broadcast.
     * @throws {Error} If the transactionObject is null or undefined.
     */
    async sendTransaction(transactionObject) {
        if (!transactionObject) {
            throw new Error('A transaction object is required.');
        }
        return this.request({
            method: 'imfact_sendTransaction',
            params: [transactionObject],
        });
    }
    /**
     * Requests the wallet to sign a personal message with the selected account.
     * @param personalMsg - Message to sign (non-empty string).
     * @returns Promise resolving to the signed message and signer info.
     * @throws {Error} If the message is empty or signing fails/rejected.
     * @example
     * const { signedMsg, signer } = await provider.signMessage("Hello, ImFact!");
     */
    async signMessage(personalMsg) {
        if (!personalMsg) {
            throw new Error('A message to sign is required.');
        }
        return this.request({
            method: 'imfact_signMessage',
            params: [personalMsg],
        });
    }
    /**
     * Requests the chain ID of the network the wallet is currently connected to.
     * @returns {Promise<string>} A promise that resolves to the chain ID string.
     */
    async getChainId() {
        return this.request({ method: 'imfact_getChainId' });
    }
    /**
     * Requests the wallet to switch its active network.
     * This will trigger a network switch confirmation prompt from the wallet.
     * @param {string} chainId The chain ID string to switch to (e.g., 'mainnet').
     * @returns {Promise<null>} A promise that resolves to null if the switch was successful.
     */
    async switchChain(chainId) {
        if (!chainId) {
            throw new Error('A chainId is required.');
        }
        return this.request({
            method: 'imfact_switchChain',
            params: [{ chainId }],
        });
    }
}
_BrowserProvider_injectedProvider = new WeakMap();

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
        this._timestamp = new TimeStamp(this.networkID, this.api, this.delegateIP);
        // this._credential = new Credential(this.networkID, this.api, this.delegateIP)
        // this._sto = new STO(this.networkID, this.api, this.delegateIP)
        // this._kyc = new KYC(this.networkID, this.api, this.delegateIP)
        // this._point = new Point(this.networkID, this.api, this.delegateIP)
        this._dao = new DAO(this.networkID, this.api, this.delegateIP);
        this._token = new Token(this.networkID, this.api, this.delegateIP);
        this._storage = new Storage(this.networkID, this.api, this.delegateIP);
        this._payment = new Payment(this.networkID, this.api, this.delegateIP);
        this._did = new Did(this.networkID, this.api, this.delegateIP);
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
        this._nft = new NFT(this.networkID, this.api, this.delegateIP);
        this._timestamp = new TimeStamp(this.networkID, this.api, this.delegateIP);
        // this._credential = new Credential(this.networkID, this.api, this.delegateIP)
        // this._sto = new STO(this.networkID, this.api, this.delegateIP)
        // this._kyc = new KYC(this.networkID, this.api, this.delegateIP)
        // this._point = new Point(this.networkID, this.api, this.delegateIP)
        this._dao = new DAO(this.networkID, this.api, this.delegateIP);
        this._token = new Token(this.networkID, this.api, this.delegateIP);
        this._storage = new Storage(this.networkID, this.api, this.delegateIP);
        this._payment = new Payment(this.networkID, this.api, this.delegateIP);
        this._did = new Did(this.networkID, this.api, this.delegateIP);
        this._aa = undefined;
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
    get nft() {
        return this._nft;
    }
    get timestamp() {
        return this._timestamp;
    }
    // get credential(): Credential {
    //     return this._credential
    // }
    // get sto(): STO {
    //     return this._sto
    // }
    // get kyc(): KYC {
    //     return this._kyc
    // }
    get dao() {
        return this._dao;
    }
    get token() {
        return this._token;
    }
    // get point(): Point {
    //     return this._point
    // }
    get storage() {
        return this._storage;
    }
    get payment() {
        return this._payment;
    }
    get did() {
        return this._did;
    }
    get utils() {
        return this._utils;
    }
    /**
     * Account-abstraction generator. Builds and signs UserOperations.
     *
     * Lazily instantiated: callers that never touch `aa` (e.g. wallets that only
     * use currency/did/nft) never construct an {@link AccountAbstraction}, so it
     * costs nothing at runtime for them.
     */
    get aa() {
        return (this._aa ?? (this._aa = new AccountAbstraction(this.networkID, this.api, this.delegateIP)));
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
Mitum.allowedOperation = allowedOperation;

export { AccountAbstraction, Authentication$1 as Authentication, BrowserProvider, Mitum, ProxyPayer, Settlement, UserOperation, isHintedObject, isHintedObjectFromUserOp, isOpFact };
//# sourceMappingURL=bundle.esm.mjs.map
