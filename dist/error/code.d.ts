import { error_code } from '../types';
export type ErrorCode = (typeof ECODE[keyof typeof ECODE] | typeof ECODE.CURRENCY[keyof typeof ECODE.CURRENCY] | typeof ECODE.NFT[keyof typeof ECODE.NFT] | typeof ECODE.STO[keyof typeof ECODE.STO] | typeof ECODE.DAO[keyof typeof ECODE.DAO]);
export declare const ECODE: {
    readonly NO_API: "EC_NO_API";
    readonly UNKNOWN: "EC_UNKNOWN";
    readonly EMPTY_STRING: "EC_EMPTY_STRING";
    readonly EMPTY_SIGN: "EC_EMPTY_SIGN";
    readonly INVALID_DATE: "EC_INVALID_DATE";
    readonly INVALID_IP: "EC_INVALID_IP";
    readonly INVALID_LENGTH: "EC_INVALID_LENGTH";
    readonly INVALID_SEED: "EC_INVALID_SEED";
    readonly INVALID_KEY: "EC_INVALID_KEY";
    readonly INVALID_KEYS: "EC_INVALID_KEYS";
    readonly INVALID_KEY_PAIR: "EC_INVALID_KEY_PAIR";
    readonly INVALID_PRIVATE_KEY: "EC_INVALID_PRIVATE_KEY";
    readonly INVALID_PUBLIC_KEY: "EC_INVALID_PUBLIC_KEY";
    readonly INVALID_WEIGHT: "EC_INVALID_WEIGHT";
    readonly INVALID_THRESHOLD: "EC_INVALID_THRESHOLD";
    readonly INVALID_ADDRESS: "EC_INVALID_ADDRESS";
    readonly INVALID_ADDRESS_TYPE: "EC_INVALID_ADDRESS_TYPE";
    readonly INVALID_ADDRESS_CHECKSUM: "EC_INVALID_ADDRESS_CHECKSUM";
    readonly INVALID_BIG_INTEGER: "EC_INVALID_BIG_INTERGER";
    readonly INVALID_FLOAT: "EC_INVALID_FLOAT";
    readonly INVALID_UINT8: "EC_INVALID_UINT8";
    readonly INVALID_HINT: "EC_INVALID_HINT";
    readonly INVALID_TOKEN: "EC_INVALID_TOKEN";
    readonly INVALID_CURRENCY_ID: "EC_INVALID_CURRENCY_ID";
    readonly INVALID_CONTRACT_ID: "EC_INVALID_CONTRACT_ID";
    readonly INVALID_NETWORK_ID: "EC_INVALID_NETWORK_ID";
    readonly INVALID_VERSION: "EC_INVALID_VERSION";
    readonly INVALID_ITEM: "EC_INVALID_ITEM";
    readonly INVALID_ITEMS: "EC_INVALID_ITEMS";
    readonly INVALID_FACTSIGN: "EC_INVALID_FACTSIGN";
    readonly INVALID_FACTSIGNS: "EC_INVALID_FACTSIGNS";
    readonly INVALID_SIG_TYPE: "EC_INVALID_SIG_TYPE";
    readonly INVALID_FACT: "EC_INVALID_FACT";
    readonly INVALID_OPERATION: "EC_INVALID_OPERATION";
    readonly INVALID_OPERATIONS: "EC_INVALID_OPERATIONS";
    readonly INVALID_SEAL: "EC_INVALID_SEAL";
    readonly INVALID_AMOUNT: "EC_INVALID_AMOUNT";
    readonly INVALID_AMOUNTS: "EC_INVALID_AMOUNTS";
    readonly INVALID_RATIO: "EC_INVALID_RATIO";
    readonly INVALID_DATA_STRUCTURE: "EC_INVALID_DATA_STRUCTURE";
    readonly INVALID_CHARACTER: "EC_NVALID_CHARACTER";
    readonly NOT_IMPLEMENTED_BUFFER: "EC_NOT_IMPLEMENTED_BUFFER";
    readonly NOT_IMPLEMENTED_HINTED_OBJECT: "EC_NOT_IMPLEMENTED_HINTED_OBJECT";
    readonly NOT_IMPLEMENTED_METHOD: "EC_NOT_IMPLEMENTED_METHOD";
    readonly FAIL_FILE_CREATION: "EC_FAIL_FILE_CREATION";
    readonly FAIL_SIGN: "EC_FAIL_SIGN";
    readonly CURRENCY: {
        readonly INVALID_CURRENCY_FEEER: "EC_INVALID_CURRENCY_FEEER";
        readonly INVALID_CURRENCY_POLICY: "EC_INVALID_CURRENCY_POLICY";
        readonly INVALID_CURRENCY_DESIGN: "EC_INVALID_CURRENCY_DESIGN";
    };
    readonly NFT: {
        readonly INVALID_NFT_SIGNER: "EC_INVALID_NFT_SIGNER";
        readonly INVALID_NFT_SIGNERS: "EC_INVALID_NFT_SIGNERS";
    };
    readonly STO: {
        readonly INVALID_PARTITION: "EC_INVALID_PARTITION";
    };
    readonly DAO: {
        readonly INVALID_WHITELIST: "EC_INVALID_WHITELIST";
        readonly UNMATCHED_SENDER: "EC_UNMATCHED_SENDER";
    };
    readonly TIME_OUT: "EC_TIME_OUT";
    readonly TRANSACTION_REVERTED: "EC_TRANSACTION_REVERTED";
};
export declare const PCODE: {
    readonly AMBIGUOUS: {
        readonly code: "P0A";
        readonly keyword: readonly [""];
        readonly description: "AMBIGUOUS";
        readonly subject: "";
    };
    readonly MITUM_CORE: {
        readonly code: "P0M";
        readonly keyword: readonly [""];
        readonly description: "MITUM CORE";
        readonly subject: "";
    };
    readonly UNDEFINED: {
        readonly code: "P00";
        readonly keyword: readonly [""];
        readonly description: "UNDEFINED";
        readonly subject: "";
    };
    readonly IV_BASE_OP: {
        readonly code: "P01";
        readonly keyword: readonly ["Invalid BaseOperation"];
        readonly description: "Error from IsValid(BaseOperation)";
        readonly subject: "";
    };
    readonly IV_BASE_NODE_OP: {
        readonly code: "P02";
        readonly keyword: readonly ["Invalid BaseNodeOperation"];
        readonly description: "Error from IsValid(BaseNodeOperation)";
        readonly subject: "";
    };
    readonly IV_BASE_STATE: {
        readonly code: "P03";
        readonly keyword: readonly ["Invalid BaseState"];
        readonly description: "Error from IsValid(BaseState)";
        readonly subject: "";
    };
    readonly IV_FACT: {
        readonly code: "P04";
        readonly keyword: readonly ["Invalid fact"];
        readonly description: "Error from IsValid(Fact)";
        readonly subject: "";
    };
    readonly IV_ITEM: {
        readonly code: "P05";
        readonly keyword: readonly ["Invalid item"];
        readonly description: "Error from IsValid(Item)";
        readonly subject: "";
    };
    readonly PREPROCESS: {
        readonly code: "P06";
        readonly keyword: readonly ["PreProcess"];
        readonly description: "Error from PreProcess";
        readonly subject: "";
    };
    readonly DECODE_JSON: {
        readonly code: "P07";
        readonly keyword: readonly ["Decode Json"];
        readonly description: "Error from DecodeJSON";
        readonly subject: "";
    };
    readonly DECODE_BSON: {
        readonly code: "P08";
        readonly keyword: readonly ["Decode Bson"];
        readonly description: "Error from DecodeBSON";
        readonly subject: "";
    };
};
export declare const DCODE: {
    readonly AMBIGUOUS: {
        readonly code: "D00A";
        readonly keyword: readonly [""];
        readonly description: "AMBIGUOUS";
        readonly subject: "";
    };
    readonly COMPLEX: {
        readonly code: "D00C";
        readonly keyword: readonly [""];
        readonly description: "COMPLEX";
        readonly subject: "";
    };
    readonly OP_DEP: {
        readonly code: "D00D";
        readonly keyword: readonly [""];
        readonly description: "Operation dependent";
        readonly subject: "";
    };
    readonly UNDEFINED: {
        readonly code: "D000";
        readonly keyword: readonly [""];
        readonly description: "UNDEFINED";
        readonly subject: "";
    };
    readonly EMPTY: {
        readonly code: "D101";
        readonly keyword: readonly ["Operation has empty token"];
        readonly description: "EMPTY or NULL data";
        readonly subject: "";
    };
    readonly IV_LENGTH: {
        readonly code: "D102";
        readonly keyword: readonly ["Array length"];
        readonly description: "length of array";
        readonly subject: "";
    };
    readonly IV_RANGE: {
        readonly code: "D103";
        readonly keyword: readonly ["Value out of range", "Operation token size too large"];
        readonly description: "Out of range";
        readonly subject: "";
    };
    readonly IV_TYPE: {
        readonly code: "D104";
        readonly keyword: readonly ["Type mismatch", "Invalid account type", "Invalid value"];
        readonly description: "Invalid type";
        readonly subject: "";
    };
    readonly DUPLICATED_VAL: {
        readonly code: "D105";
        readonly keyword: readonly ["Duplicated value"];
        readonly description: "Duplicated value";
        readonly subject: "";
    };
    readonly D106: {
        readonly code: "D106";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly IV_CHAR: {
        readonly code: "D107";
        readonly keyword: readonly [""];
        readonly description: "Special characters";
        readonly subject: "";
    };
    readonly DECODE_FACT: {
        readonly code: "D108";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly DECODE_ITEM: {
        readonly code: "D109";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly DECODE_OP: {
        readonly code: "D110";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly UNMARSHAL_ITEM: {
        readonly code: "D111";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly UNMARSHAL_FACT: {
        readonly code: "D112";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly SELF_TARGETED: {
        readonly code: "D113";
        readonly keyword: readonly ["Self targeted"];
        readonly description: "";
        readonly subject: "";
    };
    readonly D114: {
        readonly code: "D114";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly D115: {
        readonly code: "D115";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly D116: {
        readonly code: "D116";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly D117: {
        readonly code: "D117";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly IV_SIGN: {
        readonly code: "D201";
        readonly keyword: readonly ["Invalid signing"];
        readonly description: "";
        readonly subject: "";
    };
    readonly D202: {
        readonly code: "D202";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly LACK_OF_SIGN: {
        readonly code: "D203";
        readonly keyword: readonly ["Not enough signs"];
        readonly description: "";
        readonly subject: "";
    };
    readonly D204: {
        readonly code: "D204";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly UNAUTHORIZED_AC: {
        readonly code: "D301";
        readonly keyword: readonly ["Account not authorized"];
        readonly description: "sender is not owner neither operator of the contract";
        readonly subject: "";
    };
    readonly NOT_IN_WHITELIST: {
        readonly code: "D302";
        readonly keyword: readonly [""];
        readonly description: "account not in the whitelist";
        readonly subject: "";
    };
    readonly D401: {
        readonly code: "D401";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly STATE_NOT_FOUND: {
        readonly code: "D501";
        readonly keyword: readonly ["Account not found", "Currency not found", "Contract account not found", "Service not found"];
        readonly description: "";
        readonly subject: "";
    };
    readonly D502: {
        readonly code: "D502";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly STATE_EXIST: {
        readonly code: "D503";
        readonly keyword: readonly ["Account exist", "Contract account exist", "Currency exist", "State exist"];
        readonly description: "";
        readonly subject: "";
    };
    readonly D504: {
        readonly code: "D504";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly IV_STATE_VAL: {
        readonly code: "D505";
        readonly keyword: readonly ["Invalid state value"];
        readonly description: "";
        readonly subject: "";
    };
    readonly CONTRACT_ACCOUNT: {
        readonly code: "D506";
        readonly keyword: readonly ["Contract account not allowed"];
        readonly description: "";
        readonly subject: "";
    };
    readonly D507: {
        readonly code: "D507";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
    readonly D508: {
        readonly code: "D508";
        readonly keyword: readonly [""];
        readonly description: "";
        readonly subject: "";
    };
};
export declare const assignCodeFromErrorMessage: (errorMessage: string) => error_code;
