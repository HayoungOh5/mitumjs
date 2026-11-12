import { RegisterFact } from "./register";
import { CallFact } from "./call";
import { ContractGenerator, BaseOperation } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { IP, LongString } from "../../types";
export type CallItemArg = {
    function: string | LongString;
    callData?: Record<string, string | LongString> | undefined;
};
export declare class Program extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    /**
     * Generate a `register` operation to deploy a smart contract
     * on the contract account.
     *
     * The smart contract source code must be written in Go.
     * The `code` argument is the full Go source as a string;
     * use {@link registerByCodeFile} to load it from a `.go`
     * file on disk instead.
     *
     * `initData` is an optional initialization payload passed to
     * the smart contract during registration. It consists of
     * arbitrary key-value pairs and may vary depending on the
     * contract implementation.
     *
     * Example:
     * ```ts
     * {
     *   name: "MyToken",
     *   symbol: "MTK",
     *   decimals: "18",
     *   totalSupply: "1000000",
     * }
     * ```
     *
     * @param {string | Address} contract - The contract account address where the smart contract is registered.
     * @param {string | Address} sender - The sender address that executes the operation.
     * @param {string | LongString} code - The smart contract code string (Go source).
     * @param {string | CurrencyID} currency - The fee currency ID.
     * @param {Record<string, string | LongString>} [initData] - Optional initialization payload as key-value pairs. A maximum of 100 entries is allowed in `callData`.
     * @returns `register` operation.
     */
    register(contract: string | Address, sender: string | Address, code: string | LongString, currency: string | CurrencyID, initData?: Record<string, string | LongString>): BaseOperation<RegisterFact>;
    /**
     * Generate a `register` operation by loading the smart contract source from a local Go file.
     *
     * Reads the file at `codePath`, verifies it has a `.go` extension, and uses its contents
     * as the `code` argument passed to {@link register}. This is a Node.js-only convenience;
     * it is not available in browser environments.
     *
     * `initData` is an optional initialization payload passed to
     * the smart contract during registration. It consists of
     * arbitrary key-value pairs and may vary depending on the
     * contract implementation.
     *
     * Example:
     * ```ts
     * {
     *   name: "MyToken",
     *   symbol: "MTK",
     *   decimals: "18",
     *   totalSupply: "1000000",
     * }
     * ```
     * @param {string | Address} [contract] - The contract account's address where the smart contract is registered.
     * @param {string | Address} [sender] - The sender's address that executes the operation.
     * @param {string} [codePath] - Filesystem path to the `.go` source file containing the smart contract code.
     * @param {string | CurrencyID} [currency] - The fee currency ID.
     * @param {Record<string, string | LongString>} [initData] - Optional initialization payload as key-value pairs. A maximum of 100 entries is allowed in `callData`.
     * @returns `register` operation.
     */
    registerByCodeFile(contract: string | Address, sender: string | Address, codePath: string, currency: string | CurrencyID, initData?: Record<string, string | LongString>): BaseOperation<RegisterFact>;
    /**
     * Generate a `call` operation to invoke one or more functions on a deployed smart contract.
     *
     * A `call` operation carries a list of items, each item invoking a single
     * function with its own `callData` arguments. Pass a single `{ function, callData }`
     * item or an array of items to invoke multiple functions in one operation.
     *
     * Example:
     * ```ts
     * mitum.program.call(contract, sender, currency, [
     *   { function: "CreateData", callData: { data: "5" } },
     *   { function: "UpdateData", callData: { data: "6" } },
     * ])
     * ```
     *
     * @param {string | Address} [contract] - The contract account's address where the smart contract is registered.
     * @param {string | Address} [sender] - The sender's address that executes the operation.
     * @param {string | CurrencyID} [currency] - The fee currency ID.
     * @param {CallItemArg | CallItemArg[]} [items] - A single call item or an array of call items, each with a `function` name and optional `callData` arguments (max 100 entries each).
     * @returns `call` operation.
     */
    call(contract: string | Address, sender: string | Address, currency: string | CurrencyID, items: CallItemArg | CallItemArg[]): BaseOperation<CallFact>;
    /**
     * Executes a read-only query on a deployed smart contract.
     *
     * @async
     * @param {string | Address} contract - The contract account address.
     * @param {string | LongString} func - The exported contract query function name.
     * @param {Record<string, string | LongString>} [params={}] - Query arguments.
     * @returns The query result returned by the smart contract.
     */
    query(contract: string | Address, func: string | LongString, params?: Record<string, string | LongString>): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
export type { Data } from "./register";
