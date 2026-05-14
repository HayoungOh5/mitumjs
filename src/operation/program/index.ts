import { RegisterFact } from "./register"
import { CallFact } from "./call"

import { ContractGenerator, BaseOperation } from "../base"

import { Address } from "../../key/address"
import { CurrencyID } from "../../common"
import { contractApi } from "../../api"
import { getAPIData } from "../../api/getAPIData"
import { IP, LongString, TimeStamp as TS } from "../../types"
import { Assert, MitumError, ECODE } from "../../error"

// Hidden from bundler static analysis so the browser build does not try to
// resolve Node built-ins. `registerByCodeFile` is Node-only by design.
function readGoCodeFile(codePath: string): string {
    let req: NodeRequire
    try {
        req = eval("require") as NodeRequire
    } catch {
        throw MitumError.detail(
            ECODE.UNKNOWN,
            "registerByCodeFile requires a Node.js environment",
        )
    }
    const fs = req("fs") as typeof import("fs")
    const path = req("path") as typeof import("path")

    Assert.check(
        path.extname(codePath).toLowerCase() === ".go",
        MitumError.detail(
            ECODE.INVALID_FACT,
            `contract code file must have a '.go' extension, got '${codePath}'`,
        ),
    )

    try {
        return fs.readFileSync(codePath, "utf-8")
    } catch (e) {
        throw MitumError.detail(
            ECODE.UNKNOWN,
            `failed to read contract code file '${codePath}': ${(e as Error).message}`,
        )
    }
}

export class Program extends ContractGenerator {
    constructor(
        networkID: string,
        api?: string | IP,
        delegateIP?: string | IP,
    ) {
        super(networkID, api, delegateIP)
    }

    /**
     * Generate a `register` operation to deploy a smart contract
     * on the contract account.
     *
     * The smart contract source code must be written in Go.
     * The `code` argument is the full Go source as a string;
     * use {@link registerByCodeFile} to load it from a `.go`
     * file on disk instead.
     *
     * `callData` is an optional initialization payload passed to
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
     * @param {Record<string, string | LongString>} [callData] - Optional initialization payload as key-value pairs. A maximum of 100 entries is allowed in `callData`.
     * @returns `register` operation.
     */
    register(
        contract: string | Address,
        sender: string | Address,
        code: string | LongString,
        currency: string | CurrencyID,
        callData?: Record<string, string | LongString>,
    ) {
        return new BaseOperation(
            this.networkID,
            new RegisterFact(
                TS.new().UTC(),
                sender,
                contract,
                code,
                callData,
                currency,
            )
        )
    }

    /**
     * Generate a `register` operation by loading the smart contract source from a local Go file.
     *
     * Reads the file at `codePath`, verifies it has a `.go` extension, and uses its contents
     * as the `code` argument passed to {@link register}. This is a Node.js-only convenience;
     * it is not available in browser environments.
     * 
     * `callData` is an optional initialization payload passed to
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
     * @param {Record<string, string | LongString>} [callData] - Optional initialization payload as key-value pairs. A maximum of 100 entries is allowed in `callData`.
     * @returns `register` operation.
     */
    registerByCodeFile(
        contract: string | Address,
        sender: string | Address,
        codePath: string,
        currency: string | CurrencyID,
        callData?: Record<string, string | LongString>,
    ) {
        return this.register(contract, sender, readGoCodeFile(codePath), currency, callData)
    }

    /**
     * Generate a `call` operation to invoke a function on a deployed smart contract.
     * @param {string | Address} [contract] - The contract account's address where the smart contract is registered.
     * @param {string | Address} [sender] - The sender's address that executes the operation.
     * @param {string | CurrencyID} [currency] - The fee currency ID.
     * @param {string | LongString} [func] - The function name to invoke on the contract.
     * @param {Record<string, string | LongString>} [callData] - arguments of function to call as key-value pairs. A maximum of 100 entries is allowed in `callData`.
     * @returns `call` operation.
     */
    call(
        contract: string | Address,
        sender: string | Address,
        currency: string | CurrencyID,
        func: string | LongString,
        callData: Record<string, string | LongString>,
    ) {
        return new BaseOperation(
            this.networkID,
            new CallFact(
                TS.new().UTC(),
                sender,
                contract,
                func,
                callData,
                currency,
            )
        )
    }

    /**
     * Get stored data of a deployed smart contract by key.
     * @async
     * @param {string | Address} [contract] - The contract account's address.
     * @param {string} [key] - The key of the data to look up.
     * @returns `data` of `SuccessResponse` is the value stored by the deployed contract under the given key.
     */
    async getData(contract: string | Address, key: string) {
        Assert.check(this.api !== undefined && this.api !== null, MitumError.detail(ECODE.NO_API, "API is not provided"))
        Address.from(contract)
        return await getAPIData(() => contractApi.program.getData(this.api, contract, this.delegateIP, key))
    }
}

export type { CallData } from "./register"
