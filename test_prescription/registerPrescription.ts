import { Mitum } from "../src/index";


const rpcurl = "http://127.0.0.1:54320";
const mitum = new Mitum(rpcurl);

const sender = "0x4526f3D0EdC63D9EaeCD94D56551e0f061CFCa47fca";
const privatekey = "41f08256757d96a522e6d36a097bd2f761109059b72eb6589ff827f7ac877d30fpr";
const currency = "MCC";
const contract = "0x62076574c36E1d1c24C711e562a7CFA15ed0e995fca";
const func = "RegisterPrescription";

// Current Unix timestamp (seconds)
const now = Math.floor(Date.now() / 1000);

// Example: expires after 1 day
//const endDate = now + 60 * 60 * 24;

const endDate = now + 60

const calldata = {
  prescriptionHash: "abcde",
  prescribeDate: now.toString(),
  endDate: endDate.toString(),
  hospital: "choi hospital",
};

const op = mitum.program.call(
  contract,
  sender,
  currency,
  func,
  calldata
);

op.sign(privatekey);

const sendOp = async () => {
  const res = await mitum.operation.send(op);

  console.log(res);

  const receipt = await res.wait(
    30000,
    1000
  );

  console.log(receipt);
};

sendOp();