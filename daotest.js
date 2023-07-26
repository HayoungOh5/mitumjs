const { Mitum } = require("./cjs");

const mitum = new Mitum("http://127.0.0.1:54320");

const test = async () => {
  const pv1 = "Auf6amfGtuHRx5dbhvhGNpwt1EtLG4ZTnbriEiuihDfJmpr";
  const pb1 = "27SnBRSvhX9eEswL4SXVRaewhoxuK6jVLUNyfWMThqHsZmpu";
  const a1 = "5zPANS8TqGwvVh1bghiFQpX2v4GqPsW2Rx1xtonNPMsSmca";

  const pv2 = "96UQnof9743WAykeq6a3f54vg9MENicWCrrqN9yam9aZmpr";
  const pb2 = "oxaoi8FuZpLJkEU8kStm8dndhwbo4FtfcCiJo76MkpiQmpu";
  const a2 = "2gWeBMRnZ8kmwU7dvJgv3rHpui7ksHMRKLjJiPUsbBAAmca";

  const pv3 = "CHNoLNrykannTec3L1Aa1kXsDkC2QS2tDXrTxhHAcySwmpr";
  const pb3 = "28V9psXoGyjQ5cVtDLSFddHSaBnMYV95Y8kpJUk4rQKREmpu";
  const a3 = "3a9ooHpDo2MTLcNS6MJKjFeYv59zFyfzm6f3cVVihBZTmca";

  const pv4 = "6XXWmrBHyeX3q9n7DHx6g1et2md6KqNZR5Pdwe5cSDqZmpr";
  const pb4 = "2BMCPdRL6qgk54he4Zh1H6DYpNcmLDdstZDTiuJSQt6Aqmpu";
  const a4 = "5qA26ygWafSaiqJo7hwtrJBeFaz3ZBgJwnW6SKq2ZMVdmca";

  const contractPubkey = "diLUcZugeDFW6ftQdcjdz8Ks1KBGiACo9GAcKQUgwFdfmpu";
  const contractAddress = "2VKEH78tLMJ71KXzYQUFej5LmwprqiRSC44E2ax2tn8Bmca";

  const currencyID = "MCC";

  // create contract
  //   const o1 = mitum.contract.create(a1, contractPubkey, currencyID, 100);
  //   const s1 = mitum.operation.sign(pv1, o1);
  //   const res = await mitum.operation.send(s1);
  //   console.log("contract 생성: ", res.status);

  // 계정 생성
  //   const o = mitum.account.create(a1, pb4, currencyID, 77777);
  //   const s = mitum.operation.sign(pv1, o);
  //   const res = await mitum.operation.send(s);
  //   console.log(res.status);

  const serviceId = "SIT";
  const serviceId2 = "SST";
  const serviceId3 = "SSP";
  mitum.dao.setContractAddress(contractAddress);
  mitum.dao.setServiceId(serviceId);

  // create dao service
  const option01 = "crypto";
  const option02 = "biz";
  const option03 = "any"; // must throw error
  const voteToken = "MCC";
  const threshold = 88888;
  const fee = 100;
  const proposers = [];
  const waitingTime = 180000;
  const registrationPeriod = 180000;
  const preSnapPeriod = 180000;
  const votingPeriod = 180000;
  const postSnapPeriod = 180000;
  const executionDelay = 180000;
  const turnout = 0;
  const quorum = 0;
  const daoData = {
    serviceId: serviceId,
    option: option01,
    voteToken: voteToken,
    threshold: threshold,
    fee: fee,
    proposers: proposers,
    waitingTime: waitingTime,
    registrationPeriod: registrationPeriod,
    preSnapPeriod: preSnapPeriod,
    votingPeriod: votingPeriod,
    postSnapPeriod: postSnapPeriod,
    executionDelay: executionDelay,
    turnout: turnout,
    quorum: quorum,
  };
  const o = mitum.dao.createDAOService(a1, daoData, currencyID);
  // const s = mitum.operation.sign(pv1, o);
  // const res = await mitum.operation.send(s);
  console.log(o);
};

test();
