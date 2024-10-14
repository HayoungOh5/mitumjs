import { RegisterModelFact } from "./register-model";
import { CreateDataFact } from "./create-data";
import { MigrateDataFact } from "./migrate-data";
import { ContractGenerator, Operation } from "../base";
import { Address } from "../../key";
import { CurrencyID } from "../../common";
import { IP, LongString } from "../../types";
export declare class Dmile extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    /**
     * Generate a `register-model` operation to register new dmile model on the contract.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [project] - The project's name
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `register-model` operation.
     */
    registerModel(contract: string | Address, sender: string | Address, project: string | LongString, currency: string | CurrencyID): Operation<RegisterModelFact>;
    /**
     * Generate `create-data` operation to create data with new merkle root on the dmile model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string | LongString} [merkleRoot] - Value of the merkle root to record.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `create-data` operation
     */
    createData(contract: string | Address, sender: string | Address, merkleRoot: string | LongString, currency: string | CurrencyID): Operation<CreateDataFact>;
    /**
     * Generate `migrate-data` operation to migrate data with multiple merkle root and tx hash to the dmile model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | LongString[]} [merkleRoots] - array with multiple merkle roots to record.
     * @param {string[] | LongString[]} [txHashes] - array with multiple tx hashes.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `migrate-data` operation
     */
    migrateData(contract: string | Address, sender: string | Address, merkleRoots: string[] | LongString[], txHashes: string[] | LongString[], currency: string | CurrencyID): Operation<MigrateDataFact>;
    /**
     * Get information about a dmile model on the contract.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @returns `data` of `SuccessResponse` is information about the dmile service:
     * - `_hint`: Hint for dmile design,
     * - `project`: Project's name
     */
    getModelInfo(contract: string | Address): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get tx hash by merkle root.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [merkleRoot] - The value of merkle root.
     * @returns `data` of `SuccessResponse` is tx hash related to the merkle root:
     * - `tx_hash`: The fact hash of create-data operation.
     */
    getTxHashByMerkleRoot(contract: string | Address, merkleRoot: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get mekle root by tx hash.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [txHash] - The hash of create-data transaction.
     * @returns `data` of `SuccessResponse` is merkle root related to the tx hash:
     * - `merkle_root`: The merkle root value
     */
    getMerkleRootByTxHash(contract: string | Address, txHash: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get mekle root existence.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [merkleRoot] - The value of merkle root.
     * @returns If the data does not exist, an `ErrorResponse` is returned. Otherwise, a `SuccessResponse` is returned with `data` as shown below:
     * - `result`: "1"
     */
    getMerkleRootExistence(contract: string | Address, merkleRoot: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
