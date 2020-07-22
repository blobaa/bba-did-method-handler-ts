import { DID_FIELD_SEPARATOR, DID_METHOD_IDENTIFIER, DID_PREFIX, NUMBER_OF_DID_LONG_FIELDS, NUMBER_OF_DID_SHORT_FIELDS } from "../../constants";
import { DIDNetworkType, Error, ErrorCode } from "../../types";
import ErrorHelper, { noError } from "./ErrorHelper";


export default class DID {
    public prefix = DID_PREFIX;
    public method = DID_METHOD_IDENTIFIER;
    public networkType = DIDNetworkType.MAINNET;
    public fullHash = "";

    constructor(didFields?: DID) {
        this.prefix = (didFields && didFields.prefix) || DID_PREFIX;
        this.method = (didFields && didFields.method) || DID_METHOD_IDENTIFIER;
        this.networkType = (didFields && didFields.networkType) || DIDNetworkType.MAINNET;
        this.fullHash = (didFields && didFields.fullHash) || "";
    }


    public consumeDIDString(didString: string): Error {
        const didFields = didString.split(DID_FIELD_SEPARATOR);

        const error = this.checkDID(didFields);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        this.prefix = didFields[0];
        this.method = didFields[1];
        if (didFields.length === NUMBER_OF_DID_LONG_FIELDS) {
            this.networkType = didFields[2] as DIDNetworkType;
            didFields.splice(2, 1);
        } else {
            this.networkType = DIDNetworkType.MAINNET;
        }
        this.fullHash = didFields[2];

        return noError;
    }


    public checkDID(didFields: string[]): Error {
        const _didFields = [ ...didFields ];

        if (didFields.length !== NUMBER_OF_DID_SHORT_FIELDS && didFields.length !== NUMBER_OF_DID_LONG_FIELDS) {
            const _error = ErrorHelper.createError(ErrorCode.WRONG_NUMBER_OF_DID_FIELDS);
            return _error;
        }

        if (didFields.length === NUMBER_OF_DID_LONG_FIELDS) {
            const _error = this.checkNetworkType(didFields[2]);
            if (_error.code !== ErrorCode.NO_ERROR) {
                return _error;
            }
            _didFields.splice(2, 1);
        }

        let error = this.checkPrefix(_didFields[0]);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        error = this.checkMethod(_didFields[1]);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        error = this.checkTxHash(_didFields[2]);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        return noError;
    }


    public checkNetworkType(networkType: string): Error {
        if (networkType !== DIDNetworkType.MAINNET && networkType !== DIDNetworkType.TESTNET) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_DID_NETWORK_TYPE);
            return error;
        }
        return noError;
    }


    public checkPrefix(prefix: string): Error {
        if (prefix !== DID_PREFIX) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_DID_IDENTIFIER);
            return error;
        }
        return noError;
    }


    public checkMethod(method: string): Error {
        if (method !== DID_METHOD_IDENTIFIER) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_DID_METHOD);
            return error;
        }
        return noError;
    }


    public checkTxHash(txHash: string): Error {
        const isHex = /[0-9A-Fa-f]{64}/g;

        if (txHash.length !== 64 || !isHex.test(txHash)) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_DID_METHOD_SPECIFIC_IDENTIFIER);
            return error;
        }
        return noError;
    }


    public createDidString = (): string => {
        const networkType = this.networkType === DIDNetworkType.MAINNET ? "" : DIDNetworkType.TESTNET + DID_FIELD_SEPARATOR;
        let DidString = "";
        DidString += this.prefix + DID_FIELD_SEPARATOR;
        DidString += this.method + DID_FIELD_SEPARATOR;
        DidString += networkType;
        DidString += this.fullHash;

        return DidString;
    }
}