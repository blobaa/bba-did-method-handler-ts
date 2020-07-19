import { objectAny } from "../internal-types";
import { Error, ErrorCode } from "../../types";


export const noError: Error = {
    code: ErrorCode.NO_ERROR,
    description: "No error occurred. Everything went well."
};


export default class ErrorHelper {

    public static getError(error: objectAny): Error {
        if (error.syscall) {
            return {
                code: ErrorCode.CONNECTION_ERROR,
                description: "Connection error. Could not connect to node."
            };
        }
        if (error.errorCode) {
            return {
                code: ErrorCode.NODE_ERROR,
                description: error.errorDescription
            };
        }
        return error as Error;
    }


    public static createError(errorCode: ErrorCode, params?: string[]): Error {
        const error: Error = {
            code: errorCode,
            description: ""
        };

        const _params = params || [];

        switch (errorCode) {

            case ErrorCode.WRONG_NUMBER_OF_DID_FIELDS: {
                error.description = "Wrong number of did fields.";
                return error;
            }
            case ErrorCode.INVALID_DID_NETWORK_TYPE: {
                error.description = "Invalid DID network type.";
                return error;
            }
            case ErrorCode.INVALID_DID_IDENTIFIER: {
                error.description = "Invalid DID identifier.";
                return error;
            }
            case ErrorCode.INVALID_DID_METHOD: {
                error.description = "Invalid DID method.";
                return error;
            }
            case ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER: {
                error.description = "Invalid DID method specific identifier.";
                return error;
            }
            default:
                return { code: ErrorCode.UNKNOWN, description: "An unknown error occurred." };
        }
    }
}