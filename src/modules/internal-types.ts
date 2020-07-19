import { CreateDIDParams, CreateDIDResponse, ResolveDIDParams, ResolveDIDResponse, RevokeDIDParams, RevokeDIDResponse, UpdateDIDControllerParams, UpdateDIDControllerResponse, UpdateDIDPayloadParams, UpdateDIDPayloadResponse } from "../types";


export interface ICreationService {
    run(url: string, params: CreateDIDParams): Promise<CreateDIDResponse>;
}

export interface IUpdatePayloadService {
    run(url: string, params: UpdateDIDPayloadParams): Promise<UpdateDIDPayloadResponse>;
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
