import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const sender = "0xfa472727F3996F36E4a279D08ecBE462614b96CAfca";
const privatekey = "11a09b5b1ef91b05c3690113ab616228a3664d76ae493b41aaed62841f798547fpr";
const currency = "MCC";
const contract = "0x304C950C2136f7Cf50C67d8C9B87a6d7962DaC91fca";
const to = "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca";


const func = "Approve";
const calldata = {
    "to": to,
    "tokenID": "0",
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