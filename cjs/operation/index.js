"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.Signer = exports.Point = exports.Token = exports.TimeStamp = exports.KYC = exports.STO = exports.DAO = exports.Credential = exports.NFT = exports.Contract = exports.Account = exports.Currency = exports.Operation = void 0;
const index_js_1 = require("./currency/index.js");
Object.defineProperty(exports, "Currency", { enumerable: true, get: function () { return index_js_1.Currency; } });
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return index_js_1.Account; } });
Object.defineProperty(exports, "Contract", { enumerable: true, get: function () { return index_js_1.Contract; } });
const index_js_2 = require("./nft/index.js");
Object.defineProperty(exports, "NFT", { enumerable: true, get: function () { return index_js_2.NFT; } });
const index_js_3 = require("./credential/index.js");
Object.defineProperty(exports, "Credential", { enumerable: true, get: function () { return index_js_3.Credential; } });
const index_js_4 = require("./dao/index.js");
Object.defineProperty(exports, "DAO", { enumerable: true, get: function () { return index_js_4.DAO; } });
const index_js_5 = require("./sto/index.js");
Object.defineProperty(exports, "STO", { enumerable: true, get: function () { return index_js_5.STO; } });
const index_js_6 = require("./kyc/index.js");
Object.defineProperty(exports, "KYC", { enumerable: true, get: function () { return index_js_6.KYC; } });
const index_js_7 = require("./timestamp/index.js");
Object.defineProperty(exports, "TimeStamp", { enumerable: true, get: function () { return index_js_7.TimeStamp; } });
const index_js_8 = require("./token/index.js");
Object.defineProperty(exports, "Token", { enumerable: true, get: function () { return index_js_8.Token; } });
const index_js_9 = require("./point/index.js");
Object.defineProperty(exports, "Point", { enumerable: true, get: function () { return index_js_9.Point; } });
const signer_js_1 = require("./signer.js");
Object.defineProperty(exports, "Signer", { enumerable: true, get: function () { return signer_js_1.Signer; } });
const index_js_10 = require("../api/index.js");
const index_js_11 = require("../key/index.js");
const index_js_12 = require("../types/index.js");
const Base = __importStar(require("./base/index.js"));
exports.Base = Base;
class Operation extends index_js_12.Generator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    getAllOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_js_10.operation.getOperations(this.api, this.delegateIP);
        });
    }
    getOperation(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_js_10.operation.getOperation(this.api, hash, this.delegateIP);
        });
    }
    sign(privatekey, operation, option) {
        const op = operation;
        op.sign(privatekey instanceof index_js_11.KeyPair ? privatekey.privateKey : privatekey, option);
        return op;
    }
    send(operation, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield index_js_10.operation.send(this.api, operation, this.delegateIP, headers);
        });
    }
}
exports.Operation = Operation;
//# sourceMappingURL=index.js.map