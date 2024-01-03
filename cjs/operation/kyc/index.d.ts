import { CreateServiceFact } from "./create-service.js";
import { AddControllerFact } from "./add-controller.js";
import { RemoveControllerFact } from "./remove-controller.js";
import { AddCustomerFact } from "./add-customer.js";
import { UpdateCustomerFact } from "./update-customer.js";
import { ContractGenerator, Operation } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Bool, IP } from "../../types/index.js";
export declare class KYC extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    createService(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID): Operation<CreateServiceFact>;
    addController(contractAddr: string | Address, sender: string | Address, controller: string | Address, currency: string | CurrencyID): Operation<AddControllerFact>;
    addCustomer(contractAddr: string | Address, sender: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID): Operation<AddCustomerFact>;
    removeController(contractAddr: string | Address, sender: string | Address, controller: string | Address, currency: string | CurrencyID): Operation<RemoveControllerFact>;
    updateCustomer(contractAddr: string | Address, sender: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID): Operation<UpdateCustomerFact>;
}
