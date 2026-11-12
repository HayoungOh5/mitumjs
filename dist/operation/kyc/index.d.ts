import { CreateServiceFact } from "./create-service";
import { AddControllerFact } from "./add-controller";
import { RemoveControllerFact } from "./remove-controller";
import { AddCustomerFact } from "./add-customer";
import { UpdateCustomerFact } from "./update-customer";
import { ContractGenerator, BaseOperation } from "../base";
import { Address } from "../../key/address";
import { CurrencyID } from "../../common";
import { Bool, IP } from "../../types";
export declare class KYC extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    createService(contract: string | Address, sender: string | Address, currency: string | CurrencyID): BaseOperation<CreateServiceFact>;
    addController(contract: string | Address, sender: string | Address, controller: string | Address, currency: string | CurrencyID): BaseOperation<AddControllerFact>;
    addCustomer(contract: string | Address, sender: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID): BaseOperation<AddCustomerFact>;
    removeController(contract: string | Address, sender: string | Address, controller: string | Address, currency: string | CurrencyID): BaseOperation<RemoveControllerFact>;
    updateCustomer(contract: string | Address, sender: string | Address, customer: string | Address, status: boolean | Bool, currency: string | CurrencyID): BaseOperation<UpdateCustomerFact>;
}
