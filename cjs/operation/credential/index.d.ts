import { CreateServiceFact } from "./create-service.js";
import { AddTemplateFact } from "./add-template.js";
import { AssignFact } from "./assign.js";
import { RevokeFact } from "./revoke.js";
import { ContractGenerator, Operation } from "../base/index.js";
import { Address } from "../../key/index.js";
import { CurrencyID } from "../../common/index.js";
import { Big, Bool, IP, ShortDate } from "../../types/index.js";
type templateData = {
    templateID: string;
    templateName: string;
    serviceDate: string | ShortDate;
    expirationDate: string | ShortDate;
    templateShare: boolean | Bool;
    multiAudit: boolean | Bool;
    displayName: string;
    subjectKey: string;
    description: string;
    creator: string | Address;
};
type issueData = {
    holder: string | Address;
    templateID: string;
    id: string;
    value: string;
    validFrom: string | number | Big;
    validUntil: string | number | Big;
    did: string;
};
export declare class Credential extends ContractGenerator {
    constructor(networkID: string, api?: string | IP, delegateIP?: string | IP);
    createService(contractAddr: string | Address, sender: string | Address, currency: string | CurrencyID): Operation<CreateServiceFact>;
    addTemplate(contractAddr: string | Address, sender: string | Address, data: templateData, currency: string | CurrencyID): Operation<AddTemplateFact>;
    issue(contractAddr: string | Address, sender: string | Address, data: issueData, currency: string | CurrencyID): Operation<AssignFact>;
    revoke(contractAddr: string | Address, sender: string | Address, holder: string | Address, templateID: string, id: string, currency: string | CurrencyID): Operation<RevokeFact>;
    getServiceInfo(contractAddr: string | Address): Promise<any>;
    getCredentialInfo(contractAddr: string | Address, templateID: string, credentialID: string): Promise<any>;
    getTemplate(contractAddr: string | Address, templateID: string): Promise<any>;
    getAllCredentials(contractAddr: string | Address, templateID: string): Promise<any>;
    claimCredential(contractAddr: string | Address, holder: string | Address): Promise<any>;
}
export {};
