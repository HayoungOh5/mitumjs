import { CreateServiceFact } from "./create-service.js";
import { AppendFact } from "./append.js";
import { ContractGenerator, Operation } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, IP } from "../../types/index.js";
export declare class TimeStamp extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    createService(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID): Operation<CreateServiceFact>;
    append(contractAddr: string | Address, sender: string | Address, projectID: string, requestTimeStamp: string | number | Big, data: string, currency: string | CurrencyID): Operation<AppendFact>;
    getServiceInfo(contractAddr: string | Address): Promise<any>;
    getTimestampInfo(contractAddr: string | Address, projectID: string, tid: string | number | Big): Promise<any>;
}
