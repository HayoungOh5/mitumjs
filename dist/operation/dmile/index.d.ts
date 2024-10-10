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
     * Generate `migrate-data` operation to migrate data with multiple merkle root and tx id to the dmile model.
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | Address} [sender] - The sender's address.
     * @param {string[] | LongString[]} [merkleRoots] - array with multiple merkle root to record.
     * @param {string[] | LongString[]} [txIds] - array with multiple tx Id.
     * @param {string | CurrencyID} [currency] - The currency ID.
     * @returns `migrate-data` operation
     */
    migrateData(contract: string | Address, sender: string | Address, merkleRoots: string[] | LongString[], txIds: string[] | LongString[], currency: string | CurrencyID): Operation<MigrateDataFact>;
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
     * Get tx id by merkle root.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [merkleRoot] - The value of merkle root.
     * @returns `data` of `SuccessResponse` is information about the data with certain merkle root on the project:
     * - `_hint`: Hint for d-mile data,
     * - `merkleRoot`: The merkle root value,
     * - `txid`: The id of create-data transaction,
     */
    getByMerkleRoot(contract: string | Address, merkleRoot: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
    /**
     * Get mekle root by tx id.
     * @async
     * @param {string | Address} [contract] - The contract's address.
     * @param {string | LongString} [txId] - The Id of create-data transaction.
     * @returns `data` of `SuccessResponse` is an array of the history information about the data:
     * - `_hint`: Hint for d-mile data,
     * - `merkleRoot`: The merkle root value,
     * - `txid`: The id of create-data transaction,
     */
    getByTxId(contract: string | Address, txId: string): Promise<import("../../types").SuccessResponse | import("../../types").ErrorResponse>;
}
