"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroAddress = exports.NodeAddress = exports.Address = void 0;
const index_js_1 = require("../alias/index.js");
const index_js_2 = require("../node/index.js");
const index_js_3 = require("../common/index.js");
const index_js_4 = require("../error/index.js");
class BaseAddress {
    constructor(s, type) {
        this.s = s;
        if (type) {
            this.type = type;
        }
        else if (this.s.endsWith(index_js_1.SUFFIX.ADDRESS.MITUM)) {
            this.type = "mitum";
        }
        else if (this.s.endsWith(index_js_1.SUFFIX.ADDRESS.ETHER)) {
            this.type = "ether";
        }
        else if (this.s.endsWith(index_js_1.SUFFIX.ADDRESS.NODE)) {
            this.type = "node";
        }
        else if (this.s.endsWith(index_js_1.SUFFIX.ADDRESS.ZERO)) {
            this.type = "zero";
        }
        else {
            throw index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ADDRESS, "address type not detected");
        }
    }
    toBuffer() {
        return Buffer.from(this.s);
    }
    toString() {
        return this.s;
    }
}
class Address extends BaseAddress {
    constructor(s) {
        super(s);
        index_js_4.StringAssert.with(s, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ADDRESS, "invalid address"))
            .empty().not()
            .endsWith(index_js_1.SUFFIX.ADDRESS.MITUM, index_js_1.SUFFIX.ADDRESS.ETHER)
            .satisfyConfig(index_js_2.Config.ADDRESS.DEFAULT)
            .excute();
    }
    static from(s) {
        return s instanceof Address ? s : new Address(s);
    }
}
exports.Address = Address;
class NodeAddress extends BaseAddress {
    constructor(s) {
        super(s, "node");
        index_js_4.StringAssert.with(s, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ADDRESS, "invalid node address"))
            .empty().not()
            .endsWith(index_js_1.SUFFIX.ADDRESS.NODE)
            .satisfyConfig(index_js_2.Config.ADDRESS.NODE)
            .excute();
    }
    static from(s) {
        return s instanceof NodeAddress ? s : new NodeAddress(s);
    }
}
exports.NodeAddress = NodeAddress;
class ZeroAddress extends BaseAddress {
    constructor(s) {
        super(s, "zero");
        index_js_4.StringAssert.with(s, index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_ADDRESS, "invalid zero address"))
            .empty().not()
            .endsWith(index_js_1.SUFFIX.ADDRESS.ZERO)
            .satisfyConfig(index_js_2.Config.ADDRESS.ZERO)
            .excute();
        this.currency = new index_js_3.CurrencyID(s.substring(0, s.length - index_js_2.Config.SUFFIX.ZERO_ADDRESS.value));
    }
    static from(s) {
        return s instanceof ZeroAddress ? s : new ZeroAddress(s);
    }
}
exports.ZeroAddress = ZeroAddress;
//# sourceMappingURL=address.js.map