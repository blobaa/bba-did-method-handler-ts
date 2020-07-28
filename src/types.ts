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

    DID_RESOLUTION_ERROR,               // 508

    WRONG_NUMBER_OF_DATA_FIELDS,        // 509
    WRONG_VERSION_LENGTH,               // 510
    WRONG_VERSION,                      // 511
    WRONG_STATE_TYPE_LENGTH,            // 512
    UNKNOWN_STATE_TYPE,                 // 513
    WRONG_REDIRECT_ACCOUNT_LENGTH,      // 514
    INVALID_REDIRECT_ACCOUNT,           // 515
    WRONG_DIDDOC_STORAGE_TYPE_LENGTH,   // 516
    UNKNOWN_DIDDOC_STORAGE_TYPE,        // 517
    DIDDOC_REFERENCE_TOO_LONG,          // 518
    INVALID_PROPERTY_NAME,              // 519
    TOO_MANY_ROTATION_HOPS,             // 520

    DID_DEACTIVATED,                    // 521

    DIDDOC_NOT_FOUND,                   // 522
    INVALID_DIDDOC,                     // 523

    WRONG_CONTROLLER_ACCOUNT,           // 524
    SAME_CONTROLLER_ACCOUNTS            // 525
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
    didDocument: objectAny;
    passphrase: string;
    isTestnetDid?: boolean;
    fee?: number;
    feeNQT?: number;
}

export type CreateDIDResponse = {
    did: string;
    didDocument: objectAny;
}


export type UpdateDIDDocumentParams = {
    newDidDocument: objectAny;
    passphrase: string;
    did: string;
    fee?: number;
    feeNQT?: number;
}

export type UpdateDIDDocumentResponse = {
    newDidDocument: objectAny;
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
    didDocument: objectAny;
}

export interface IResolution {
    createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
    updateDIDDocument(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse>;
    updateDIDController(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse>;
    deactivateDID(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse>;
    resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>;
}