"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const index_js_1 = require("../error/index.js");
class Token {
    constructor(s) {
        index_js_1.Assert.check(s !== "", index_js_1.MitumError.detail(index_js_1.ECODE.INVALID_TOKEN, "empty token"));
        this.s = s;
    }
    static from(s) {
        return s instanceof Token ? s : new Token(s);
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return Buffer.from(this.s, "utf8").toString("base64");
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map