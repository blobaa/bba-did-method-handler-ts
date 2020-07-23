import { CreateDIDParams, CreateDIDResponse, ResolveDIDParams, ResolveDIDResponse, RevokeDIDParams, RevokeDIDResponse, UpdateDIDControllerParams, UpdateDIDControllerResponse, UpdateDIDDocumentParams, UpdateDIDDocumentResponse } from "../types";

/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export type objectAny = {[name: string]: any};


export interface ICreationService {
    run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
}

export interface IUpdatePayloadService {
    run(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse>;
}

export interface IUpdateControllerService {
    run(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse>;
}

export interface IResolutionService {
    run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>;
}

export interface IRevocationService {
    run(url: string, params: RevokeDIDParams): Promise<RevokeDIDResponse>;
}


export interface IPayloadStorage {
    retrieveData(reference: string): Promise<objectAny>;
    storeData(data: objectAny): Promise<string>;
}