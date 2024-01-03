"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Whitelist = void 0;
const index_js_1 = require("../../alias/index.js");
const index_js_2 = require("../../common/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../key/index.js");
const index_js_5 = require("../../error/index.js");
const index_js_6 = require("../../utils/index.js");
const index_js_7 = require("../../types/index.js");
class Whitelist {
    constructor(active, accounts) {
        this.hint = new index_js_2.Hint(index_js_1.HINT.DAO.WHITELIST);
        this.active = index_js_7.Bool.from(active);
        this.accounts = accounts ? accounts.map(a => index_js_4.Address.from(a)) : [];
        index_js_5.Assert.check(index_js_3.Config.DAO.ADDRESS_IN_WHITELIST.satisfy(accounts.length), index_js_5.MitumError.detail(index_js_5.ECODE.DAO.INVALID_WHITELIST, "whitelist length out of range"));
        index_js_5.Assert.check((0, index_js_6.hasOverlappingAddress)(accounts), index_js_5.MitumError.detail(index_js_5.ECODE.DAO.INVALID_WHITELIST, "duplicate account found in whitelist"));
    }
    toBuffer() {
        return Buffer.concat([
            this.active.toBuffer(),
            Buffer.concat(this.accounts.sort(index_js_6.SortFunc).map(a => a.toBuffer())),
        ]);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString(),
            active: this.active.v,
            accounts: this.accounts.sort(index_js_6.SortFunc).map(a => a.toString()),
        };
    }
}
exports.Whitelist = Whitelist;
//# sourceMappingURL=whitelist.js.map