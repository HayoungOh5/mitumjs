import { Generator, IP } from "./types";
import { Block, Node } from "./node";
import { Utils } from "./utils/transformUnit";
import { Account, Currency, Contract, Operation, Signer, AuthDID, AccountAbstraction } from "./operation";
export declare class Mitum extends Generator {
    static allowedOperation: {
        readonly currency: {
            transfer(): import("./operation/base").AllowedOperation;
        };
        readonly account: {
            create(): import("./operation/base").AllowedOperation;
            updateKey(): import("./operation/base").AllowedOperation;
        };
        readonly contract: {
            create(): import("./operation/base").AllowedOperation;
            withdraw(): import("./operation/base").AllowedOperation;
            updateRecipient(): import("./operation/base").AllowedOperation;
            updateHandler(): import("./operation/base").AllowedOperation;
        };
        readonly authdid: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            create(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateDocument(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly credential: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            addTemplate(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            issue(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            revoke(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly dao: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateModelConfig(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            propose(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            cancelProposal(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            register(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            preSnap(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            postSnap(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            vote(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            execute(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly nft: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateModelConfig(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            mint(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approveAll(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approve(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            addSignature(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly payment: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            deposit(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateAccountSetting(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            withdraw(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly point: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            mint(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approve(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            burn(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transferFrom(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly storage: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            createData(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            deleteData(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            updateData(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly timestamp: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            issue(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
        readonly token: {
            registerModel(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            mint(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transfer(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            approve(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            burn(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
            transferFrom(contract: string | import("./key").Address): import("./operation/base").AllowedOperation;
        };
    };
    static ECODE: {
        readonly NO_API: "EC_NO_API";
        readonly UNKNOWN: "EC_UNKNOWN";
        readonly OP_SIZE_EXCEEDED: "EC_OP_SIZE_EXCEEDED";
        readonly EMPTY_STRING: "EC_EMPTY_STRING";
        readonly EMPTY_SIGN: "EC_EMPTY_SIGN";
        readonly INVALID_DATE: "EC_INVALID_DATE";
        readonly INVALID_IP: "EC_INVALID_IP";
        readonly INVALID_LENGTH: "EC_INVALID_LENGTH";
        readonly INVALID_TYPE: "EC_INVALID_TYPE";
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
        readonly INVALID_DECIMAL: "EC_INVALID_DECIMAL";
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
        readonly INVALID_FACT_HASH: "EC_INVALID_FACT_HASH";
        readonly INVALID_OPERATION: "EC_INVALID_OPERATION";
        readonly INVALID_OPERATIONS: "EC_INVALID_OPERATIONS";
        readonly INVALID_USER_OPERATION: "EC_INVALID_USER_OPERATION";
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
        readonly HDWALLET: {
            readonly INVALID_PHRASE: "EC_INVALID_PHRASE";
            readonly INVALID_PATH: "EC_INVALID_PATH";
        };
        readonly CURRENCY: {
            readonly INVALID_CURRENCY_FEEER: "EC_INVALID_CURRENCY_FEEER";
            readonly INVALID_CURRENCY_POLICY: "EC_INVALID_CURRENCY_POLICY";
            readonly INVALID_CURRENCY_DESIGN: "EC_INVALID_CURRENCY_DESIGN";
        };
        readonly AUTH_DID: {
            readonly INVALID_DID: "EC_INVALID_DID";
            readonly INVALID_DOCUMENT: "EC_INVALID_DOCUMENT";
            readonly INVALID_AUTHENTICATION: "EC_INVALID_AUTHENTICATION";
        };
        readonly TIME_OUT: "EC_TIME_OUT";
        readonly TRANSACTION_REVERTED: "EC_TRANSACTION_REVERTED";
    };
    static PCODE: {
        readonly AMBIGUOUS: {
            readonly code: "P0A";
            readonly keyword: readonly [""];
            readonly description: "Ambiguous error";
            readonly subject: "";
        };
        readonly MITUM_NETWORK: {
            readonly code: "P0N";
            readonly keyword: readonly ["Too Many Requests"];
            readonly description: "Error from network";
            readonly subject: "";
        };
        readonly UNDEFINED: {
            readonly code: "P00";
            readonly keyword: readonly [""];
            readonly description: "Undefined error";
            readonly subject: "";
        };
        readonly IV_BASE_OP: {
            /**Get the API URL in use.
             * @returns {string | undefined} The API URL.
            */
            readonly code: "P01";
            readonly keyword: readonly ["Invalid BaseOperation"];
            readonly description: "Error from IsValid(BaseOperation)";
            readonly subject: "";
        };
        readonly IV_BASE_NODE_OP: {
            readonly code: "P02"; /**
             * Get the delegate IP in use.
             * @returns {string} The delegate IP address.
             */
            readonly keyword: readonly ["Invalid BaseNodeOperation"];
            readonly description: "Error from IsValid(BaseNodeOperation)";
            readonly subject: "";
        };
        readonly IV_BASE_STATE: {
            readonly code: "P03";
            readonly keyword: readonly ["Invalid BaseState"];
            /**Get the network ID in use.
             * @returns {string} The network ID (chain).
            */
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
    static DCODE: {
        readonly AMBIGUOUS: {
            readonly code: "D00A";
            readonly keyword: readonly [""];
            readonly description: "Ambiguous error";
            readonly subject: "";
        };
        readonly COMPLEX: {
            readonly code: "D00C";
            readonly keyword: readonly [""];
            readonly description: "Complex error with multiple DCODE";
            readonly subject: "";
        };
        readonly OP_DEP: {
            readonly code: "D00D";
            readonly keyword: readonly [""];
            readonly description: "Operation dependent error";
            readonly subject: "";
        };
        readonly UNDEFINED: {
            readonly code: "D000";
            readonly keyword: readonly [""];
            readonly description: "Undefined error";
            readonly subject: "";
        };
        readonly EMPTY: {
            readonly code: "D101";
            readonly keyword: readonly [""];
            readonly description: "Empty or null data";
            readonly subject: "";
        };
        readonly IV_LEN: {
            readonly code: "D102";
            readonly keyword: readonly ["Array length"];
            readonly description: "The provided array exceeds the allowed length.";
            readonly subject: "";
        };
        readonly IV_RANGE: {
            readonly code: "D103";
            readonly keyword: readonly ["Value out of range"];
            readonly description: "The variable exceeds the allowed range.";
            readonly subject: "";
        };
        readonly IV_VAL: {
            readonly code: "D104";
            readonly keyword: readonly ["Invalid value"];
            readonly description: "Invalid string, Insufficient balance, Invalid state change etc.";
            readonly subject: "";
        };
        readonly IV_DUP: {
            readonly code: "D105";
            readonly keyword: readonly ["Duplicated value"];
            readonly description: "The item contains duplicate values.";
            readonly subject: "";
        };
        readonly SELF_TARGET: {
            readonly code: "D106";
            readonly keyword: readonly ["Self targeted"];
            readonly description: "Duplicate account addresses provided in an invalid manner. (sender=receiver, sender=contract, etc.)";
            readonly subject: "";
        };
        readonly IV_SIGN: {
            readonly code: "D201";
            readonly keyword: readonly ["Invalid signing", "BaseNodeSign"];
            readonly description: "The private key does not match the address or node sign required or the signatures for the multiSig account do not meet the threshold";
            readonly subject: "";
        };
        readonly IV_ALTERSIGN: {
            readonly code: "D202";
            readonly keyword: readonly ["Invalid user signing"];
            readonly description: "Alternative signature for account abstraction operation is not valid";
            readonly subject: "";
        };
        readonly NO_AUTH: {
            readonly code: "D301";
            readonly keyword: readonly ["Account not authorized"];
            readonly description: "The sender account does not have permission to execute the operation.";
            readonly subject: "";
        };
        readonly CA_DISALLOW: {
            readonly code: "D302";
            readonly keyword: readonly ["Contract account not allowed"];
            readonly description: "A contract account cannot be used as sender, receiver etc.";
            readonly subject: "";
        };
        readonly IV_AUTH_TYPE: {
            readonly code: "D303";
            readonly keyword: readonly ["Invalid Auth Type"];
            readonly description: "Occurs when there is a problem with authentication_id in the account abstraction operation.(If verificationMethod of linked authentication is another linked authentication)";
            readonly subject: "";
        };
        readonly CA_RESTRICTED: {
            readonly code: "D304";
            readonly keyword: readonly ["Contract account restricted"];
            readonly description: "Contract account with contract_account_status.balance_status is 1, the owner cannot withdraw.";
            readonly subject: "";
        };
        readonly INSUFF_BAL: {
            readonly code: "D401";
            readonly keyword: readonly [""];
            readonly description: "Insufficient token or point balance.";
            readonly subject: "";
        };
        readonly NF_CUR: {
            readonly code: "D501";
            readonly keyword: readonly ["Currency not found"];
            readonly description: "The currency cannot be found on the blockchain.";
            readonly subject: "";
        };
        readonly NF_ACC: {
            readonly code: "D502";
            readonly keyword: readonly ["Account not found", "Contract account not found"];
            readonly description: "The account or contract account cannot be found on the blockchain.";
            readonly subject: "";
        };
        readonly NF_SERVICE: {
            readonly code: "D503";
            readonly keyword: readonly ["Service not found"];
            readonly description: "The service cannot be found in the given contract.";
            readonly subject: "";
        };
        readonly NF_STATE: {
            readonly code: "D504";
            readonly keyword: readonly ["State not found"];
            readonly description: "The state cannot be found on the blockchain.";
            readonly subject: "";
        };
        readonly EXIST_CUR: {
            readonly code: "D505";
            readonly keyword: readonly ["Currency exist"];
            readonly description: "The currency already exists on the blockchain.";
            readonly subject: "";
        };
        readonly EXIST_ACC: {
            readonly code: "D506";
            readonly keyword: readonly ["Account exist", "Contract account exist"];
            readonly description: "The account or contract account already exists on the blockchain.";
            readonly subject: "";
        };
        readonly EXIST_SERVICE: {
            readonly code: "D507";
            readonly keyword: readonly ["Service exist"];
            readonly description: "The contract already contains the service.";
            readonly subject: "";
        };
        readonly EXIST_STATE: {
            readonly code: "D508";
            readonly keyword: readonly ["State exist"];
            readonly description: "The state already exists on the blockchain.";
            readonly subject: "";
        };
        readonly EXIST_FACT_HASH: {
            readonly code: "D509";
            readonly keyword: readonly ["already in state"];
            readonly description: "The operation exists on the blockchain. Check it using fact hash";
            readonly subject: "";
        };
    };
    private _node;
    private _utils;
    private _account;
    private _currency;
    private _contract;
    private _block;
    private _operation;
    private _signer;
    private _authdid;
    private _accountAbstraction;
    constructor(api?: string, delegateIP?: string);
    private refresh;
    get node(): Node;
    get account(): Account;
    get currency(): Currency;
    get block(): Block;
    get operation(): Operation;
    get signer(): Signer;
    get contract(): Contract;
    get authdid(): AuthDID;
    get aa(): AccountAbstraction;
    get utils(): Utils;
    /**
     * Set the API URL to interact with Mitum network.
     * @param {string | IP} [api] - The API URL to set
     */
    setAPI(api: string | IP): void;
    /**
     * Set the delegate IP address.
     * @param {string | IP} [delegateIP] - The delegate IP address to set.
     */
    setDelegate(delegateIP: string | IP): void;
    /**
     * Set the blockchain network ID (chain). The default value is configured to 'mitum'.
     * @param {string} [networkID] - The network ID to set.
     */
    setNetworkID(networkID: string): void;
    /**Get the API URL in use.
     * @returns {string | undefined} The API URL.
    */
    getAPI(): string | undefined;
    /**
     * Get the delegate IP in use.
     * @returns {string} The delegate IP address.
     */
    getDelegate(): string | undefined;
    /**Get the network ID in use.
     * @returns {string} The network ID (chain).
    */
    getNetworkID(): string;
}
export default Mitum;
