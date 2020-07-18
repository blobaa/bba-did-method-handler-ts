import { Error, ErrorCode } from "../src/types";

export const PROTOCOL_VERSION = "001";

export const DATA_FIELD_SEPARATOR = "|";
export const PROTOCOL_IDENTIFIER = "did://";
export const DID_ID_LENGTH = 20;
export const DUMMY_ACCOUNT_RS = "0000-0000-0000-00000";
export const ACCOUNT_PREFIX = "ARDOR-";
export const NUMBER_OF_DATA_FIELDS = 5;

export const MAX_PAYLOAD_LENGTH = 120;

export const MAX_DEPRECATION_HOPS = 20;
export const REDIRECT_ACCOUNT_CHARACTER_LENGTH = 20;

export const DATA_CLOUD_NAME = "blobaa-did-document-payload";

export const DID_PREFIX = "did";
export const DID_METHOD_IDENTIFIER = "baa";
export const DID_FIELD_SEPARATOR = ":";

export const noError: Error = {
    code: ErrorCode.NO_ERROR,
    description: "No error occurred. Everything went well."
};