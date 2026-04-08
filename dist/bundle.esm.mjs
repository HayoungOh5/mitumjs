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
    // Related to signature
    IV_SIGN: {
        code: "D201",
        keyword: ["Invalid signing", "BaseNodeSign"],
        description: "The private key does not match the address or node sign required or the signatures for the multiSig account do not meet the threshold",
        subject: ""
    },
    IV_ALTERSIGN: {
        code: "D202",
        keyword: ["Invalid user signing"],
        description: "Alternative signature for account abstraction operation is not valid",
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
    IV_AUTH_TYPE: {
        code: "D303",
        keyword: ["Invalid Auth Type"],
        description: "Occurs when there is a problem with authentication_id in the account abstraction operation.(If verificationMethod of linked authentication is another linked authentication)",
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

const encoder$c = new TextEncoder();
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
        return encoder$c.encode(this.s);
    }
    toString() {
        return this.s;
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
    DMILE: {
        MERKLE_ROOT: getRangeConfig(64, 64),
    },
    DID: {
        PUBLIC_KEY: getRangeConfig(128, Number.MAX_SAFE_INTEGER),
    }
};

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

var DAO = {
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

var NFT = {
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

var HINT = {
    FACT_SIGN: "base-fact-sign",
    CURRENCY,
    DID,
    CREDENTIAL,
    DAO,
    NFT,
    PAYMENT,
    POINT,
    STORAGE,
    TIMESTAMP,
    TOKEN
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
        this.s = Hint.hasVersion(s) ? s : `${s}-${Version.get()}`;
    }
    toString() {
        return this.s;
    }
    static hasVersion(s) {
        const suffix = `-${Version.get()}`;
        return s.endsWith(suffix);
    }
    static fromString(s) {
        if (!Hint.hasVersion(s)) {
            throw new Error(`Invalid hinted string (missing version): ${s}`);
        }
        const h = Object.create(Hint.prototype);
        h.s = s;
        return h;
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

const encoder$b = new TextEncoder();
class Token {
    constructor(s) {
        Assert.check(s !== "", MitumError.detail(ECODE.INVALID_TOKEN, "empty token"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Token ? s : new Token(s);
    }
    toBytes() {
        return encoder$b.encode(this.s);
    }
    toString() {
        return bytesToBase64(this.toBytes());
    }
}

const encoder$a = new TextEncoder();
class ID {
    constructor(s) {
        this.s = s;
    }
    equal(id) {
        return this.toString() === id.toString();
    }
    toBytes() {
        return encoder$a.encode(this.s);
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

const encoder$9 = new TextEncoder();
function toBytes(msg) {
    return typeof msg === "string" ? encoder$9.encode(msg) : msg;
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
    const hashBytes = keccak256(encoder$9.encode(hexLower));
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

const encoder$8 = new TextEncoder();
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
        return encoder$8.encode(this.s);
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

const encoder$7 = new TextEncoder();
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
        return encoder$7.encode(this.toString());
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
        const hash = keccak256(encoder$7.encode(hex));
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

const defaultPath = "m/44'/1'/0'/0/0";

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

const encoder$6 = new TextEncoder();
let Operation$1 = class Operation {
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
        const now = TimeStamp.new();
        if (sigType === "NodeFactSign" || (!sigType && node)) {
            Assert.check(node !== undefined, MitumError.detail(ECODE.FAIL_SIGN, "no node address"));
            const sig = await keypair.sign(concatBytes([encoder$6.encode(this.id), node.toBytes(), this.fact.hash, now.toBytes()]));
            return new NodeFactSign(node.toString(), keypair.publicKey, sig, now.toString());
        }
        const sig = await keypair.sign(concatBytes([encoder$6.encode(this.id), this.fact.hash, now.toBytes()]));
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
};

class Fact {
    constructor(hint, token) {
        this.hint = new Hint(hint);
        this.token = new Token(token);
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

const encoder$5 = new TextEncoder();
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
class UserOperation extends Operation$1 {
    constructor(networkID, fact, auth, proxyPayer, settlement) {
        super(networkID, (!isFactJson(fact) ? fact : UserOperation.restoreFactFromJson(fact)));
        this.id = networkID;
        this.fact = (!isFactJson(fact) ? fact : UserOperation.restoreFactFromJson(fact));
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
            encoder$5.encode(JSON.stringify(this.toHintedExtension())),
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
        const now = TimeStamp.new();
        const factSign = new GeneralFactSign(keypair.publicKey, await keypair.sign(concatBytes([encoder$5.encode(this.id), this.fact.hash, now.toBytes()])), now.toString());
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

// import { Address } from "../../key"
class ContractGenerator extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
}

const encoder$4 = new TextEncoder();
let AllowedOperation$1 = class AllowedOperation {
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
            return encoder$4.encode(this.operationHint.toString());
        }
        return concatBytes([
            this.contract.toBytes(),
            encoder$4.encode(this.operationHint.toString())
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
};

const isOpFact = (operation) => {
    return operation instanceof Operation$1;
};
const isHintedObject = (object) => {
    return '_hint' in object && 'fact' in object && 'hash' in object;
};
const isUserOp = (userOperation) => {
    return userOperation instanceof UserOperation;
};
const isHintedObjectFromUserOp = (object) => {
    if ('_hint' in object &&
        'fact' in object &&
        'hash' in object &&
        'extension' in object) {
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
const isFactJson = (obj) => {
    return (typeof obj === "object" &&
        obj !== null &&
        "_hint" in obj &&
        "token" in obj &&
        "hash" in obj);
};

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
var account$1 = {
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
async function getMultiOperations(api, hashes, delegateIP) {
    const apiPath = `${api}/block/operations/facts?hashes=${hashes.join(",")}`;
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
var currency$2 = {
    getCurrencies,
    getCurrency,
};

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
    currency: currency$2,
    contract: {
        did: did$1
    },
};

const currency$1 = models.currency;
const contractApi = models.contract;
var api = {
    account: account$1,
    block,
    node,
    operation: api$1,
    currency: currency$1,
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
            throw MitumError.detail(ECODE.UNKNOWN, `Unknown error orccur!\n${error}`);
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

class MintFact extends NodeFact {
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
}

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
        return new Operation$1(this.networkID, new UpdateCurrencyFact(TimeStamp.new().UTC(), currency, this.buildPolicy(data.feeType, data.minBalance, data.feeReceiver, data.fee, data.item_fee)));
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
        ArrayAssert.check(receivers, "receivers").rangeLength(Config.ITEMS_IN_FACT).noDuplicates().sameLength(amounts, "amounts");
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
        return new Operation$1(this.networkID, new WithdrawFact(TimeStamp.new().UTC(), sender, items));
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
        return new Operation$1(this.networkID, new MintFact(TimeStamp.new().UTC(), receiver, new Amount(currency, amount)));
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
            operation: new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, [
                new CreateContractAccountItem(ks, [new Amount(currency, amount)])
            ])),
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
            operation: new Operation$1(this.networkID, new CreateContractAccountFact(TimeStamp.new().UTC(), sender, items)),
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
     * Generate an `update-recipient` operation to update recipients of contract to given accounts.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | Address} [contract] - The contract account address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @param {(string | Address)[]} [recipients] - The array of addresses to be updated as recipients.
     * @returns `update-recipient` operation.
     */
    updateRecipient(sender, contract, currency, recipients) {
        return new Operation$1(this.networkID, new UpdateRecipientFact(TimeStamp.new().UTC(), sender, contract, currency, recipients));
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
const currency = {
    transfer() {
        return new AllowedOperation$1(HINT.CURRENCY.TRANSFER.OPERATION);
    },
};
const account = {
    create() {
        return new AllowedOperation$1(HINT.CURRENCY.CREATE_ACCOUNT.OPERATION);
    },
    updateKey() {
        return new AllowedOperation$1(HINT.CURRENCY.UPDATE_HANDLER.OPERATION);
    },
};
const contract = {
    create() {
        return new AllowedOperation$1(HINT.CURRENCY.CREATE_CONTRACT_ACCOUNT.OPERATION);
    },
    withdraw() {
        return new AllowedOperation$1(HINT.CURRENCY.WITHDRAW.OPERATION);
    },
    updateRecipient() {
        return new AllowedOperation$1(HINT.CURRENCY.UPDATE_RECIPIENT.OPERATION);
    },
    updateHandler() {
        return new AllowedOperation$1(HINT.CURRENCY.UPDATE_HANDLER.OPERATION);
    },
};

class AccountAbstraction extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    /**
     * Creates a `UserOperation` for account abstraction.
     * @param {Fact | FactJson} fact - The operation fact or fact property (json) of HintedObject of operation.
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
const encoder$3 = new TextEncoder();
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
            encoder$3.encode(this.type),
            this.controller.toBytes(),
            ...(this.publicKeyMultibase
                ? [encoder$3.encode(this.publicKeyMultibase)]
                : []),
            encoder$3.encode(this.publicKey.toString()),
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
            if (el instanceof AllowedOperation$1) {
                return el;
            }
            try {
                return new AllowedOperation$1(el.operation, el.contract);
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
            encoder$3.encode(this.type),
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
        return new Operation$1(this.networkID, new RegisterModelFact(TimeStamp.new().UTC(), sender, contract, didMethod, currency));
    }
    /**
     * Generate `create-did` operation to create new did and did document.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-did` operation
     */
    create(contract, sender, currency) {
        const fact = new CreateFact(TimeStamp.new().UTC(), sender, contract, currency);
        return new Operation$1(this.networkID, fact);
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
     * @returns An `Operation` instance that can be signed and submitted to the network.
     */
    updateDocument(contract, sender, document, currency) {
        const normalized = this.normalizeDocument(document, sender);
        const fact = new UpdateDocumentFact(TimeStamp.new().UTC(), sender, contract, normalized.id.toString(), normalized, currency);
        return new Operation$1(this.networkID, fact);
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
     * @returns An `Operation` instance ready to be signed and submitted.
     */
    updateDocumentByDocumentJson(contract, sender, documentJson, currency) {
        const normalized = this.normalizeDocument(documentJson, sender);
        const fact = new UpdateDocumentFact(TimeStamp.new().UTC(), sender, contract, normalized.id.toString(), normalized, currency);
        return new Operation$1(this.networkID, fact);
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
const did = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.DID.REGISTER_MODEL.OPERATION, contract, true);
    },
    create(contract) {
        return new AllowedOperation$1(HINT.DID.CREATE_DID.OPERATION, contract, true);
    },
    updateDocument(contract) {
        return new AllowedOperation$1(HINT.DID.UPDATE_DID_DOCUMENT.OPERATION, contract, true);
    },
};

const encoder$2 = new TextEncoder();
const MESSAGE_PREFIX = "\x19ImFACT Signed Message:\n";
function encodePersonalMessage(message) {
    const msg = encoder$2.encode(message);
    const prefix = encoder$2.encode(MESSAGE_PREFIX + msg.length.toString());
    return concatBytes([prefix, msg]);
}

const encoder$1 = new TextEncoder();
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
     * @param {Operation<Fact> | OperationJson | string} operation - The operation to sign.
     *        Accepts:
     *          - Operation instance
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
        const now = TimeStamp.new();
        const hash = operation.fact.hash;
        Assert.check(typeof hash === "string" && hash.length > 0, MitumError.detail(ECODE.INVALID_OPERATION, "empty fact hash"));
        const msgToSign = concatBytes([
            encoder$1.encode(this.networkID),
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
            encoder$1.encode(s.signer),
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
        const now = TimeStamp.new();
        const msgToSign = concatBytes([
            encoder$1.encode(this.networkID),
            nd.toBytes(),
            base58.decode(operation.fact.hash),
            now.toBytes(),
        ]);
        const fs = new NodeFactSign(node, keypair.publicKey.toString(), await keypair.sign(msgToSign), now.toString()).toHintedObject();
        operation.signs = operation.signs ? [...operation.signs, fs] : [fs];
        const factSigns = operation.signs
            .map((s) => concatBytes([
            encoder$1.encode(s.signer),
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
            encoder$1.encode(JSON.stringify(hintedExtension)),
            base58.decode(userOperation.fact.hash),
            concatBytes(userOperation.signs.map((s) => concatBytes([
                encoder$1.encode(s.signer),
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

const encoder = new TextEncoder();
class Operation extends Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    hasAuthenticationExtension(op) {
        return (op &&
            typeof op === "object" &&
            "extension" in op &&
            op.extension &&
            "authentication" in op.extension &&
            op.extension.authentication &&
            "proof_data" in op.extension.authentication);
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
            Assert.check(isBase58Encoded(hash) && (hash.length === 44 || hash.length === 43), MitumError.detail(ECODE.INVALID_FACT_HASH, "fact hash must be base58 encoded string with 43 or 44 length."));
        });
        const response = await getAPIData(() => api$1.getMultiOperations(this.api, hashes, this.delegateIP));
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
        Assert.check(this.api != null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        if (operation && typeof operation.then === "function") {
            throw MitumError.detail(ECODE.INVALID_OPERATION, "Invalid operation: received a Promise instead of a signed operation. Did you forget to 'await' a signing function?");
        }
        const isFactOp = isOpFact(operation);
        const isHintedOp = isHintedObject(operation);
        Assert.check(isFactOp || isHintedOp, MitumError.detail(ECODE.INVALID_OPERATION, "input is neither in OP<Fact> nor HintedObject format"));
        const opJson = isFactOp
            ? operation.toHintedObject()
            : operation;
        Assert.check(opJson.signs?.length > 0, MitumError.detail(ECODE.EMPTY_SIGN, "signature is required before sending the operation"));
        const json = JSON.stringify(opJson);
        const byteLength = encoder.encode(json).length;
        Assert.check(Config.OP_SIZE.satisfy(byteLength), MitumError.detail(ECODE.OP_SIZE_EXCEEDED, `Operation size exceeds the allowed limit of ${Config.OP_SIZE.max} bytes.`));
        if (this.hasAuthenticationExtension(opJson) && opJson.extension.authentication.proof_data === "") {
            throw MitumError.detail(ECODE.INVALID_USER_OPERATION, "Missing proof_data. Did you forget to await addAlterSign()?");
        }
        const sendResponse = await getAPIData(() => api$1.send(this.api, opJson, this.delegateIP, headers));
        return new OperationResponse(sendResponse, this.networkID, this.api, this.delegateIP);
    }
    /**
     * Estimate the expected transaction fee based on the currency policy.
     *
     * This function fetches the currency policy from the blockchain and calculates
     * the fee according to its configured fee model.
     *
     * Supported fee types:
     * - NIL: always returns 0
     * - FIXED: returns a constant fee
     * - FIXED_ITEM:
     *   - If no items → treated as 1 item → fee = baseFee + itemFee
     *   - If items exist → fee = baseFee + (itemFee × item count)
     *
     * @param {HintedObject | BaseOperation<Fact>} operation - The operation to estimate fee for.
     * @param {string | CurrencyID} currencyID - The currency identifier.
     * @returns {Promise<number>} Estimated fee amount. (in smallest unit of the currency)
     */
    async estimateFee(operation, currencyID) {
        CurrencyID.from(currencyID);
        Assert.check(this.api != null, MitumError.detail(ECODE.NO_API, "API is not provided"));
        Assert.check(isOpFact(operation) || isHintedObject(operation), MitumError.detail(ECODE.INVALID_OPERATION, `input is neither in OP<Fact> nor HintedObject format`));
        try {
            const res = await getAPIData(() => currency$1.getCurrency(this.api, currencyID, this.delegateIP));
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
                return 0;
            }
            if (hint.includes(HINT.CURRENCY.FEEER.FIXED)) {
                return Number(feeer.amount);
            }
            if (hint.includes(HINT.CURRENCY.FEEER.FIXED_ITEM)) {
                const opJson = isOpFact(operation)
                    ? operation.toHintedObject()
                    : operation;
                const itemCount = "items" in opJson.fact && Array.isArray(opJson.fact.items)
                    ? opJson.fact.items.length
                    : 1; // Default to 1 if items are not present or not an array
                return Number(feeer.amount) + Number(feeer.item_fee_amount) * itemCount;
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
const credential = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.CREDENTIAL.REGISTER_MODEL.OPERATION, contract, true);
    },
    addTemplate(contract) {
        return new AllowedOperation$1(HINT.CREDENTIAL.ADD_TEMPLATE.OPERATION, contract, true);
    },
    issue(contract) {
        return new AllowedOperation$1(HINT.CREDENTIAL.ISSUE.OPERATION, contract, true);
    },
    revoke(contract) {
        return new AllowedOperation$1(HINT.CREDENTIAL.REVOKE.OPERATION, contract, true);
    },
};
const dao = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.DAO.REGISTER_MODEL.OPERATION, contract, true);
    },
    updateModelConfig(contract) {
        return new AllowedOperation$1(HINT.DAO.UPDATE_MODEL_CONFIG.OPERATION, contract, true);
    },
    propose(contract) {
        return new AllowedOperation$1(HINT.DAO.PROPOSE.OPERATION, contract, true);
    },
    cancelProposal(contract) {
        return new AllowedOperation$1(HINT.DAO.CANCEL_PROPOSAL.OPERATION, contract, true);
    },
    register(contract) {
        return new AllowedOperation$1(HINT.DAO.REGISTER.OPERATION, contract, true);
    },
    preSnap(contract) {
        return new AllowedOperation$1(HINT.DAO.PRE_SNAP.OPERATION, contract, true);
    },
    postSnap(contract) {
        return new AllowedOperation$1(HINT.DAO.POST_SNAP.OPERATION, contract, true);
    },
    vote(contract) {
        return new AllowedOperation$1(HINT.DAO.VOTE.OPERATION, contract, true);
    },
    execute(contract) {
        return new AllowedOperation$1(HINT.DAO.EXECUTE.OPERATION, contract, true);
    },
};
const nft = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.NFT.REGISTER_MODEL.OPERATION, contract, true);
    },
    updateModelConfig(contract) {
        return new AllowedOperation$1(HINT.NFT.UPDATE_MODEL_CONFIG.OPERATION, contract, true);
    },
    mint(contract) {
        return new AllowedOperation$1(HINT.NFT.MINT.OPERATION, contract, true);
    },
    approveAll(contract) {
        return new AllowedOperation$1(HINT.NFT.APPROVE_ALL.OPERATION, contract, true);
    },
    approve(contract) {
        return new AllowedOperation$1(HINT.NFT.APPROVE.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation$1(HINT.NFT.TRANSFER.OPERATION, contract, true);
    },
    addSignature(contract) {
        return new AllowedOperation$1(HINT.NFT.ADD_SIGNATURE.OPERATION, contract, true);
    },
};
const payment = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.PAYMENT.REGISTER_MODEL.OPERATION, contract, true);
    },
    deposit(contract) {
        return new AllowedOperation$1(HINT.PAYMENT.DEPOSIT.OPERATION, contract, true);
    },
    updateAccountSetting(contract) {
        return new AllowedOperation$1(HINT.PAYMENT.UPDATE_ACCOUNT_SETTING.OPERATION, contract, true);
    },
    withdraw(contract) {
        return new AllowedOperation$1(HINT.PAYMENT.WITHDRAW.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation$1(HINT.PAYMENT.REGISTER_MODEL.OPERATION, contract, true);
    },
};
const point = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.POINT.REGISTER_MODEL.OPERATION, contract, true);
    },
    mint(contract) {
        return new AllowedOperation$1(HINT.POINT.MINT.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation$1(HINT.POINT.TRANSFER.OPERATION, contract, true);
    },
    approve(contract) {
        return new AllowedOperation$1(HINT.POINT.APPROVE.OPERATION, contract, true);
    },
    burn(contract) {
        return new AllowedOperation$1(HINT.POINT.BURN.OPERATION, contract, true);
    },
    transferFrom(contract) {
        return new AllowedOperation$1(HINT.POINT.TRANSFER_FROM.OPERATION, contract, true);
    },
};
const storage = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.STORAGE.REGISTER_MODEL.OPERATION, contract, true);
    },
    createData(contract) {
        return new AllowedOperation$1(HINT.STORAGE.CREATE_DATA.OPERATION, contract, true);
    },
    deleteData(contract) {
        return new AllowedOperation$1(HINT.STORAGE.DELETE_DATA.OPERATION, contract, true);
    },
    updateData(contract) {
        return new AllowedOperation$1(HINT.STORAGE.UPDATE_DATA.OPERATION, contract, true);
    },
};
const timestamp = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.TIMESTAMP.REGISTER_MODEL.OPERATION, contract, true);
    },
    issue(contract) {
        return new AllowedOperation$1(HINT.TIMESTAMP.ISSUE.OPERATION, contract, true);
    },
};
const token = {
    registerModel(contract) {
        return new AllowedOperation$1(HINT.TOKEN.REGISTER_MODEL.OPERATION, contract, true);
    },
    mint(contract) {
        return new AllowedOperation$1(HINT.TOKEN.MINT.OPERATION, contract, true);
    },
    transfer(contract) {
        return new AllowedOperation$1(HINT.TOKEN.TRANSFER.OPERATION, contract, true);
    },
    approve(contract) {
        return new AllowedOperation$1(HINT.TOKEN.APPROVE.OPERATION, contract, true);
    },
    burn(contract) {
        return new AllowedOperation$1(HINT.TOKEN.BURN.OPERATION, contract, true);
    },
    transferFrom(contract) {
        return new AllowedOperation$1(HINT.TOKEN.TRANSFER_FROM.OPERATION, contract, true);
    },
};

const AllowedOperation = {
    currency,
    account,
    contract,
    did,
    credential, dao, nft, payment,
    point, storage, timestamp, token
};
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
        this._did = new Did(this.networkID, this.api, this.delegateIP);
        this._accountAbstraction = new AccountAbstraction(this.networkID, this.api, this.delegateIP);
        this._utils = new Utils();
    }
    refresh() {
        this._node = new Node(this.api, this.delegateIP);
        this._account = new Account(this.networkID, this.api, this.delegateIP);
        this._currency = new Currency(this.networkID, this.api, this.delegateIP);
        this._block = new Block(this.api, this.delegateIP);
        this._operation = new Operation(this.networkID, this.api, this.delegateIP);
        this._contract = new Contract(this.networkID, this.api, this.delegateIP);
        this._did = new Did(this.networkID, this.api, this.delegateIP);
        this._accountAbstraction = new AccountAbstraction(this.networkID, this.api, this.delegateIP);
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
    get did() {
        return this._did;
    }
    get aa() {
        return this._accountAbstraction;
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
Mitum.allowedOperation = AllowedOperation;
Mitum.ECODE = ECODE;
Mitum.PCODE = PCODE;
Mitum.DCODE = DCODE;

export { Mitum, Mitum as default };
//# sourceMappingURL=bundle.esm.mjs.map
