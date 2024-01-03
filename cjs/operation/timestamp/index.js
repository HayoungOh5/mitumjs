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
exports.TimeStamp = void 0;
const create_service_js_1 = require("./create-service.js");
const append_js_1 = require("./append.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../api/index.js");
const index_js_3 = require("../../types/index.js");
class TimeStamp extends index_js_1.ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    createService(contractAddr, sender, currency) {
        return new index_js_1.Operation(this.networkID, new create_service_js_1.CreateServiceFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency));
    }
    append(contractAddr, sender, projectID, requestTimeStamp, data, currency) {
        new index_js_3.URIString(projectID, 'projectID');
        const fact = new append_js_1.AppendFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, projectID, requestTimeStamp, data, currency);
        return new index_js_1.Operation(this.networkID, fact);
    }
    getServiceInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_2.getAPIData)(() => index_js_2.contract.timestamp.getService(this.api, contractAddr, this.delegateIP));
        });
    }
    getTimestampInfo(contractAddr, projectID, tid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, index_js_2.getAPIData)(() => index_js_2.contract.timestamp.getTimeStamp(this.api, contractAddr, projectID, tid, this.delegateIP));
        });
    }
}
exports.TimeStamp = TimeStamp;
//# sourceMappingURL=index.js.map