import { Address } from "../key";
import { SuccessResponse } from "../types";
export declare const calculateAllowance: (response: SuccessResponse, owner: string | Address, approved: string | Address) => {
    amount: string;
};
