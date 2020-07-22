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
        console.log("TODO: create meaningful errors");
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
            case ErrorCode.DID_RESOLUTION_ERROR: {
                error.description = "Could not resolve DID.";
                return error;
            }
            case ErrorCode.WRONG_NUMBER_OF_DATA_FIELDS: {
                error.description = "Wrong number of data fields. The data field string must contain exactly " + _params[0] + " '" + _params[1] + "' characters.";
                return error;
            }
            case ErrorCode.WRONG_VERSION_LENGTH: {
                error.description = "Wrong version length. Version data field must consist of 3 character.";
                return error;
            }
            case ErrorCode.WRONG_VERSION: {
                error.description = "Wrong version. Version must be " + _params[0] + ".";
                return error;
            }
            case ErrorCode.WRONG_STATE_TYPE_LENGTH: {
                error.description = "Wrong state type length. State type data field must consist of 1 character.";
                return error;
            }
            case ErrorCode.UNKNOWN_STATE_TYPE: {
                error.description = "Unknown state type.";
                return error;
            }
            case ErrorCode.WRONG_REDIRECT_ACCOUNT_LENGTH: {
                error.description = "Wrong redirect account length. Redirect account type data field must consist of " + _params[0] + "character.";
                return error;
            }
            case ErrorCode.INVALID_REDIRECT_ACCOUNT: {
                error.description = "Invalid redirect account. The redirect account is not a valid Ardor account.";
                return error;
            }
            case ErrorCode.PAYLOAD_REFERENCE_TOO_LONG: {
                error.description = "Payload is too long. Has to be less than " + _params[0] + " character.";
                return error;
            }
            case ErrorCode.INVALID_PROPERTY_NAME: {
                error.description = "Invalid property name.";
                return error;
            }
            case ErrorCode.PAYLOAD_NOT_FOUND: {
                error.description = "DID Document payload not found.";
                return error;
            }
            case ErrorCode.INVALID_PAYLOAD: {
                error.description = "Invalid DID Document payload.";
                return error;
            }
            case ErrorCode.TOO_MANY_ROTATION_HOPS: {
                error.description = "Too many rotation hops.";
                return error;
            }
            default:
                return { code: ErrorCode.UNKNOWN, description: "An unknown error occurred." };
        }
    }
}