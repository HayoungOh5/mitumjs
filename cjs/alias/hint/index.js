"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const currency_js_1 = __importDefault(require("./currency.js"));
const nft_js_1 = __importDefault(require("./nft.js"));
const credential_js_1 = __importDefault(require("./credential.js"));
const dao_js_1 = __importDefault(require("./dao.js"));
const kyc_js_1 = __importDefault(require("./kyc.js"));
const sto_js_1 = __importDefault(require("./sto.js"));
const timestamp_js_1 = __importDefault(require("./timestamp.js"));
const token_js_1 = __importDefault(require("./token.js"));
const point_js_1 = __importDefault(require("./point.js"));
exports.default = {
    FACT_SIGN: "base-fact-sign",
    CURRENCY: currency_js_1.default,
    NFT: nft_js_1.default,
    CREDENTIAL: credential_js_1.default,
    DAO: dao_js_1.default,
    KYC: kyc_js_1.default,
    STO: sto_js_1.default,
    TIMESTAMP: timestamp_js_1.default,
    TOKEN: token_js_1.default,
    POINT: point_js_1.default,
};
//# sourceMappingURL=index.js.map