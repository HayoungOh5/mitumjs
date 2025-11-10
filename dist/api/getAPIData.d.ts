import { AxiosResponse } from "axios";
import { SuccessResponse, ErrorResponse } from "../types";
export declare function getAPIData(f: () => Promise<AxiosResponse>, _links?: boolean): Promise<SuccessResponse | ErrorResponse>;
