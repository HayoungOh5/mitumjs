import { Mitum } from "../src/index";

const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const contract = "0x62076574c36E1d1c24C711e562a7CFA15ed0e995fca";
const param = { prescriptionHash: "abcde"};

const getData = async () => {
    const res = await mitum.program.query(contract, "GetPrescriptionInfo", param);
    if ("data" in res){
        console.log(res.data)
    };
};

getData();