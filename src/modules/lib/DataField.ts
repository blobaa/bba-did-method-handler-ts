
import { account } from "@blobaa/ardor-ts";
import { DATA_FIELD_SEPARATOR, DUMMY_ACCOUNT_RS, PROTOCOL_IDENTIFIER, PROTOCOL_VERSION, NUMBER_OF_DATA_FIELDS, ACCOUNT_PREFIX, REDIRECT_ACCOUNT_CHARACTER_LENGTH, MAX_PAYLOAD_LENGTH, DID_PREFIX } from "../../constants";
import { Error, ErrorCode, PayloadStorageType, State } from "../../types";
import ErrorHelper, { noError } from "./ErrorHelper";


enum DataField {
    VERSION,
    STATE,
    REDIRECT_ACCOUNT,
    PAYLOAD_STORAGE_TYPE,
    PAYLOAD
}


export default class DataFields {
    private _didId = "";

    public version = PROTOCOL_VERSION;
    public state = State.INACTIVE;
    public redirectAccount = DUMMY_ACCOUNT_RS;
    public payloadStorageType = PayloadStorageType.ARDOR_CLOUD_STORAGE;
    public payloadReference = "";


    constructor(dataFields?: DataFields) {
        this.didId = (dataFields && dataFields.didId) || "";
        this.version = (dataFields && dataFields.version) || PROTOCOL_VERSION;
        this.state = (dataFields && dataFields.state) || State.INACTIVE;
        this.redirectAccount = (dataFields && dataFields.redirectAccount) || DUMMY_ACCOUNT_RS;
        this.payloadStorageType = (dataFields && dataFields.payloadStorageType) || PayloadStorageType.ARDOR_CLOUD_STORAGE;
        this.payloadReference = (dataFields && dataFields.payloadReference) || "";
    }


    /*eslint-disable @typescript-eslint/explicit-function-return-type*/
    get didId() {
        return this._didId;
    }
    /*eslint-enable @typescript-eslint/explicit-function-return-type*/


    set didId(value: string) {
        this._didId = this.setDidId(value);
    }


    public setDidId(id: string): string {
        return id.startsWith(PROTOCOL_IDENTIFIER) ? id : PROTOCOL_IDENTIFIER + id;
    }


    public consumeDataFieldString(dataFieldString: string): Error {
        const dataFields = dataFieldString.split(DATA_FIELD_SEPARATOR);

        const error = this.checkDataFields(dataFields);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        this.version = dataFields[DataField.VERSION];
        this.state = State.INACTIVE;
        this.redirectAccount = DUMMY_ACCOUNT_RS;
        this.payloadStorageType = PayloadStorageType.ARDOR_CLOUD_STORAGE;
        this.payloadReference = "";

        this.version = dataFields[DataField.VERSION];
        this.state = dataFields[DataField.STATE] as State;
        this.redirectAccount = dataFields[DataField.REDIRECT_ACCOUNT];
        this.payloadStorageType = dataFields[DataField.PAYLOAD_STORAGE_TYPE] as PayloadStorageType;
        this.payloadReference = dataFields.slice(NUMBER_OF_DATA_FIELDS - 1).join(DATA_FIELD_SEPARATOR);

        return noError;
    }


    public checkDataFields(dataFields: string[]): Error {
        const payloadReference = dataFields.slice(NUMBER_OF_DATA_FIELDS - 1).join(DATA_FIELD_SEPARATOR);
        const _dataFields = dataFields.slice(0, NUMBER_OF_DATA_FIELDS);

        if (_dataFields.length !== NUMBER_OF_DATA_FIELDS) {
            const _error = ErrorHelper.createError(ErrorCode.WRONG_NUMBER_OF_DATA_FIELDS, [ "" + (NUMBER_OF_DATA_FIELDS + 1), DATA_FIELD_SEPARATOR ]);
            return _error;
        }

        let error = this.checkVersion(_dataFields[DataField.VERSION]);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        error = this.checkState(_dataFields[DataField.STATE]);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        error = this.checkRedirectAccount(_dataFields[DataField.REDIRECT_ACCOUNT]);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        error = this.checkPayloadReference(payloadReference);
        if (error.code !== ErrorCode.NO_ERROR) {
            return error;
        }

        return noError;
    }


    public checkVersion(version: string): Error {
        if (version.length !== 3) {
            const error = ErrorHelper.createError(ErrorCode.WRONG_VERSION_LENGTH);
            return error;
        }
        if (version !== PROTOCOL_VERSION) {
            const error = ErrorHelper.createError(ErrorCode.WRONG_VERSION, [ PROTOCOL_VERSION ]);
            return error;
        }
        return noError;
    }


    public checkState(state: string): Error {
        if (state.length !== 1) {
            const error = ErrorHelper.createError(ErrorCode.WRONG_STATE_TYPE_LENGTH);
            return error;
        }
        if (state !== State.ACTIVE && state !== State.INACTIVE && state !== State.DEPRECATED) {
            const error = ErrorHelper.createError(ErrorCode.UNKNOWN_STATE_TYPE);
            return error;
        }
        return noError;
    }


    public checkRedirectAccount(redirectAccount: string): Error {
        const accountPrefix = ACCOUNT_PREFIX;
        if (redirectAccount.length !== REDIRECT_ACCOUNT_CHARACTER_LENGTH) {
            const error = ErrorHelper.createError(ErrorCode.WRONG_REDIRECT_ACCOUNT_LENGTH, [ "" + REDIRECT_ACCOUNT_CHARACTER_LENGTH ]);
            return error;
        }
        if (!account.checkAccountRs(accountPrefix + redirectAccount) && redirectAccount !== DUMMY_ACCOUNT_RS) {
            const error = ErrorHelper.createError(ErrorCode.INVALID_REDIRECT_ACCOUNT);
            return error;
        }
        return noError;
    }


    public checkPayloadReference(payload: string): Error {
        if (payload.length > MAX_PAYLOAD_LENGTH) {
            const error = ErrorHelper.createError(ErrorCode.PAYLOAD_REFERENCE_TOO_LONG, [ "" + MAX_PAYLOAD_LENGTH ]);
            return error;
        }
        return noError;
    }


    public checkDidId(didId: string): Error {
        const _didId = didId.split("//");

        if (_didId.length !== 2 || _didId[0] !== DID_PREFIX + ":") {
            const error = ErrorHelper.createError(ErrorCode.INVALID_PROPERTY_NAME);
            return error;
        }
        return noError;
    }


    public createDataFieldsString(): string {
        let dataFieldString = "";
        dataFieldString += this.version + DATA_FIELD_SEPARATOR;
        dataFieldString += this.state + DATA_FIELD_SEPARATOR;
        dataFieldString += this.redirectAccount + DATA_FIELD_SEPARATOR;
        dataFieldString += this.payloadStorageType + DATA_FIELD_SEPARATOR;
        dataFieldString += this.payloadReference;

        return dataFieldString;
    }
}