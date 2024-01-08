import Mitum from "./dist/bundle.esm.mjs";

const mitum = new Mitum("http://protocon.asuscomm.com:18320");

const keys = mitum.account.etherKeys(2);
console.log(keys);