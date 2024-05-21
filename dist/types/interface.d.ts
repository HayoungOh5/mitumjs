/// <reference types="node" />
import { HintedObject } from "./hinted";
export interface IBuffer {
    toBuffer(): Buffer;
}
export interface IHintedObject {
    toHintedObject(): HintedObject;
}
export interface IString {
    toString(): string;
}
export type error_code = {
    pcode: string[];
    dcode: string[];
};
export interface ErrorResponse {
    status?: number;
    method: string | undefined;
    url: string | undefined;
    error_code: error_code;
    request_body: string | undefined;
    error_message: string;
}
export interface SuccessResponse {
    status?: number;
    method: string | undefined;
    url: string | undefined;
    request_body: string | undefined;
    data: any;
}
