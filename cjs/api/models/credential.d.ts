import { Address } from "../../key/index.js";
import { IP } from "../../types/index.js";
declare function getIssuer(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getCredential(api: string | IP, contract: string | Address, templateID: string, credentialID: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getTemplate(api: string | IP, contract: string | Address, templateID: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getCredentials(api: string | IP, contract: string | Address, templateID: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getCredentialByHolder(api: string | IP, contract: string | Address, holder: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getIssuer: typeof getIssuer;
    getCredential: typeof getCredential;
    getTemplate: typeof getTemplate;
    getCredentials: typeof getCredentials;
    getCredentialByHolder: typeof getCredentialByHolder;
};
export default _default;
