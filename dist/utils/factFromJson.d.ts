import { Fact } from "../operation/base";
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
export declare function factFromJson(factJson: any): Fact;
