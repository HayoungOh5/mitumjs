import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const sender = "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca";
const privatekey = "41f08256757d96a522e6d36a097bd2f761109059b72eb6589ff827f7ac877d30fpr";
const currency = "MCC";
const contract = "0xa830e5caD8353f54657Ece7A84B1D2E166AF31dEfca";

const func = "EarnMileage";
const calldata = {
    "anchorID": "earn-test-2026-0526",
    "merkleRoot":"0123456789012345678901234567890123456789012345678901234567891234", 
};

const op = mitum.program.call(contract, sender, currency, func, calldata);
op.sign(privatekey);

const sendOp = async () => {
    const res = await mitum.operation.send(op);
    console.log(res);
    const receipt = await res.wait(30000,1000);
    console.log(receipt);
};
sendOp();