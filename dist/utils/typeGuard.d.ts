import { Operation as OP, Fact, UserOperation, FactJson } from "../operation/base";
import { ErrorResponse, SuccessResponse, HintedObject } from "../types";
import { Address } from "../key";
export declare const isOpFact: (operation: any) => operation is OP<Fact>;
export declare const isHintedObject: (object: any) => object is HintedObject;
export declare const isUserOp: (userOperation: any) => userOperation is UserOperation<Fact>;
export declare const isHintedObjectFromUserOp: (object: any) => object is HintedObject;
export declare const isErrorResponse: (response: ErrorResponse | SuccessResponse) => response is ErrorResponse;
export declare const isSuccessResponse: (response: ErrorResponse | SuccessResponse) => response is SuccessResponse;
export declare const isBase58Encoded: (value: string) => boolean;
export declare const validateDID: (did: string, id?: boolean) => Address;
export declare const isFactJson: (obj: unknown) => obj is FactJson;
