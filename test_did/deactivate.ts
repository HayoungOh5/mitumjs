import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const sender = "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca";
const privatekey = "41f08256757d96a522e6d36a097bd2f761109059b72eb6589ff827f7ac877d30fpr";
const currency = "MCC";
const contract = "0x310a76f09964dcb02e81BC4B3A0496c48024EDCBfca";

const func = "DeactivateDID";
const calldata = {
    "did":"did:fpu:03f11a0c921b00672c5b4e798d7c63f8044cd5e1f021093fd03ad66ae9222e7207fpu", 
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