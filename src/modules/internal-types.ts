import { CreateDIDParams, CreateDIDResponse, ResolveDIDParams, ResolveDIDResponse, DeactivateDIDParams, DeactivateDIDResponse, UpdateDIDControllerParams, UpdateDIDControllerResponse, UpdateDIDDocumentParams, UpdateDIDDocumentResponse } from "../types";

/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/
export type objectAny = {[name: string]: any};


export interface IDIDCreationService {
    run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
}

export interface IDIDDocumentUpdateService {
    run(url: string, params: UpdateDIDDocumentParams): Promise<UpdateDIDDocumentResponse>;
}

export interface IDIDControllerUpdateService {
    run(url: string, params: UpdateDIDControllerParams): Promise<UpdateDIDControllerResponse>;
}

export interface IDIDResolutionService {
    run(url: string, params: ResolveDIDParams): Promise<ResolveDIDResponse>;
}

export interface IDIDRevocationService {
    run(url: string, params: DeactivateDIDParams): Promise<DeactivateDIDResponse>;
}


export interface IDataStorage {
    retrieveData(reference: string): Promise<string>;
    storeData(data: string): Promise<string>;
}