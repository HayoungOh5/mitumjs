import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const contract = "0x304C950C2136f7Cf50C67d8C9B87a6d7962DaC91fca";

const getData = async (func: string, param?: Record<string, string>) => {
    const res = await mitum.program.query(contract, func, param);

    if ("data" in res) {
        console.log(res.data);
    }
};

const owner = "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca";
const operator = "0xfa472727F3996F36E4a279D08ecBE462614b96CAfca";


async function main() {
    await getData("GetApproved", { tokenID: "0" });
    await getData("IsApprovedForAll", {owner:owner, operator: operator})
}

main().catch(console.error);