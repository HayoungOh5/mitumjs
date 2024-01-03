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
exports.Token = void 0;
const register_token_js_1 = require("./register-token.js");
const mint_js_1 = require("./mint.js");
const burn_js_1 = require("./burn.js");
const transfer_js_1 = require("./transfer.js");
const approve_js_1 = require("./approve.js");
const transfer_from_js_1 = require("./transfer-from.js");
const index_js_1 = require("../base/index.js");
const index_js_2 = require("../../api/index.js");
const index_js_3 = require("../../types/index.js");
class Token extends index_js_1.ContractGenerator {
    constructor(networkID, api, delegateIP) {
        super(networkID, api, delegateIP);
    }
    registerToken(contractAddr, sender, currency, name, symbol, initialSupply) {
        return new index_js_1.Operation(this.networkID, new register_token_js_1.RegisterTokenFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency, symbol, name, initialSupply !== null && initialSupply !== void 0 ? initialSupply : 0));
    }
    mint(contractAddr, sender, currency, receiver, amount) {
        return new index_js_1.Operation(this.networkID, new mint_js_1.MintFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency, receiver, amount));
    }
    burn(contractAddr, sender, currency, target, amount) {
        return new index_js_1.Operation(this.networkID, new burn_js_1.BurnFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency, target, amount));
    }
    transfer(contractAddr, sender, currency, receiver, amount) {
        return new index_js_1.Operation(this.networkID, new transfer_js_1.TransferFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency, receiver, amount));
    }
    transferFrom(contractAddr, sender, currency, receiver, target, amount) {
        return new index_js_1.Operation(this.networkID, new transfer_from_js_1.TransferFromFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency, receiver, target, amount));
    }
    approve(contractAddr, sender, currency, approved, amount) {
        return new index_js_1.Operation(this.networkID, new approve_js_1.ApproveFact(index_js_3.TimeStamp.new().UTC(), sender, contractAddr, currency, approved, amount));
    }
    getTokenInfo(contractAddr) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.token.getToken(this.api, contractAddr, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
    getAllowance(contractAddr, owner, spender) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.token.getToken(this.api, contractAddr, this.delegateIP));
            if (data) {
                const approve_list = data._embedded.policy.approve_list;
                let amount;
                for (let i = 0; i < approve_list.length; i++) {
                    if (approve_list[i].account === owner) {
                        const approved = approve_list[i].approved;
                        for (let j = 0; j < approved.length; j++) {
                            if (approved[j].account === spender) {
                                amount = {
                                    'amount': approved[j].amount
                                };
                            }
                        }
                    }
                }
                return amount;
            }
            else {
                return null;
            }
        });
    }
    getTokenBalance(contractAddr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield (0, index_js_2.getAPIData)(() => index_js_2.contract.token.getTokenBalance(this.api, contractAddr, owner, this.delegateIP));
            return data ? data._embedded : null;
        });
    }
}
exports.Token = Token;
//# sourceMappingURL=index.js.map