"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mitum = void 0;
const index_js_1 = require("./types/index.js");
const index_js_2 = require("./node/index.js");
const index_js_3 = require("./operation/index.js");
class Mitum extends index_js_1.Generator {
    constructor(api, delegateIP) {
        super(index_js_2.NetworkID.get(), api, delegateIP);
        this._node = new index_js_2.Node(this.api, this.delegateIP);
        this._account = new index_js_3.Account(this.networkID, this.api, this.delegateIP);
        this._currency = new index_js_3.Currency(this.networkID, this.api, this.delegateIP);
        this._block = new index_js_2.Block(this.api, this.delegateIP);
        this._operation = new index_js_3.Operation(this.networkID, this.api, this.delegateIP);
        this._signer = new index_js_3.Signer(this.networkID, this.api);
        this._contract = new index_js_3.Contract(this.networkID, this.api, this.delegateIP);
        this._nft = new index_js_3.NFT(this.networkID, this.api, this.delegateIP);
        this._credential = new index_js_3.Credential(this.networkID, this.api, this.delegateIP);
        this._timestamp = new index_js_3.TimeStamp(this.networkID, this.api, this.delegateIP);
        this._sto = new index_js_3.STO(this.networkID, this.api, this.delegateIP);
        this._kyc = new index_js_3.KYC(this.networkID, this.api, this.delegateIP);
        this._dao = new index_js_3.DAO(this.networkID, this.api, this.delegateIP);
        this._token = new index_js_3.Token(this.networkID, this.api, this.delegateIP);
        this._point = new index_js_3.Point(this.networkID, this.api, this.delegateIP);
    }
    refresh() {
        this._node = new index_js_2.Node(this.api, this.delegateIP);
        this._account = new index_js_3.Account(this.networkID, this.api, this.delegateIP);
        this._currency = new index_js_3.Currency(this.networkID, this.api, this.delegateIP);
        this._block = new index_js_2.Block(this.api, this.delegateIP);
        this._operation = new index_js_3.Operation(this.networkID, this.api, this.delegateIP);
        this._contract = new index_js_3.Contract(this.networkID, this.api, this.delegateIP);
        this._nft = new index_js_3.NFT(this.networkID, this.api, this.delegateIP);
        this._credential = new index_js_3.Credential(this.networkID, this.api, this.delegateIP);
        this._timestamp = new index_js_3.TimeStamp(this.networkID, this.api, this.delegateIP);
        this._sto = new index_js_3.STO(this.networkID, this.api, this.delegateIP);
        this._kyc = new index_js_3.KYC(this.networkID, this.api, this.delegateIP);
        this._dao = new index_js_3.DAO(this.networkID, this.api, this.delegateIP);
        this._token = new index_js_3.Token(this.networkID, this.api, this.delegateIP);
        this._point = new index_js_3.Point(this.networkID, this.api, this.delegateIP);
    }
    get node() {
        return this._node;
    }
    get account() {
        return this._account;
    }
    get currency() {
        return this._currency;
    }
    get block() {
        return this._block;
    }
    get operation() {
        return this._operation;
    }
    get signer() {
        return this._signer;
    }
    get contract() {
        return this._contract;
    }
    get nft() {
        return this._nft;
    }
    get credential() {
        return this._credential;
    }
    get timestamp() {
        return this._timestamp;
    }
    get sto() {
        return this._sto;
    }
    get kyc() {
        return this._kyc;
    }
    get dao() {
        return this._dao;
    }
    get token() {
        return this._token;
    }
    get point() {
        return this._point;
    }
    /**
     * @deprecated use setAPI(api?: string | IP)
     */
    setNode(api) {
        this.setAPI(api);
    }
    setAPI(api) {
        super.setAPI(api);
        this.refresh();
    }
    setDelegate(delegateIP) {
        super.setDelegate(delegateIP);
        this.refresh();
    }
    getDelegate() {
        return this.delegateIP.toString();
    }
    /**
     * @deprecated use .api (get)
     */
    getNode() {
        return this.api.toString();
    }
    getAPI() {
        return this.api.toString();
    }
    getChain() {
        return this.networkID;
    }
    setChain(networkID) {
        super.setNetworkID(networkID);
        this.refresh();
    }
}
exports.Mitum = Mitum;
exports.default = Mitum;
//# sourceMappingURL=index.js.map