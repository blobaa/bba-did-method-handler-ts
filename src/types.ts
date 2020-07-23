import { BroadcastTransactionResponse } from "@blobaa/ardor-ts";

/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export type secureAny = any; // same as any, but used when it's intended and secure

export type objectAny = {[name: string]: secureAny};


export type Error = {
    code: ErrorCode;
    description: string;
};

export enum ErrorCode {
    NO_ERROR = -1,
    UNKNOWN = 500,

    CONNECTION_ERROR,                   // 501
    NODE_ERROR,                         // 502

    WRONG_NUMBER_OF_DID_FIELDS,         // 503
    INVALID_DID_NETWORK_TYPE,           // 504
    INVALID_DID_IDENTIFIER,             // 505
    INVALID_DID_METHOD,                 // 506
    INVALID_DID_METHOD_SPECIFIC_IDENTIFIER,  // 507

    DID_RESOLUTION_ERROR,

    WRONG_NUMBER_OF_DATA_FIELDS,
    WRONG_VERSION_LENGTH,
    WRONG_VERSION,
    WRONG_STATE_TYPE_LENGTH,
    UNKNOWN_STATE_TYPE,
    WRONG_REDIRECT_ACCOUNT_LENGTH,
    INVALID_REDIRECT_ACCOUNT,
    PAYLOAD_REFERENCE_TOO_LONG,
    INVALID_PROPERTY_NAME,
    TOO_MANY_ROTATION_HOPS,

    DID_INACTIVE,

    PAYLOAD_NOT_FOUND,
    INVALID_PAYLOAD,

    WRONG_CONTROLLER_ACCOUNT
}


export enum State {
    ACTIVE = "a",
    INACTIVE = "i",
    DEPRECATED = "d"
}


export enum PayloadStorageType {
    ARDOR_CLOUD_STORAGE = "c"
}


export enum DIDNetworkType {
    MAINNET = "m",
    TESTNET = "t"
}


export type CreateDIDParams = {
    payload: objectAny;
    passphrase: string;
    fee?: number;
    isTestnetDid?: boolean;
    [name: string]: secureAny;
}

export type CreateDIDResponse = {
    did: string;
}


export type UpdateDIDPayloadParams = {
    newPayload: objectAny;
    passphrase: string;
    did: string;
    fee?: number;
    [name: string]: secureAny;
}

export type UpdateDIDPayloadResponse = BroadcastTransactionResponse;


export type UpdateDIDControllerParams = {
    passphrase: string;
    newPassphrase: string;
    did: string;
    fee?: number;
    [name: string]: secureAny;
}

export type UpdateDIDControllerResponse = BroadcastTransactionResponse;


export type RevokeDIDParams = {
    fee?: number;
    [name: string]: secureAny;
}

export type RevokeDIDResponse = BroadcastTransactionResponse;


export type ResolveDIDParams = {
    did: string;
}

export type ResolveDIDResponse = {

}

export interface IResolution {
    createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
    updateDIDPayload(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse>;
    updateDIDController(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse>;
    revokeDID(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse>;
    resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>;
}