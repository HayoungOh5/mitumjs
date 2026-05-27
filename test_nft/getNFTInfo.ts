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

async function main() {
    await getData("BalanceOf", {
        owner: "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca",
    });

    await getData("OwnerOf", { tokenID: "2" });
    await getData("TokenURI", { tokenID: "0" });
    await getData("GetApproved", { tokenID: "0" });
    await getData("Exists", { tokenID: "0" });
    await getData("TotalSupply");
    await getData("Name");
    await getData("Symbol");
    await getData("TokensOfOwner", {
        owner: "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca",
    });
}

main().catch(console.error);