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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = exports.Node = exports.Config = exports.NetworkID = exports.Version = void 0;
const config_js_1 = require("./config.js");
Object.defineProperty(exports, "Version", { enumerable: true, get: function () { return config_js_1.Version; } });
Object.defineProperty(exports, "NetworkID", { enumerable: true, get: function () { return config_js_1.NetworkID; } });
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_js_1.Config; } });
const index_js_1 = require("../api/index.js");
const index_js_2 = require("../types/index.js");
const index_js_3 = require("../error/index.js");
class Node extends index_js_2.Generator {
    constructor(api, delegateIP) {
        super("", api, delegateIP);
    }
    getNodeInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            index_js_3.Assert.check(this.api !== undefined || this.api !== null, index_js_3.MitumError.detail(index_js_3.ECODE.NO_API, "no api"));
            return yield index_js_1.node.getNode(this.api, this.delegateIP);
        });
    }
}
exports.Node = Node;
class Block extends index_js_2.Generator {
    constructor(api, delegate) {
        super("", api, delegate);
    }
    getAllBlocks() {
        return __awaiter(this, void 0, void 0, function* () {
            index_js_3.Assert.check(this.api !== undefined || this.api !== null, index_js_3.MitumError.detail(index_js_3.ECODE.NO_API, "no api"));
            return yield index_js_1.block.getBlocks(this.api, this.delegateIP);
        });
    }
    getBlockByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            index_js_3.Assert.check(this.api !== undefined || this.api !== null, index_js_3.MitumError.detail(index_js_3.ECODE.NO_API, "no api"));
            return yield index_js_1.block.getBlockByHash(this.api, hash, this.delegateIP);
        });
    }
    getBlockByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            index_js_3.Assert.check(this.api !== undefined || this.api !== null, index_js_3.MitumError.detail(index_js_3.ECODE.NO_API, "no api"));
            return yield index_js_1.block.getBlockByHeight(this.api, height, this.delegateIP);
        });
    }
    getOperationsByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            index_js_3.Assert.check(this.api !== undefined || this.api !== null, index_js_3.MitumError.detail(index_js_3.ECODE.NO_API, "no api"));
            return yield index_js_1.operation.getBlockOperationsByHash(this.api, hash, this.delegateIP);
        });
    }
    getOperationsByHeight(height) {
        return __awaiter(this, void 0, void 0, function* () {
            index_js_3.Assert.check(this.api !== undefined || this.api !== null, index_js_3.MitumError.detail(index_js_3.ECODE.NO_API, "no api"));
            return yield index_js_1.operation.getBlockOperationsByHeight(this.api, height, this.delegateIP);
        });
    }
}
exports.Block = Block;
//# sourceMappingURL=index.js.map