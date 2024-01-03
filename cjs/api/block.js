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
const index_js_1 = require("../types/index.js");
const delegateUri = (delegateIP) => `${index_js_1.IP.from(delegateIP).toString()}?uri=`;
function getBlocks(api, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${index_js_1.IP.from(api).toString()}/block/manifests`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBlockByHeight(api, height, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${index_js_1.IP.from(api).toString()}/block/${index_js_1.Big.from(height).toString()}/manifest`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
function getBlockByHash(api, hash, delegateIP) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiPath = `${index_js_1.IP.from(api).toString()}/block/${hash}/manifest`;
        return !delegateIP ? yield axios_1.default.get(apiPath) : yield axios_1.default.get(delegateUri(delegateIP) + encodeURIComponent(apiPath));
    });
}
exports.default = {
    getBlocks,
    getBlockByHeight,
    getBlockByHash,
};
//# sourceMappingURL=block.js.map