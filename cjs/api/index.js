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
exports.getAPIData = exports.contract = exports.currency = exports.operation = exports.node = exports.block = exports.account = void 0;
const account_js_1 = __importDefault(require("./account.js"));
exports.account = account_js_1.default;
const block_js_1 = __importDefault(require("./block.js"));
exports.block = block_js_1.default;
const node_js_1 = __importDefault(require("./node.js"));
exports.node = node_js_1.default;
const operation_js_1 = __importDefault(require("./operation.js"));
exports.operation = operation_js_1.default;
const index_js_1 = __importDefault(require("./models/index.js"));
const currency = index_js_1.default.currency;
exports.currency = currency;
const contract = index_js_1.default.contract;
exports.contract = contract;
exports.default = {
    account: account_js_1.default,
    block: block_js_1.default,
    node: node_js_1.default,
    operation: operation_js_1.default,
    currency,
    contract,
};
function getAPIData(f) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield f();
        if (res.status !== 200) {
            return null;
        }
        return res.data;
    });
}
exports.getAPIData = getAPIData;
//# sourceMappingURL=index.js.map