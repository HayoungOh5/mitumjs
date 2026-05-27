import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const contract = "0xa830e5caD8353f54657Ece7A84B1D2E166AF31dEfca";

const func = "GetEarnServiceMerkleRootByAnchorID";
const param = { anchorID: "earn-test-2026-0526"};

const getData = async () => {
    const res = await mitum.program.query(contract, func, param);
    console.log(res);
};

getData();