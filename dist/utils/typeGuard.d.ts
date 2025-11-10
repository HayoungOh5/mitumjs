import type { BaseOperation } from "../operation/base/operation";
import type { Fact } from "../operation/base/fact";
import { ErrorResponse, SuccessResponse, HintedObject } from "../types";
export declare const isOpFact: (operation: any) => operation is BaseOperation<Fact>;
export declare const isHintedObject: (object: any) => object is HintedObject;
export declare const isHintedObjectFromUserOp: (object: any) => object is HintedObject;
export declare const isErrorResponse: (response: ErrorResponse | SuccessResponse) => response is ErrorResponse;
export declare const isSuccessResponse: (response: ErrorResponse | SuccessResponse) => response is SuccessResponse;
export declare const isBase58Encoded: (value: string) => boolean;
