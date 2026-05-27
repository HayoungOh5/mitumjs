import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const contract = "0x310a76f09964dcb02e81BC4B3A0496c48024EDCBfca";

const func = "GetDIDValidity";
const param = { did: "did:fpu:03f11a0c921b00672c5b4e798d7c63f8044cd5e1f021093fd03ad66ae9222e7207fpu"};

const getData = async () => {
    const res = await mitum.program.query(contract, func, param);
    console.log(res);
};

getData();