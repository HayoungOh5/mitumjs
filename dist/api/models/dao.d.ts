import { Address } from "../../key";
import { IP } from "../../types";
declare function getModel(api: string | IP, contract: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getProposal(api: string | IP, contract: string | Address, proposalID: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getApproved(api: string | IP, contract: string | Address, proposalID: string, registrant: string | Address, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getVoters(api: string | IP, contract: string | Address, proposalID: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare function getVotingStatus(api: string | IP, contract: string | Address, proposalID: string, delegateIP: string | IP): Promise<import("axios").AxiosResponse<any, any>>;
declare const _default: {
    getModel: typeof getModel;
    getProposal: typeof getProposal;
    getApproved: typeof getApproved;
    getVoters: typeof getVoters;
    getVotingStatus: typeof getVotingStatus;
};
export default _default;
