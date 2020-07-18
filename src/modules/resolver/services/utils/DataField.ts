
import { DATA_FIELD_SEPARATOR, DUMMY_ACCOUNT_RS, PROTOCOL_IDENTIFIER, PROTOCOL_VERSION } from "../../../../constants";
import { PayloadStorageType, State } from "../../../../types";


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


    public setDidId = (id: string): string => {
        return id.startsWith(PROTOCOL_IDENTIFIER) ? id : PROTOCOL_IDENTIFIER + id;
    }


    public createDataFieldsString = (): string => {
        let dataFieldString = "";
        dataFieldString += this.version + DATA_FIELD_SEPARATOR;
        dataFieldString += this.state + DATA_FIELD_SEPARATOR;
        dataFieldString += this.redirectAccount + DATA_FIELD_SEPARATOR;
        dataFieldString += this.payloadStorageType + DATA_FIELD_SEPARATOR;
        dataFieldString += this.payloadReference;

        return dataFieldString;
    }
}