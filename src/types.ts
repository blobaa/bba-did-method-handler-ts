import { BroadcastTransactionResponse } from "@blobaa/ardor-ts";

/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export type objectAny = {[name: string]: any};

export type Error = {
    code: ErrorCode;
    description: string;
};

export enum ErrorCode {
    NO_ERROR = -1,
    UNKNOWN = 500,
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
}

export type CreateDIDResponse = {
    did: string;
}


export type UpdateDIDPayloadParams = {
    newPayload: objectAny;
    passphrase: string;
    did: string;
    fee?: number;
}

export type UpdateDIDPayloadResponse = BroadcastTransactionResponse;


export type RevokeDIDParams = {

}
export type RevokeDIDResponse = {

}


export type ResolveDIDParams = {

}

export type ResolveDIDResponse = {

}

export interface IResolution {
    createDID(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
    updateDIDPayload(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse>;
    // updateDIDController(url: string, params: UpdateDIDParams): Promise<UpdateDIDResponse>;
    revokeDID(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse>;
    resolveDID(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>;
}