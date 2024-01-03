"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppendFact = void 0;
const fact_js_1 = require("./fact.js");
const index_js_1 = require("../../types/index.js");
const index_js_2 = require("../../alias/index.js");
const index_js_3 = require("../../node/index.js");
const index_js_4 = require("../../error/index.js");
class AppendFact extends fact_js_1.TimeStampFact {
    constructor(token, sender, target, projectID, requestTimeStamp, data, currency) {
        super(index_js_2.HINT.TIMESTAMP.APPEND.FACT, token, sender, target, currency);
        this.projectID = projectID;
        this.requestTimeStamp = index_js_1.Big.from(requestTimeStamp);
        this.data = data;
        index_js_4.Assert.check(index_js_3.Config.TIMESTAMP.PROJECT_ID.satisfy(this.projectID.length), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "project id length out of range"));
        index_js_4.Assert.check(index_js_3.Config.TIMESTAMP.DATA.satisfy(this.data.length), index_js_4.MitumError.detail(index_js_4.ECODE.INVALID_FACT, "data length out of range"));
        this._hash = this.hashing();
    }
    toBuffer() {
        return Buffer.concat([
            super.toBuffer(),
            Buffer.from(this.projectID),
            this.requestTimeStamp.toBuffer("fill"),
            Buffer.from(this.data),
            this.currency.toBuffer(),
        ]);
    }
    toHintedObject() {
        return Object.assign(Object.assign({}, super.toHintedObject()), { projectid: this.projectID, request_timestamp: this.requestTimeStamp.v, data: this.data });
    }
    get operationHint() {
        return index_js_2.HINT.TIMESTAMP.APPEND.OPERATION;
    }
}
exports.AppendFact = AppendFact;
//# sourceMappingURL=append.js.map