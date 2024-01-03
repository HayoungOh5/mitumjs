"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomN = void 0;
const pub_js_1 = require("./pub.js");
const keypair_js_1 = require("./keypair.js");
const index_js_1 = require("../node/index.js");
const index_js_2 = require("../error/index.js");
function getRandomN(n, f) {
    index_js_2.Assert.get(index_js_1.Config.KEYS_IN_ACCOUNT.satisfy(n)).excute();
    n = Math.floor(n);
    let weight = Math.floor(index_js_1.Config.THRESHOLD.max / n);
    if (index_js_1.Config.THRESHOLD.max % n) {
        weight += 1;
    }
    const ks = [];
    const kps = [];
    for (let i = 0; i < n; i++) {
        kps.push(f());
        ks.push(new pub_js_1.PubKey(kps[i].publicKey, weight));
    }
    return {
        keys: new pub_js_1.Keys(ks, index_js_1.Config.THRESHOLD.max),
        keypairs: kps,
    };
}
const randomN = (n, option) => {
    return getRandomN(n, () => keypair_js_1.KeyPair.random(option));
};
exports.randomN = randomN;
//# sourceMappingURL=random.js.map