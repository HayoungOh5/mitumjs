"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
const index_js_1 = require("../../common/index.js");
class Item {
    constructor(hint) {
        this.hint = new index_js_1.Hint(hint);
    }
    toHintedObject() {
        return {
            _hint: this.hint.toString()
        };
    }
}
exports.Item = Item;
//# sourceMappingURL=item.js.map