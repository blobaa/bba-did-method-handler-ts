
import { DID_METHOD_IDENTIFIER, DID_PREFIX, DID_FIELD_SEPARATOR } from "../../../../constants";
import { DIDNetworkType } from "../../../../types";


export default class DIDFields {
    public prefix = DID_PREFIX;
    public method = DID_METHOD_IDENTIFIER;
    public networkType = DIDNetworkType.MAINNET;
    public fullHash = "";

    constructor(didFields?: DIDFields) {
        this.prefix = (didFields && didFields.prefix) || DID_PREFIX;
        this.method = (didFields && didFields.method) || DID_METHOD_IDENTIFIER;
        this.networkType = (didFields && didFields.networkType) || DIDNetworkType.MAINNET;
        this.fullHash = (didFields && didFields.fullHash) || "";
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