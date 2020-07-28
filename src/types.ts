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
    WRONG_DIDDOC_STORAGE_TYPE_LENGTH,
    UNKNOWN_DIDDOC_STORAGE_TYPE,
    DIDDOC_REFERENCE_TOO_LONG,
    INVALID_PROPERTY_NAME,
    TOO_MANY_ROTATION_HOPS,

    DID_DEACTIVATED,

    DIDDOC_NOT_FOUND,
    INVALID_DIDDOC,

    WRONG_CONTROLLER_ACCOUNT,
    SAME_CONTROLLER_ACCOUNTS
}


export enum State {
    ACTIVE = "a",
    INACTIVE = "i",
    DEPRECATED = "d"
}


export enum DIDDocStorageType {
    ARDOR_CLOUD_STORAGE = "c"
}


export enum DIDNetworkType {
    MAINNET = "m",
    TESTNET = "t"
}


export type CreateDIDParams = {
    didDocument: string;
    passphrase: string;
    isTestnetDid?: boolean;
    fee?: number;
    feeNQT?: number;
}

export type CreateDIDResponse = {
    did: string;
    didDocument: string;
}


export type UpdateDIDDocumentParams = {
    newDidDocument: string;
    passphrase: string;
    did: string;
    fee?: number;
    feeNQT?: number;
}

export type UpdateDIDDocumentResponse = {
    newDidDocument: string;
}

export type UpdateDIDControllerParams = {
    passphrase: string;
    newPassphrase: string;
    did: string;
    fee?: number;
    feeNQT?: number;
}

export type UpdateDIDControllerResponse = {
    newControllerAccount: string;
    oldControllerAccount: string;
};


export type DeactivateDIDParams = {
    did: string;
    passphrase: string;
    fee?: number;
    feeNQT?: number;
}

export type DeactivateDIDResponse = {
    deactivatedDid: string;
};


export type ResolveDIDParams = {
    did: string;
}

export type ResolveDIDResponse = {
    didDocument: string;
}

export interface IResolution {
    createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
    updateDIDDocument(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse>;
    updateDIDController(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse>;
    deactivateDID(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse>;
    resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>;
}