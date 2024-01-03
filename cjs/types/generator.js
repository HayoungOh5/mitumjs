"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Generator = void 0;
const string_js_1 = require("./string.js");
class Generator {
    constructor(networkID, api, delegateIP) {
        this._networkID = networkID;
        this._api = api ? string_js_1.IP.from(api) : undefined;
        this._delegateIP = delegateIP ? string_js_1.IP.from(delegateIP) : undefined;
    }
    /**
     * @deprecated use setNetworkID(networkID: string)
     */
    setChainID(networkID) {
        this.setNetworkID(networkID);
    }
    setNetworkID(networkID) {
        this._networkID = networkID;
    }
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api) {
        this.setAPI(api);
    }
    setAPI(api) {
        this._api = api ? string_js_1.IP.from(api) : undefined;
    }
    setDelegate(delegateIP) {
        this._delegateIP = delegateIP ? string_js_1.IP.from(delegateIP) : undefined;
    }
    get networkID() {
        return this._networkID;
    }
    get api() {
        return this._api ? this._api.toString() : "";
    }
    get delegateIP() {
        return this._delegateIP ? this._delegateIP.toString() : "";
    }
}
exports.Generator = Generator;
//# sourceMappingURL=generator.js.map