"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const index_js_1 = require("../../key/index.js");
const index_js_2 = require("../../types/index.js");
const url = (api, contract) => `${index_js_2.IP.from(api).toString()}/sto/${index_js_1.Address.from(contract).toString()}`;
const delegateUri = (delegateIP) => `${index_js_2.IP.from(delegateIP).toString()}?uri=`;
function getService(api, contract, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getPartitions(api, contract, holder, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}/holder/${index_js_1.Address.from(holder).toString()}/partitions`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBalanceByHolder(api, contract, holder, partition, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}/holder/${index_js_1.Address.from(holder).toString()}/partition/${partition}/balance`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getOperatorsByHolder(api, contract, holder, partition, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}/holder/${index_js_1.Address.from(holder).toString()}/partition/${partition}/operators`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getPartitionBalance(api, contract, partition, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}/partition/${partition}/balance`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getAuthorized(api, contract, operator, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${url(api, contract)}/operator/${index_js_1.Address.from(operator).toString()}/holders`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
exports.default = {
    getService,
    getPartitions,
    getBalanceByHolder,
    getOperatorsByHolder,
    getPartitionBalance,
    getAuthorized,
};
//# sourceMappingURL=sto.js.map